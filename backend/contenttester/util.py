import logging
import random
import time

import openai

from .models import AssessmentChoices

logger = logging.getLogger(__name__)


def openai_chat_completion(
    prompt,
    context_input,
    model="gpt-4",
    temperature=0,
    stop_function=None,
):
    """
    This function is a wrapper around the OpenAI API.
    It provides
     - a backoff/retry mechanism, for the HTTP 429 throttle.
     - a stopping function, for idempotent operation.

    It's good enough for POC but needs a little bit more work.
    The 429 backoff mechanism will fail if the celery job times out,
    meaning that the task is never done.

    It would be better if it kept track of total running time
    and failed gracefully after dispatching a new celery job,
    probably after some random delay.
    """
    wait = None
    while True:
        try:
            # The stop_function is used to work around a race condition.
            #
            # We need the LLM call to be idempotent, but
            # we can't stop many calls being made in parallel.
            # When that happens, first one to succeed should win
            # and the rest should be noops.
            #
            # LLM calls can be queued in this while loop,
            # the calling code can't know what's already in the queue.
            # So we can't determin this at calling time.
            #
            # The stop_function is a way for the calling code
            # to pass in a guard condition.
            # i.e. a way to check if the job was already done
            # by another process.
            #
            # The default None stop_function makes this behavior opt-in
            if stop_function:
                done = stop_function()
                if done:
                    return done

            response = openai.ChatCompletion.create(
                model=model,
                temperature=temperature,
                messages=[
                    {
                        "role": "system",
                        "content": prompt,
                    },
                    {
                        "role": "user",
                        "content": context_input,
                    },
                ],
            )["choices"][0]["message"]["content"]
            # I wonder what those other choices are...
            # maybe we should try to use them all somehow,
            # (since we paid for them all).
            return response
        except openai.error.RateLimitError:
            if wait:
                # this is where we should do the thing with failing gracefully
                # and dispatching a new instance of the task, preemptively
                # before celery kills us for running too long.
                #
                # the liberal use of random.random()
                # is because I want to "diffuse" the workload
                # (smear it out in time). i.e. the opposite of
                # creating a Thundering Herd problem, I don't want
                # waves of tasks hammering the API all at the same time.
                if wait < 100:  # celery has a 5 minute timeout
                    wait = (2 * wait) + (random.random() * 10)
            else:
                wait = random.random() * 10  # approximately 5 seconds
            msg = f"openai.error.RateLimitError: retrying in {wait} seconds"
            logger.warn(msg)
            time.sleep(wait)


def map_bool_to_assessment_choice(input):
    if input.upper() == "TRUE":
        return AssessmentChoices.PASS
    elif input.upper() == "FALSE":
        return AssessmentChoices.FAIL
    return AssessmentChoices.UNSURE

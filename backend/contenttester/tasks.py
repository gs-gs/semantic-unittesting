from mendable import ChatApp
import random
import time

from .celery import app
from .models import (
    Assessment,
    Expectation,
    Job,
    Response,
    Query,
)
from .search import INDEX_NAME, SearchClient
from .util import map_bool_to_assessment_choice, openai_chat_completion


def generate_prompt(expectation):
    prompt_template = f"""Your job is to assess whether the provided text
    meets the following expectation: "{expectation}".

    Your response should be a one-word answer
    which is either 'True' (if the expectation was met),
    'False' (if it wasn't met)
    or 'Unsure' (if you're not sure)."""
    return prompt_template


@app.task(name="assess_response")
def assess_response(response_id, expectation_id):
    response = Response.objects.get(id=response_id)
    expectation = Expectation.objects.get(id=expectation_id)

    prompt = generate_prompt(expectation.value)
    res = openai_chat_completion(prompt, response.value)
    assessment_value = map_bool_to_assessment_choice(res)

    assessment = Assessment.objects.get(expectation=expectation, response=response)
    assessment.value = assessment_value
    assessment.prompt = prompt
    assessment.save()


@app.task(name="query_mendable_ai")
def query_mendable_ai(query_id, job_id):
    query = Query.objects.get(id=query_id)
    api_key = query.topic.site.mendable_api_key
    mendable_bot = ChatApp(api_key=api_key)
    wait = None
    retries = 0
    while True:
        try:
            job = Job.objects.get(id=job_id)
            res = mendable_bot.query(query.value)
            new_response = Response(value=res, query=query, job=job)
            new_response.save()
            return
        except:
            # if we get here, it's most likely because of a rate limit error
            # so we back off and try again (up to a max of 5 times)
            retries += 1
            if retries > 5:
                print("Error querying mendable: max retries reached")
                return
            if wait:
                if wait < 100:
                    wait = (2 * wait) + (random.random() * 10)
            else:
                wait = random.random() * 10
            print(f"Error querying mendable: retrying in {wait} seconds")
            time.sleep(wait)


@app.task(name="add_document_to_index")
def add_document_to_index(id, document):
    SearchClient.get_client().index(index=INDEX_NAME, id=id, document=document)

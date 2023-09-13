from mendable import ChatApp

from .celery import app
from .models import Assessment, Expectation, Response, Query
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

    new_assessment = Assessment(
        value=assessment_value,
        response=response,
        expectation=expectation,
        prompt=prompt,
    )
    new_assessment.save()


@app.task(name="query_mendable_ai")
def query_mendable_ai(query_id):
    query = Query.objects.get(id=query_id)
    api_key = query.topic.site.mendable_api_key
    my_docs_bot = ChatApp(api_key=api_key)
    res = my_docs_bot.query(query.value)

    new_response = Response(value=res, query=query)
    new_response.save()

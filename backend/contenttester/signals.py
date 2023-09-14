"""
When a response is saved,
then we want to evaluate all the associated expectations. 

It might be smarter (less magic) to just overload Response.save()
(rather than using signals like this).
"""
from django.db.models.signals import post_save

# from django.dispatch import receiver
import logging
from .tasks import add_document_to_index, assess_response
from .models import Assessment, Response

logger = logging.getLogger(__name__)


def dispatch_evaluators(sender, **kwargs):
    response = kwargs["instance"]
    for expectation in response.query.expectation_set.all():
        assess_response.delay(response.pk, expectation.pk)


def index_document(sender, **kwargs):
    assessment = kwargs["instance"]
    data = {
        "assessment": assessment.value,
        "expectation": assessment.expectation.value,
        "query": assessment.response.query.value,
        "response": assessment.response.value,
        "response_timestamp": assessment.response.timestamp,
        "site": assessment.response.query.topic.site.title,
        "topic": assessment.response.query.topic.title,
    }

    add_document_to_index.delay(assessment.pk, data)


post_save.connect(dispatch_evaluators, Response)
post_save.connect(index_document, Assessment)

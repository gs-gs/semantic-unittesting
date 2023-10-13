"""
When a response is saved,
then we want to evaluate all the associated expectations. 

It might be smarter (less magic) to just overload Response.save()
(rather than using signals like this).
"""
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db.models.signals import post_save

# from django.dispatch import receiver
import logging
from .tasks import add_document_to_index, assess_response
from .models import Assessment, Job, Response
from .serializers import AssessmentSerializer, ResponseSerializer

logger = logging.getLogger(__name__)


def create_job_event(sender, **kwargs):
    job = kwargs["instance"]
    async_to_sync(get_channel_layer().group_send)(
        "all_jobs",
        {
            "type": "job.create",
            "id": str(job.id),
            "started_on": str(job.started_on),
        },
    )


def create_response_add_event(response):
    assessments = []
    for e in response.query.expectation_set.all():
        a = Assessment(
            response=response,
            expectation=e,
        )
        a.save()
        serializer = AssessmentSerializer(instance=a)
        assessments.append(serializer.data)

    async_to_sync(get_channel_layer().group_send)(
        str(response.job.id),
        {
            "type": "response.add",
            "id": str(response.id),
            "assessments": assessments,
        },
    )


def handle_response_save(sender, **kwargs):
    response = kwargs["instance"]
    create_response_add_event(response)
    for expectation in response.query.expectation_set.all():
        assess_response.delay(response.pk, expectation.pk)


def create_assessment_add_event(assessment):
    serializer = AssessmentSerializer(instance=assessment)
    async_to_sync(get_channel_layer().group_send)(
        str(assessment.response.job.id),
        {
            "type": "assessment.add",
            "id": str(assessment.id),
            "assessment": serializer.data,
        },
    )


def handle_assessment_save(sender, **kwargs):
    assessment = kwargs["instance"]
    if assessment.value:
        create_assessment_add_event(assessment)

    data = {
        "jobId": assessment.response.job.id,
        "assessment": assessment.value,
        "expectation": assessment.expectation.value,
        "query": assessment.response.query.value,
        "response": assessment.response.value,
        "response_timestamp": assessment.response.timestamp,
        "site": assessment.response.query.topic.site.title,
        "topic": assessment.response.query.topic.title,
    }

    add_document_to_index.delay(assessment.pk, data)


post_save.connect(create_job_event, Job)
post_save.connect(handle_response_save, Response)
post_save.connect(handle_assessment_save, Assessment)

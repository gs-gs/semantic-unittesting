"""
When a response is saved,
then we want to evaluate all the associated expectations. 

It might be smarter (less magic) to just overload Response.save()
(rather than using signals like this).
"""
from django.db.models.signals import post_save
from django.dispatch import receiver
import logging
from .tasks import assess_response
from .models import Response

logger = logging.getLogger(__name__)


def dispatch_evaluators(sender, **kwargs):
    """wrapper that matches the signal signature"""
    response = kwargs["instance"]
    response_id = response.pk
    for expectation in response.query.expectation_set.all():
        logger.warn(f"DEBUG: {expectation}")  # DEBUG
        expectation_id = expectation.pk
        assess_response.delay(response_id, expectation_id)

post_save.connect(dispatch_evaluators, Response)

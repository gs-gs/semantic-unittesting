"""
When a response is saved,
then we want to evaluate all the associated expectations. 

It might be smarter (less magic) to just overload Response.save()
(rather than using signals like this).
"""
from django.db.models.signals import post_save
# from django.dispatch import receiver
import logging
from .tasks import assess_response
from .models import Response

logger = logging.getLogger(__name__)

def dispatch_evaluators(sender, **kwargs):
    response = kwargs["instance"]
    for expectation in response.query.expectation_set.all():
        assess_response.delay(response.pk, expectation.pk)

post_save.connect(dispatch_evaluators, Response)

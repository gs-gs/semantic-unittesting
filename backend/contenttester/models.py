from django.db import models


class Site(models.Model):
    title = models.CharField(max_length=200)
    url = models.URLField()

    def __str__(self):
        return self.title


class Topic(models.Model):
    title = models.CharField(max_length=200)
    site = models.ForeignKey(Site, on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class Query(models.Model):
    value = models.TextField()
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)

    def __str__(self):
        return self.value


class Expectation(models.Model):
    title = models.TextField()  # that's a weird name for it
    query = models.ForeignKey(Query, on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class AssessmentChoices(models.TextChoices):
    PASS = ("Pass", "Response is valid")
    FAIL = ("Fail", "Response is invalid")
    UNSURE = ("None", "Unsure of response validity")


class Response(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    value = models.TextField()
    query = models.ForeignKey(Query, on_delete=models.CASCADE)
    # should we have the prompt actually sent?

    def __str__(self):
        return self.value


class Assessment(models.Model):
    value = models.CharField(
        max_length=12,
        choices=AssessmentChoices.choices,
        default=AssessmentChoices.UNSURE,
    )
    response = models.ForeignKey(Response, on_delete=models.CASCADE)
    expectation = models.ForeignKey(Expectation, on_delete=models.CASCADE)
    # should we have the actual prompt/input data
    # and the actual response from the LLM
    # as well as the estimated value?
    #
    # maybe we also want a method to guess the value
    # given the LLM response?
    # that's a very unit-testable thing - lots of fixtures
    # and, if we don't know (unsure) we could query it and make a new fixture,
    #
    # that means we probably want an admin action to re-evaluate
    # the LLM responses and update the value (unsure->T/F)
    #
    # also, idea - maybe the value should be a null-allowable,
    # blank-allowable boolean field (rather than a list).
    # it doesn't matter.

    def __str__(self):
        return self.value
    

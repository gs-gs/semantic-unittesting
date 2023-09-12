from django.db import models


class Site(models.Model):
    title = models.CharField(max_length=200)
    url = models.URLField()


class Topic(models.Model):
    title = models.CharField(max_length=200)
    site = models.ForeignKey(Site, on_delete=models.CASCADE)


class Query(models.Model):
    value = models.TextField()
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)


class Expectation(models.Model):
    title = models.TextField()
    query = models.ForeignKey(Query, on_delete=models.CASCADE)


class AssessmentChoices(models.TextChoices):
    PASS = ("Pass", "Response is valid")
    FAIL = ("Fail", "Response is invalid")
    UNSURE = ("None", "Unsure of response validity")


class Response(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    value = models.TextField()
    query = models.ForeignKey(Query, on_delete=models.CASCADE)


class Assessment(models.Model):
    value = models.CharField(
        max_length=12,
        choices=AssessmentChoices.choices,
        default=AssessmentChoices.UNSURE,
    )
    response = models.ForeignKey(Response, on_delete=models.CASCADE)
    expectation = models.ForeignKey(Expectation, on_delete=models.CASCADE)

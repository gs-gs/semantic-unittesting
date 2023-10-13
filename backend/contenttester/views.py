from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.generics import ListCreateAPIView, RetrieveDestroyAPIView

from .tasks import query_mendable_ai

from .models import Assessment, Expectation, Job, Query, Response, Site, Topic
from .serializers import (
    ExpectationSerializer,
    JobSerializer,
    QuerySerializer,
    ResponseSerializer,
    SiteSerializer,
    TopicSerializer,
)


class ExpectationListView(ListCreateAPIView):
    queryset = Expectation.objects.all()
    serializer_class = ExpectationSerializer


class JobDetailView(RetrieveDestroyAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer


class QueryListView(ListCreateAPIView):
    queryset = Query.objects.all()
    serializer_class = QuerySerializer


class QueryDetailView(RetrieveDestroyAPIView):
    queryset = Query.objects.all()
    serializer_class = QuerySerializer


class ResponseListView(ListCreateAPIView):
    queryset = Response.objects.all()
    serializer_class = ResponseSerializer


class ResponseDetailView(RetrieveDestroyAPIView):
    queryset = Response.objects.all()
    serializer_class = ResponseSerializer


class SiteListView(ListCreateAPIView):
    queryset = Site.objects.all()
    serializer_class = SiteSerializer


class SiteDetailView(RetrieveDestroyAPIView):
    queryset = Site.objects.all()
    serializer_class = SiteSerializer


class TopicListView(ListCreateAPIView):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer


class TopicDetailView(RetrieveDestroyAPIView):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer


def EvaluateSite(request, site_id):
    site = Site.objects.get(id=site_id)
    topics = site.topic_set.all()
    queries = [query for topic in topics for query in topic.query_set.all()]
    num_of_assessments = len(
        [
            expectation
            for query in queries
            for expectation in query.expectation_set.all()
        ]
    )
    job = Job(site=site, num_of_assessments=num_of_assessments)
    job.save()

    for query in queries:
        query_mendable_ai.delay(query.id, job.pk)

    serializer = JobSerializer(instance=job)
    return JsonResponse(serializer.data, status=201)


@login_required
def home(request):
    sites = Site.objects.all()
    context = {"sites": sites}
    return render(request, "home.html", context)


def site_old(request, site_id):
    site = Site.objects.get(id=site_id)
    context = {
        "site_id": site_id,
        "site": site,
        "topics": site.topic_set.all().order_by("title"),
    }
    return render(request, "site.html", context)


def topic_old(request, site_id, topic_id):
    topic = Topic.objects.get(id=topic_id)
    topics = topic.site.topic_set.all().order_by("title")
    context = {
        "site_id": site_id,
        "topic_id": topic_id,
        "topic": topic,
        "topics": topics,
        "queries": topic.query_set.all().order_by("value"),
    }
    return render(request, "topic.html", context)


def query_old(request, site_id, topic_id, query_id):
    query = Query.objects.get(id=query_id)
    topics = query.topic.site.topic_set.all().order_by("title")
    context = {
        "site_id": site_id,
        "topic_id": topic_id,
        "query": query,
        "topics": topics,
        "responses": query.response_set.all().order_by("timestamp"),
    }
    return render(request, "query.html", context)


def response_old(request, site_id, topic_id, query_id, response_id):
    response = Response.objects.get(id=response_id)
    topics = response.query.topic.site.topic_set.all().order_by("title")
    assessments = Assessment.objects.filter(response=response)
    expectations = []
    for assessment in assessments:
        expectations.append(
            {
                "value": assessment.expectation.value,
                "assessment": assessment.value,
            }
        )

    context = {
        "site_id": site_id,
        "topic_id": topic_id,
        "query_id": query_id,
        "topics": topics,
        "response": response,
        "expectations": expectations,
    }
    return render(request, "response.html", context)

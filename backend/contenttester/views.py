from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from rest_framework.generics import ListCreateAPIView, RetrieveDestroyAPIView

from .models import Assessment, Expectation, Query, Response, Site, Topic
from .serializers import (
    ExpectationSerializer,
    QuerySerializer,
    ResponseSerializer,
    SiteSerializer,
    TopicSerializer,
)


class ExpectationListView(ListCreateAPIView):
    queryset = Expectation.objects.all()
    serializer_class = ExpectationSerializer


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

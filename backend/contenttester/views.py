from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render

from .models import Assessment, Query, Response, Site, Topic
from .serializers import (
    QuerySerializer,
    ResponseSerializer,
    SiteSerializer,
    TopicSerializer,
)


def sites(request):
    if request.method == "GET":
        sites = Site.objects.all()
        serializer = SiteSerializer(sites, many=True)
        return JsonResponse(serializer.data, safe=False)


def site(request, site_id):
    if request.method == "GET":
        site = Site.objects.get(id=site_id)
        serializer = SiteSerializer(site)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == "POST":
        return JsonResponse(serializer.data, status=201)


def topic(request, topic_id):
    if request.method == "GET":
        topic = Topic.objects.get(id=topic_id)
        serializer = TopicSerializer(topic)
        return JsonResponse(serializer.data, safe=False)


def query(request, query_id):
    if request.method == "GET":
        query = Query.objects.get(id=query_id)
        serializer = QuerySerializer(query)
        return JsonResponse(serializer.data, safe=False)


def response(request, response_id):
    if request.method == "GET":
        response = Response.objects.get(id=response_id)
        serializer = ResponseSerializer(response)
        return JsonResponse(serializer.data, safe=False)


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

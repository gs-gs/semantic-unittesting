from django.shortcuts import render

from .models import Assessment, Query, Response, Site, Topic


def site(request, site_id):
    site = Site.objects.get(id=site_id)
    context = {
        "site_id": site_id,
        "site": site,
        "topics": site.topic_set.all().order_by("title"),
    }
    return render(request, "site.html", context)


def topic(request, site_id, topic_id):
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


def query(request, site_id, topic_id, query_id):
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


def response(request, site_id, topic_id, query_id, response_id):
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

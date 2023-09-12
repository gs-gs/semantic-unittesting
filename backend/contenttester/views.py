from django.http import HttpResponse
from django.shortcuts import render

from .models import Query, Site, Topic


def site(request, site_id):
    site = Site.objects.get(id=site_id)
    context = {
        "site": site,
        "topics": site.topic_set.all().order_by("title"),
    }
    return render(request, "site.html", context)


def topic(request, topic_id):
    topic = Topic.objects.get(id=topic_id)
    topics = topic.site.topic_set.all().order_by("title")
    context = {
        "topic": topic,
        "topics": topics,
        "queries": topic.query_set.all().order_by("value"),
    }
    return render(request, "topic.html", context)


def query(request, query_id):
    query = Query.objects.get(id=query_id)
    topics = query.topic.site.topic_set.all().order_by("title")
    context = {
        "query": query,
        "topics": topics,
        "responses": query.response_set.all().order_by("timestamp"),
    }
    return render(request, "query.html", context)

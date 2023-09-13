from django.contrib import admin
from logging import getLogger
from .models import Assessment, Expectation, Query, Response, Site, Topic

from .util import query_mendable_ai


logger = getLogger(__name__)


def evaluate_site(modeladmin, request, queryset):
    for obj in queryset:
        topics = obj.topic_set.all()
        queries = [query for topic in topics for query in topic.query_set.all()]

        for query in queries:
            query_mendable_ai.delay(query.id, query.value)


class TopicInline(admin.TabularInline):
    model = Topic
    extra = 0
    readonly_fields = ("title",)


@admin.register(Site)
class SiteAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "url",
    )
    inlines = [TopicInline]
    actions = [evaluate_site]


class QueryInline(admin.TabularInline):
    model = Query
    extra = 0
    readonly_fields = ("value",)


@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    def site_title(self, obj):
        return obj.site.title

    list_display = (
        "title",
        "site_title",
    )
    inlines = [QueryInline]


def execute_query(modeladmin, request, queryset):
    for obj in queryset:
        query_mendable_ai.delay(obj.id, obj.value)


@admin.register(Query)
class QueryAdmin(admin.ModelAdmin):
    def topic_title(self, obj):
        return obj.topic.title

    list_display = (
        "value",
        "topic_title",
    )
    actions = [execute_query]


@admin.register(Expectation)
class ExpectationAdmin(admin.ModelAdmin):
    def query_value(self, obj):
        return obj.query.value

    list_display = (
        "value",
        "query_value",
    )


@admin.register(Response)
class ResponseAdmin(admin.ModelAdmin):
    def query_value(self, obj):
        return obj.query.value

    list_display = (
        "timestamp",
        "value",
        "query_value",
    )


@admin.register(Assessment)
class AssessmentAdmin(admin.ModelAdmin):
    def response_value(self, obj):
        return obj.response.value

    def expectation_value(self, obj):
        return obj.expectation.value

    list_display = (
        "value",
        "response_value",
        "expectation_value",
    )

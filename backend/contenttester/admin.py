from django.contrib import admin
from logging import getLogger
from .models import Assessment, Expectation, Job, Query, Response, Site, Topic

from .tasks import add_document_to_index, assess_response, query_mendable_ai

logger = getLogger(__name__)


def populate_search_index(modeladmin, request, queryset):
    for assessment in Assessment.objects.all():
        document_id = assessment.id
        data = {
            "assessment": assessment.value,
            "expectation": assessment.expectation.value,
            "query": assessment.response.query.value,
            "response": assessment.response.value,
            "response_timestamp": assessment.response.timestamp,
            "site": assessment.response.query.topic.site.title,
            "topic": assessment.response.query.topic.title,
        }

        add_document_to_index(id=document_id, document=data)


def evaluate_site(modeladmin, request, queryset):
    for obj in queryset:
        job = Job(site=obj)
        job.save()
        topics = obj.topic_set.all()
        queries = [query for topic in topics for query in topic.query_set.all()]

        for query in queries:
            query_mendable_ai.delay(query.id, job.id)


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
    actions = [evaluate_site, populate_search_index]


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = (
        "site",
        "started_on",
        "finished_on",
    )


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
        job = Job(site=obj.topic.site)
        job.save()
        query_mendable_ai.delay(obj.id, job.id)


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


def assess_response_against_expectation(modeladmin, request, queryset):
    for obj in queryset:
        for expectation in obj.query.expectation_set.all():
            assess_response.delay(obj.id, expectation.id)


@admin.register(Response)
class ResponseAdmin(admin.ModelAdmin):
    def query_value(self, obj):
        return obj.query.value

    list_display = (
        "timestamp",
        "value",
        "query_value",
    )
    actions = [assess_response_against_expectation]


def add_assessment_to_elastic_search(modeladmin, request, queryset):
    for obj in queryset:
        data = {
            "assessment": obj.value,
            "expectation": obj.expectation.value,
            "query": obj.response.query.value,
            "response": obj.response.value,
            "response_timestamp": obj.response.timestamp,
            "site": obj.response.query.topic.site.title,
            "topic": obj.response.query.topic.title,
        }
        SearchClient.add_search_document(obj.pk, data)


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
    actions = [add_assessment_to_elastic_search]

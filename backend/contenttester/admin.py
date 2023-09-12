from django.contrib import admin

from .models import Assessment, Expectation, Query, Response, Site, Topic


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


@admin.register(Query)
class QueryAdmin(admin.ModelAdmin):
    def topic_title(self, obj):
        return obj.topic.title

    list_display = (
        "value",
        "topic_title",
    )


@admin.register(Expectation)
class ExpectationAdmin(admin.ModelAdmin):
    def query_value(self, obj):
        return obj.query.value

    list_display = (
        "title",
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
        return obj.expectation.title

    list_display = (
        "value",
        "response_value",
        "expectation_value",
    )

from rest_framework import serializers
from .models import Assessment, Expectation, Query, Response, Site, Topic


class SiteBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Site
        fields = ["id", "title", "url"]


class TopicBasicSerializer(serializers.ModelSerializer):
    site = SiteBasicSerializer()

    class Meta:
        model = Topic
        fields = ["id", "title", "site"]


class QueryBasicSerializer(serializers.ModelSerializer):
    topic = TopicBasicSerializer()

    class Meta:
        model = Query
        fields = ["id", "value", "topic"]


class ResponseBasicSerializer(serializers.ModelSerializer):
    query = QueryBasicSerializer()

    class Meta:
        model = Response
        fields = ["id", "value", "timestamp", "query"]


class ExpectationSerializer(serializers.ModelSerializer):
    query_id = serializers.PrimaryKeyRelatedField(
        queryset=Query.objects.all(), source="query", write_only=True
    )

    class Meta:
        model = Expectation
        fields = ["id", "value", "query_id"]


class AssessmentSerializer(serializers.ModelSerializer):
    expectation = ExpectationSerializer()
    response = ResponseBasicSerializer()

    class Meta:
        model = Assessment
        fields = ["id", "value", "prompt", "expectation", "response"]


class ResponseSerializer(serializers.ModelSerializer):
    assessments = AssessmentSerializer(
        source="assessment_set", many=True, required=False
    )
    query = QueryBasicSerializer()

    class Meta:
        model = Response
        fields = ["id", "value", "timestamp", "query", "assessments"]


class QuerySerializer(serializers.ModelSerializer):
    topic = TopicBasicSerializer(read_only=True)
    topic_id = serializers.PrimaryKeyRelatedField(
        queryset=Topic.objects.all(), source="topic", write_only=True
    )
    responses = ResponseSerializer(source="response_set", many=True, required=False)
    expectations = ExpectationSerializer(
        source="expectation_set", many=True, required=False
    )

    class Meta:
        model = Query
        fields = ["id", "value", "topic", "topic_id", "responses", "expectations"]


class TopicSerializer(serializers.ModelSerializer):
    site = SiteBasicSerializer(read_only=True)
    site_id = serializers.PrimaryKeyRelatedField(
        queryset=Site.objects.all(), source="site", write_only=True
    )
    title = serializers.CharField(max_length=200)
    queries = QuerySerializer(source="query_set", many=True, required=False)

    class Meta:
        model = Topic
        fields = ["id", "title", "site", "site_id", "queries"]


class SiteSerializer(serializers.ModelSerializer):
    topics = TopicSerializer(source="topic_set", many=True, required=False)
    title = serializers.CharField(max_length=200)

    class Meta:
        model = Site
        fields = ["id", "title", "url", "topics"]

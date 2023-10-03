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
    class Meta:
        model = Expectation
        fields = ["id", "value"]


class AssessmentSerializer(serializers.ModelSerializer):
    expectation = ExpectationSerializer()
    response = ResponseBasicSerializer()

    class Meta:
        model = Assessment
        fields = ["id", "value", "prompt", "expectation", "response"]


class ResponseSerializer(serializers.ModelSerializer):
    assessment_set = AssessmentSerializer(many=True)
    query = QueryBasicSerializer()

    class Meta:
        model = Response
        fields = ["id", "value", "timestamp", "query", "assessment_set"]


class QuerySerializer(serializers.ModelSerializer):
    topic = TopicBasicSerializer()
    response_set = ResponseSerializer(many=True)

    class Meta:
        model = Query
        fields = ["id", "value", "topic", "response_set"]


class TopicSerializer(serializers.ModelSerializer):
    site = SiteBasicSerializer()
    query_set = QuerySerializer(many=True)

    class Meta:
        model = Topic
        fields = ["id", "title", "site", "query_set"]


class SiteSerializer(serializers.ModelSerializer):
    topic_set = TopicSerializer(many=True)

    class Meta:
        model = Site
        fields = ["id", "title", "url", "topic_set"]

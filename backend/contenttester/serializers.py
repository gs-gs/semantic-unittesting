from rest_framework import serializers
from .models import Assessment, Expectation, Job, Query, Response, Site, Topic


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


class JobSerializer(serializers.ModelSerializer):
    site = SiteBasicSerializer(read_only=True)
    responses = ResponseSerializer(source="response_set", many=True, required=False)
    numOfAssessments = serializers.IntegerField(source="num_of_assessments")

    class Meta:
        model = Job
        fields = [
            "id",
            "started_on",
            "finished_on",
            "site",
            "responses",
            "numOfAssessments",
        ]

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        responses = instance.response_set.all()
        all_assessments = Assessment.objects.all()
        job_assessments = [
            a for a in all_assessments if a.response.id in [r.id for r in responses]
        ]
        serializer = AssessmentSerializer(job_assessments, many=True)

        representation["assessments"] = serializer.data
        return representation


class QuerySerializer(serializers.ModelSerializer):
    job = JobSerializer(read_only=True)
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
        fields = [
            "id",
            "value",
            "job",
            "topic",
            "topic_id",
            "responses",
            "expectations",
        ]


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

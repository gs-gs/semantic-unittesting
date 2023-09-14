import os

from elasticsearch import Elasticsearch


INDEX_NAME = "semantic_unit_testing"


class SearchClient:
    client = None

    @staticmethod
    def get_client():
        if not SearchClient.client:
            SearchClient.client = Elasticsearch([os.environ.get("ELASTICSEARCH_URL")])
        return SearchClient.client

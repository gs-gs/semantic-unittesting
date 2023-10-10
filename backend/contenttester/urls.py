"""
URL configuration for contenttester project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path

from . import consumers
from . import views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("site-old/<int:site_id>/", views.site_old, name="site"),
    path("site/<int:site_id>/topic/<int:topic_id>/", views.topic_old, name="topic"),
    path(
        "site/<int:site_id>/topic/<topic_id>/query/<int:query_id>/",
        views.query_old,
        name="query",
    ),
    path(
        "site/<int:site_id>/topic/<topic_id>/query/<int:query_id>/response/<int:response_id>/",
        views.response_old,
        name="response",
    ),
    path("", views.home, name="home"),
    path("expectation/", views.ExpectationListView.as_view(), name="expectation_list"),
    path("query/<int:pk>/", views.QueryDetailView.as_view(), name="query_detail"),
    path("query/", views.QueryListView.as_view(), name="query_list"),
    path(
        "response/<int:pk>", views.ResponseDetailView.as_view(), name="response_detail"
    ),
    path("response/", views.ResponseListView.as_view(), name="response_list"),
    path("site/<int:pk>", views.SiteDetailView.as_view(), name="site_detail"),
    path("site/", views.SiteListView.as_view(), name="site_list"),
    path("topic/<int:pk>/", views.TopicDetailView.as_view(), name="topic_detail"),
    path("topic/", views.TopicListView.as_view(), name="topic_list"),
]

websocket_urlpatterns = [
    re_path(
        r"ws/jobs/$",
        consumers.JobConsumer.as_asgi(),
    ),
    re_path(
        r"ws/jobs/(?P<job_id>\d+)/$",
        consumers.JobConsumer.as_asgi(),
    ),
]

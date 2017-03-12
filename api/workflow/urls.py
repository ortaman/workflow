
from django.conf.urls import url
from django.contrib import admin

from workflow.views.project import ProjectList, ProjectDetail


urlpatterns = [
    url(r'^projects/$', ProjectList.as_view()),
    url(r'^projects/(?P<pk>[0-9]+)/$', ProjectDetail.as_view()),
]

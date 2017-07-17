
from django.conf.urls import url
from django.contrib import admin

from workflow.views.action import ActionList, ActionDetail, ActionStadisctic, ActionTodoStadistics, ActionOweMeStadistics
from workflow.views.alert import AlertsList
from workflow.views.report import ReportList
from workflow.views.project import ProjectList, ProjectDetail, ProjectTimeStadistic


urlpatterns = [

    url(r'^projects/$', ProjectList.as_view()),
    url(r'^projects/(?P<pk>[0-9]+)/$', ProjectDetail.as_view()),

    url(r'^projects/stadistics/time$', ProjectTimeStadistic.as_view()),

    url(r'^actions/$', ActionList.as_view()),
    url(r'^actions/(?P<pk>[0-9]+)/$', ActionDetail.as_view()),

    url(r'^reports/$', ReportList.as_view()),

    url(r'^actions/stadistics$', ActionStadisctic.as_view()),
    url(r'^actions/stadistics/todo/$', ActionTodoStadistics.as_view()),
    url(r'^actions/stadistics/oweme/$', ActionOweMeStadistics.as_view()),

    url(r'^actions/alerts/$', AlertsList.as_view({'get': 'list'})),
    url(r'^actions/alerts/(?P<pk>[0-9]+)/$', AlertsList.as_view({'patch': 'partial_update'})),


]

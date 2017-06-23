# -*- coding: utf-8 -*-
from django.contrib import admin
from workflow.models import Action, Report


class ActionAdmin(admin.ModelAdmin):
	pass


class ReportAdmin(admin.ModelAdmin):
	pass


admin.site.register(Action, ActionAdmin)
admin.site.register(Report, ReportAdmin)

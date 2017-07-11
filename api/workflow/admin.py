# -*- coding: utf-8 -*-
from django.contrib import admin
from workflow.models import Action, Report, Alert


class ActionAdmin(admin.ModelAdmin):
	pass


class ReportAdmin(admin.ModelAdmin):
	pass


class AlertAdmin(admin.ModelAdmin):
	pass


admin.site.register(Action, ActionAdmin)
admin.site.register(Report, ReportAdmin)
admin.site.register(Alert, AlertAdmin)
# -*- coding: utf-8 -*-
from django.contrib import admin
from .models import Project, Action, Report


class ProyectAdmin(admin.ModelAdmin):
	pass


class ActionAdmin(admin.ModelAdmin):
	pass


class ReportAdmin(admin.ModelAdmin):
	pass


admin.site.register(Project, ProyectAdmin)
admin.site.register(Action, ActionAdmin)
admin.site.register(Report, ReportAdmin)

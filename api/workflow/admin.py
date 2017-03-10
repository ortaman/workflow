# -*- coding: utf-8 -*-
from django.contrib import admin
from .models import Project, Action


class ProyectAdmin(admin.ModelAdmin):
	pass


class ActionAdmin(admin.ModelAdmin):
	pass


admin.site.register(Action, ActionAdmin)
admin.site.register(Project, ProyectAdmin)
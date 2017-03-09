# -*- coding: utf-8 -*-
from django.contrib import admin
from .models import Project


class ProyectAdmin(admin.ModelAdmin):
	pass


admin.site.register(Project, ProyectAdmin)
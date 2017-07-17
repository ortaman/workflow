# -*- coding: utf-8 -*-
from django.contrib import admin
from workflow.models import Action, Report, Alert


class ReportInline(admin.TabularInline):
    model = Report

    extra = 0
    verbose_name = "Reporte"
    verbose_name_plural = "Reportes"

    fields = ('report_kind', 'created_at', 'progress', 'created_by__name')
    readonly_fields = ('report_kind', 'created_at', 'progress', 'created_by__name')

    def created_by__name(self, obj):
        return obj.created_by.get_full_name(self)

    def report_kind(self, obj):
    	if obj.progress == '100':
        	return 'Reporte de ejecución'
    	return 'Reporte de avance'

    report_kind.short_description = 'Tipo de reporte'


class ActionInline(admin.TabularInline):
    model = Action
    fk_name = 'parent_action'

    extra = 0
    verbose_name = "Acción relacionada"
    verbose_name_plural = "Acciones relacionadas"

    fields = ('name', 'phase', 'status', 'client', 'producer', 'begin_at')
    readonly_fields = ('name', 'phase', 'status', 'client', 'producer', 'begin_at')


class ActionAdmin(admin.ModelAdmin):

    verbose_name = "Proyecto"
    verbose_name_plural = "Proyecto"

    list_per_page = 25
    list_display = ('name', 'phase', 'status', 'client', 'producer', 'begin_at')
    list_filter = ('phase', 'status', 'created_at',)

    inlines = [
    	ReportInline,
        ActionInline,
    ]

    def get_queryset(self, request):

        qs = super(ActionAdmin, self).get_queryset(request)
        return qs.filter(parent_action=None)


class ReportAdmin(admin.ModelAdmin):
	pass


class AlertAdmin(admin.ModelAdmin):
	pass


admin.site.register(Action, ActionAdmin)
admin.site.register(Report, ReportAdmin)
admin.site.register(Alert, AlertAdmin)

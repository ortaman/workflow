# -*- coding: utf-8 -*-
from django.core.urlresolvers import reverse
from django.contrib import admin
from django.utils.html import format_html

from workflow.models import Action, Report, Alert


class ReportInline(admin.TabularInline):
    model = Report

    extra = 0
    verbose_name = "Reporte"
    verbose_name_plural = "Reportes"

    fields = ('report_kind', 'created_at', 'progress', 'created_by__name')
    readonly_fields = ('report_kind', 'created_at', 'progress', 'created_by__name')

    def created_by__name(self, obj):
        return obj.created_by.get_full_name()

    def report_kind(self, obj):
        app_label = obj._meta.app_label
        model_name = obj._meta.model_name
        url = reverse('admin:%s_%s_change' % (app_label, model_name), args=(obj.id,))

        if obj.progress == '100':
            return format_html('<a href="{0}"> Reporte de ejecución </a>'.format(url))
        return format_html('<a href="{0}"> Reporte de avance </a>'.format(url))

    report_kind.short_description = 'Tipo de reporte'

    def has_add_permission(self, request):
        return False


    def has_delete_permission(self, request, obj=None):
        return False


class ActionInline(admin.TabularInline):
    model = Action
    fk_name = 'parent_action'

    extra = 0
    verbose_name = "Acción relacionada"
    verbose_name_plural = "Acciones relacionadas"

    fields = ('link_name', 'phase', 'status', 'client', 'producer', 'begin_at')
    readonly_fields = ('link_name', 'phase', 'status', 'client', 'producer', 'begin_at')

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def link_name(self, obj):
        app_label = obj._meta.app_label
        model_name = obj._meta.model_name
        url = reverse('admin:%s_%s_change' % (app_label, model_name), args=(obj.id,))

        return format_html('<a href="{0}"> {1} </a>'.format(url, obj.name))

    link_name.short_description = 'Nombre'


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
        return Action.objects.filter()


class ReportAdmin(admin.ModelAdmin):
    pass


class AlertAdmin(admin.ModelAdmin):
    pass


admin.site.register(Action, ActionAdmin)
admin.site.register(Report, ReportAdmin)
admin.site.register(Alert, AlertAdmin)

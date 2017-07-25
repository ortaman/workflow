# -*- coding: utf-8 -*-
from django.contrib.auth.models import Group
from django.core.urlresolvers import reverse
from django.contrib import admin
from django.utils.html import format_html

from rest_framework.authtoken.models import Token

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

    list_per_page = 25
    list_display = ('name', 'phase', 'status', 'client', 'producer', 'begin_at')
    list_filter = ('phase', 'status', 'created_at',)

    inlines = [
        ReportInline,
        ActionInline,
    ]

    changelist_view = True

    def get_queryset(self, request):
        qs = super(ActionAdmin, self).get_queryset(request)

        if self.changelist_view:
            return Action.objects.filter(parent_action=None)

        return Action.objects.all()

    def change_view(self, request, object_id, form_url='', extra_context=None):
        self.changelist_view=False

        return super(ActionAdmin, self).change_view(
            request, object_id, form_url, extra_context=extra_context,
        )

    def changelist_view(self, request, extra_context=None, *args, **kwargs):
        self.changelist_view=True

        return super(ActionAdmin, self).changelist_view(
            request, extra_context, *args, **kwargs
        )


class ReportAdmin(admin.ModelAdmin):

    list_display = ('action', 'progress', 'created_by', 'created_at', 'updated_at')
    list_filter = ('progress',)

    fieldsets = (
        ('Información general', {'fields': (
            'action', 'progress', 'accomplished', 'pending', 
            'created_by', 'created_at', 'updated_at')}),
        ('Información adicional', {'fields': ('created_at', 'updated_at')}),
    )

    readonly_fields = ('created_at', 'updated_at')

    search_fields = ('action__name',)
    ordering = ('created_at',)
    filter_horizontal = ()


class AlertAdmin(admin.ModelAdmin):

    list_display = ('action', 'kind', 'message', 'viewed', 'created_at')
    list_filter = ('kind',)

    fieldsets = (
        ('Información general', {'fields': ('action', 'kind', 'message', 'viewed')}),
        ('Información adicional', {'fields': ('created_at', )}),
    )

    readonly_fields = ('created_at',)

    search_fields = ('action__name',)
    ordering = ('created_at',)
    filter_horizontal = ()


admin.site.register(Action, ActionAdmin)
admin.site.register(Report, ReportAdmin)
admin.site.register(Alert, AlertAdmin)

admin.site.unregister(Group)
admin.site.unregister(Token)



# from django_celery_beat.admin import IntervalAdmin
from django_celery_beat.models import IntervalSchedule


if IntervalSchedule in admin.site._registry:
    admin.site.unregister(IntervalSchedule)

from django_celery_beat.apps import AppConfig, BeatConfig
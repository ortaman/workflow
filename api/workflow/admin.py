# -*- coding: utf-8 -*-
from django.contrib import admin
from workflow.models import Action, Report, Alert


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

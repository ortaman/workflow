# -*- coding: utf-8 -*-
from django.contrib import admin
from django.utils.translation import ugettext_lazy as _

from .models import User


class UserAdmin(admin.ModelAdmin):

    list_display = ('full_name', 'email', 'cel_phone', 'position', 'username', 'created_at')
    list_filter = ('created_at',)

    fieldsets = (
        ('Información General', {'fields': ('username', 'email', 'position', 'password')}),
        ('Información personal', {'fields': ('name', 'first_surname', 'second_surname', 'cel_phone')}),
        ('Permisos', {'fields': ('is_active', 'is_staff', 'groups', 'photo')}),
        ('Información adicional', {'fields': ('created_at', 'updated_at')}),
    )

    readonly_fields = ('created_at', 'updated_at')

    search_fields = ('email', 'first_surname')
    ordering = ('first_surname', 'email')
    filter_horizontal = ()

    def full_name(self, obj):
        return obj.get_full_name()

    full_name.short_description = _('Nombre Completo')

admin.site.register(User, UserAdmin)

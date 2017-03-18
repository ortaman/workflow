# -*- coding: utf-8 -*-
from django.contrib import admin
from .models import User


class UserAdmin(admin.ModelAdmin):

    list_display = ('email', 'name', 'first_surname', 'second_surname',)
    list_filter = ('created_at',)

    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        ('Información personal', {'fields': ('name', 'first_surname', 'second_surname')}),
        ('Permisos', {'fields': ('is_active', 'is_staff', 'groups')}),
        ('Información adicional', {'fields': ('created_at', 'updated_at')}),
    )

    readonly_fields = ('created_at', 'updated_at')

    search_fields = ('email', 'first_surname')
    ordering = ('first_surname', 'email')
    filter_horizontal = ()


admin.site.register(User, UserAdmin)

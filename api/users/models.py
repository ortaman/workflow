# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import BaseUserManager, UserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.hashers import make_password


class BaseUser(AbstractBaseUser, PermissionsMixin):

    POSITIONS = (
        ('Administrador', 'Administrador'),
        ('Coordinador', 'Coordinador'),
        ('Coordinadora de comunicación comercial/ventas', 'Coordinadora de comunicación comercial/ventas'),
        ('Coordinador de marca línea gastro', 'Coordinador de marca línea gastro'),
        ('Coordinadora de mercadotecnia digital', 'Coordinadora de mercadotecnia digital'),
        ('Coordinador de marca línea salud femenina', 'Coordinador de marca línea salud femenina'),
        ('Cuenta clave', 'Cuenta clave'),

        ('Directora comercial', 'Directora comercial'),
        ('Especialista de capacitación fuerza de ventas', 'Especialista de capacitación fuerza de ventas'),

        ('Gerente de instituciones', 'Gerente de instituciones'),
        ('Gerente de inteligencia de mercados', 'Gerente de inteligencia de mercados'),
        ('Gerente de línea de productos', 'Gerente de línea de productos'),
        ('Gerente de línea gastro', 'Gerente de línea Gastro'),
        ('Gerente de línea salud femenina', 'Gerente de línea salud femenina'),
        ('Gerente de línea sobrepeso y obesidad', 'Gerente de línea sobrepeso y obesidad'),
        ('Gerente de marketing corporativo', 'Gerente de marketing corporativo'),
        ('Gerente de mercadotecnia', 'Gerente de mercadotecnia'),
        ('Gerente de productividad comercial', 'Gerente de productividad comercial'),

        ('Gerente asociado línea obesidad' , 'Gerente asociado línea obesidad'),
        ('Gerente distrital', 'Gerente distrital'),
        ('Gerente regional de ventas', 'Gerente regional de ventas'),
        ('Gerente nacional de ventas', 'Gerente nacional de ventas'),
        ('Gerente cuentas clave', 'Gerente Cuentas Clave'),
        ('Sub director comercial', 'Sub director Comercial'),
    )

    username = models.CharField(max_length=128, unique=True)
    email = models.EmailField(max_length=256, unique=True)

    name = models.CharField(max_length=64, verbose_name='Nombre')
    first_surname = models.CharField(max_length=32, verbose_name='Primer apellido')
    second_surname = models.CharField(max_length=32, verbose_name='Segundo Apellido')

    position = models.CharField(choices=POSITIONS, max_length=132, verbose_name='Posición')
    cel_phone = models.CharField(max_length=16, verbose_name='Teléfono Móvil')

    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    photo = models.ImageField(upload_to='photos/', verbose_name='Foto')

    created_at = models.DateTimeField(auto_now=True, verbose_name='Fecha de creación')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Fecha de actualización')

    EMAIL_FIELD = 'email'
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    class Meta:
        verbose_name = 'user'
        verbose_name_plural = 'users'

    def get_full_name(self):
        # The user is identified by their email address
        return "%s %s %s" % (self.user.name, self.first_surname, self.second_surname)

    def get_short_name(self):
        # The user is identified by their email address
        return "%s %s" % (self.user.name, self.first_surname)

    def __str__(self):              # __unicode__ on Python 2
        return self.email

    def save(self, update_password=True, *args, **kwargs):
        # Updates user without make_password.
        if not self.password.startswith("pbkdf2_sha"):
            self.password = make_password(self.password)

        super(BaseUser, self).save(*args, **kwargs)


class User(BaseUser):
    objects = UserManager()

    class Meta:
        verbose_name = ("Usuario")
        verbose_name_plural = ("Usuarios")

    def __str__(self):
        return "%s" % (self.email)

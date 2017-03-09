# -*- coding: utf-8 -*-
from __future__ import unicode_literals


from django.db import models
from django.contrib.auth.models import BaseUserManager, UserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.hashers import make_password


class BaseUser(AbstractBaseUser, PermissionsMixin):

    username = models.CharField(max_length=128, unique=True)
    email = models.EmailField(max_length=256, unique=True)

    name = models.CharField(max_length=64, verbose_name='Nombre')
    first_surname = models.CharField(max_length=32, verbose_name='Primer apellido')
    second_surname = models.CharField(max_length=32, verbose_name='Segundo Apellido')

    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now=True, verbose_name='Fecha de creación')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Fecha de actualización')


    objects = UserManager()

    EMAIL_FIELD = 'email'
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    class Meta:
        verbose_name = 'user'
        verbose_name_plural = 'users'

    def get_full_name(self):
        # The user is identified by their email address
        return self.email

    def get_short_name(self):
        # The user is identified by their email address
        return self.email

    def __str__(self):              # __unicode__ on Python 2
        return self.email

    def save(self, update_password=True, *args, **kwargs):
        # Updates user without make_password.
        if not self.password.startswith("pbkdf2_sha"):
            self.password = make_password(self.password)

        super(BaseUser, self).save(*args, **kwargs)


class User(BaseUser):
    class Meta:
        verbose_name = ("Usuario")
        verbose_name_plural = ("Usuarios")

    def __str__(self):
        return "%s" % (self.email)
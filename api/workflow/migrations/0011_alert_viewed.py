# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-07-13 03:03
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workflow', '0010_alert'),
    ]

    operations = [
        migrations.AddField(
            model_name='alert',
            name='viewed',
            field=models.BooleanField(default=False, verbose_name='Mensaje Leido'),
        ),
    ]

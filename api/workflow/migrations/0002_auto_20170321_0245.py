# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-03-21 02:45
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workflow', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='preparation_at',
            field=models.DateTimeField(verbose_name='Fecha de preparación'),
        ),
    ]

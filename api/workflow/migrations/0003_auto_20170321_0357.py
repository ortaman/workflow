# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-03-21 03:57
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workflow', '0002_auto_20170321_0245'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='preparation_at',
            field=models.DateField(verbose_name='Fecha de preparación'),
        ),
    ]

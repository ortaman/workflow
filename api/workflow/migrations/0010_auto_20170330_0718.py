# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-03-30 07:18
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workflow', '0009_auto_20170330_0259'),
    ]

    operations = [
        migrations.AlterField(
            model_name='action',
            name='promise',
            field=models.CharField(choices=[('proceso', 'Proceso'), ('cumplida', 'Cumplida'), ('incumplida', 'Incumplida')], default='Proceso', max_length=10, verbose_name='Promesa'),
        ),
        migrations.AlterField(
            model_name='action',
            name='status',
            field=models.CharField(choices=[('open', 'Abierta'), ('close', 'Cerrada')], default='Abierta', max_length=7, verbose_name='Estado'),
        ),
    ]

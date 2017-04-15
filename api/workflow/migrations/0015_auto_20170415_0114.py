# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-04-15 01:14
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workflow', '0014_auto_20170414_2307'),
    ]

    operations = [
        migrations.AlterField(
            model_name='action',
            name='status',
            field=models.CharField(choices=[('Abierta', 'Abierta'), ('Cerrada satisfactoriamente', 'Cerrada satisfactoriamente'), ('Cerrada insatisfactoriamente', 'Cerrada no satisfactoriamente')], default='Abierta', max_length=30, verbose_name='Estado'),
        ),
    ]

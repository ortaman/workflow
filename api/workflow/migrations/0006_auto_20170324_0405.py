# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-03-24 04:05
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workflow', '0005_auto_20170324_0340'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='image',
            field=models.ImageField(blank=True, upload_to='images/', verbose_name='Imagen'),
        ),
    ]

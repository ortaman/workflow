# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-03-23 04:09
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workflow', '0003_auto_20170321_0357'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='image',
            field=models.ImageField(null=True, upload_to='images/', verbose_name='Nombre'),
        ),
    ]
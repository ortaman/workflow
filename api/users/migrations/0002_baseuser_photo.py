# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-03-24 04:15
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='baseuser',
            name='photo',
            field=models.ImageField(null=True, upload_to='photos/', verbose_name='Foto'),
        ),
    ]

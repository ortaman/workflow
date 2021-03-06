# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-06-04 02:00
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('workflow', '0002_auto_20170530_2156'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='project',
            name='client',
        ),
        migrations.RemoveField(
            model_name='project',
            name='created_by',
        ),
        migrations.RemoveField(
            model_name='project',
            name='observer',
        ),
        migrations.RemoveField(
            model_name='project',
            name='producer',
        ),
        migrations.AlterModelOptions(
            name='action',
            options={'verbose_name': 'Proyecto', 'verbose_name_plural': 'Proyectos'},
        ),
        migrations.RemoveField(
            model_name='report',
            name='action',
        ),
        migrations.RemoveField(
            model_name='report',
            name='project',
        ),
        migrations.AddField(
            model_name='action',
            name='advance_report',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='reported', to='workflow.Action', verbose_name='Reporte de avance'),
        ),
        migrations.AddField(
            model_name='action',
            name='ejecution_report',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='ejecution_report', to='workflow.Report', verbose_name='Reporte de ejecución'),
        ),
        migrations.AddField(
            model_name='action',
            name='evaluation_at',
            field=models.DateField(blank=True, null=True, verbose_name='Fecha de evaluación'),
        ),
        migrations.AddField(
            model_name='action',
            name='execution_at',
            field=models.DateField(blank=True, null=True, verbose_name='Fecha de ejecución'),
        ),
        migrations.AddField(
            model_name='action',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='images/', verbose_name='Imagen'),
        ),
        migrations.AddField(
            model_name='action',
            name='kind',
            field=models.CharField(choices=[('Estándar', 'Estándar'), ('Piloto', 'Piloto'), ('Jardín', 'Jardín')], default='estandar', max_length=8, verbose_name='Tipos de proyecto'),
        ),
        migrations.AddField(
            model_name='action',
            name='negotiation_at',
            field=models.DateField(blank=True, null=True, verbose_name='Fecha de negociación'),
        ),
        migrations.AddField(
            model_name='action',
            name='preparation_at',
            field=models.DateField(blank=True, null=True, verbose_name='Fecha de preparación'),
        ),
        migrations.AddField(
            model_name='action',
            name='renegotiation_at',
            field=models.DateField(blank=True, null=True, verbose_name='Fecha de regenociación'),
        ),
        migrations.AlterField(
            model_name='action',
            name='client',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='client_project', to=settings.AUTH_USER_MODEL, verbose_name='Cliente'),
        ),
        migrations.AlterField(
            model_name='action',
            name='created_by',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='project_created_by', to=settings.AUTH_USER_MODEL, verbose_name='Creado por'),
        ),
        migrations.AlterField(
            model_name='action',
            name='name',
            field=models.CharField(max_length=64, verbose_name='Nombre'),
        ),
        migrations.AlterField(
            model_name='action',
            name='observer',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='agent_project', to=settings.AUTH_USER_MODEL, verbose_name='Observador'),
        ),
        migrations.AlterField(
            model_name='action',
            name='phase',
            field=models.CharField(choices=[('Preparación', 'Preparación'), ('Negociación', 'Negociación'), ('Ejecución', 'Ejecución'), ('Evaluación', 'Evaluación')], default='preparacion', max_length=11, verbose_name='Fase de proyecto'),
        ),
        migrations.AlterField(
            model_name='action',
            name='producer',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='producer_project', to=settings.AUTH_USER_MODEL, verbose_name='Realizador'),
        ),
        migrations.AlterField(
            model_name='action',
            name='project',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='project', to='workflow.Report', verbose_name='Proyecto relacionado'),
        ),
        migrations.AlterField(
            model_name='action',
            name='report_at',
            field=models.DateField(verbose_name='Fecha de reporte de avance'),
        ),
        migrations.DeleteModel(
            name='Project',
        ),
    ]

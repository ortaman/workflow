# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-05-23 17:06
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Action',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=64, verbose_name='Nombre de la acción')),
                ('phase', models.CharField(choices=[('Preparación', 'Preparación'), ('Negociación', 'Negociación'), ('Ejecución', 'Ejecución'), ('Evaluación', 'Evaluación')], default='preparacion', max_length=11, verbose_name='Fase de la acción')),
                ('status', models.CharField(choices=[('Pendiente', 'Pendiente'), ('Aceptada', 'Aceptada'), ('Ejecutada', 'Ejecutada'), ('Satisfactoria', 'Satisfactoria'), ('Insatisfactoria', 'Insatisfactoria'), ('Negociando', 'Negociando'), ('No aceptada', 'No aceptada')], default='Pendiente', max_length=16, verbose_name='Estado')),
                ('toDo', models.TextField(max_length=1024, verbose_name='¿Qué y como se realizará?')),
                ('satisfactions', models.TextField(max_length=1024, verbose_name='Condiciones de satisfacción')),
                ('begin_at', models.DateField(verbose_name='Fecha de inicio')),
                ('accomplish_at', models.DateField(verbose_name='Fecha de cumplimiento')),
                ('report_at', models.DateField(verbose_name='Fecha de reporte de Avance')),
                ('advance_report_at', models.DateField(blank=True, null=True, verbose_name='Fecha de creación del reporte de avance')),
                ('ejecution_report_at', models.DateField(blank=True, null=True, verbose_name='Fecha de creación del reporte de ejecución')),
                ('financial', models.CharField(blank=True, max_length=64, null=True, verbose_name='Financieros')),
                ('operational', models.CharField(blank=True, max_length=64, null=True, verbose_name='Operacionales')),
                ('other1', models.CharField(blank=True, max_length=64, null=True, verbose_name='Otros')),
                ('other2', models.CharField(blank=True, max_length=64, null=True, verbose_name='Otros')),
                ('created_at', models.DateTimeField(auto_now=True, verbose_name='Fecha de creación')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Fecha de actualización')),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='client_action', to=settings.AUTH_USER_MODEL, verbose_name='Cliente')),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='action_create_by', to=settings.AUTH_USER_MODEL, verbose_name='Creado por')),
                ('observer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='agent_action', to=settings.AUTH_USER_MODEL, verbose_name='Observador')),
                ('parent_action', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='workflow.Action', verbose_name='Acción Padre')),
                ('producer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='producer_action', to=settings.AUTH_USER_MODEL, verbose_name='Realizador')),
            ],
            options={
                'verbose_name': 'Acción',
                'verbose_name_plural': 'Acciones',
            },
        ),
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=64, verbose_name='Nombre')),
                ('kind', models.CharField(choices=[('Estándar', 'Estándar'), ('Piloto', 'Piloto'), ('Jardín', 'Jardín')], default='estandar', max_length=8, verbose_name='Tipos de proyecto')),
                ('phase', models.CharField(choices=[('Preparación', 'Preparación'), ('Negociación', 'Negociación'), ('Ejecución', 'Ejecución'), ('Evaluación', 'Evaluación')], default='preparacion', max_length=11, verbose_name='Fase de proyecto')),
                ('status', models.CharField(choices=[('Pendiente', 'Pendiente'), ('Aceptada', 'Aceptada'), ('Ejecutada', 'Ejecutada'), ('Satisfactoria', 'Satisfactoria'), ('Insatisfactoria', 'Insatisfactoria'), ('Negociando', 'Negociando'), ('No aceptada', 'No aceptada')], default='Pendiente', max_length=16, verbose_name='Estado')),
                ('toDo', models.TextField(max_length=1024, verbose_name='¿Qué y como se realizará?')),
                ('satisfactions', models.TextField(max_length=1024, verbose_name='Condiciones de satisfacción')),
                ('preparation_at', models.DateField(verbose_name='Fecha de preparación')),
                ('negotiation_at', models.DateField(verbose_name='Fecha de negociación')),
                ('execution_at', models.DateField(verbose_name='Fecha de ejecución')),
                ('evaluation_at', models.DateField(verbose_name='Fecha de evaluación')),
                ('begin_at', models.DateField(verbose_name='Fecha de inicio')),
                ('accomplish_at', models.DateField(verbose_name='Fecha de cumplimiento')),
                ('renegotiation_at', models.DateField(blank=True, null=True, verbose_name='Fecha de regenociación')),
                ('report_at', models.DateField(verbose_name='Fecha de reporte de avance')),
                ('advance_report_at', models.DateField(blank=True, null=True, verbose_name='Fecha de creación del reporte de avance')),
                ('ejecution_report_at', models.DateField(blank=True, null=True, verbose_name='Fecha de creación del reporte de ejecución')),
                ('financial', models.CharField(blank=True, max_length=64, null=True, verbose_name='Financieros')),
                ('operational', models.CharField(blank=True, max_length=64, null=True, verbose_name='Operacionales')),
                ('other1', models.CharField(blank=True, max_length=64, null=True, verbose_name='Otros')),
                ('other2', models.CharField(blank=True, max_length=64, null=True, verbose_name='Otros')),
                ('image', models.ImageField(upload_to='images/', verbose_name='Imagen')),
                ('created_at', models.DateTimeField(auto_now=True, verbose_name='Fecha de creación')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Fecha de actualización')),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='client_project', to=settings.AUTH_USER_MODEL, verbose_name='Cliente')),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='project_created_by', to=settings.AUTH_USER_MODEL, verbose_name='Creado por')),
                ('observer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='agent_project', to=settings.AUTH_USER_MODEL, verbose_name='Observador')),
                ('producer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='producer_project', to=settings.AUTH_USER_MODEL, verbose_name='Realizador')),
            ],
            options={
                'verbose_name': 'Proyecto',
                'verbose_name_plural': 'Proyectos',
            },
        ),
        migrations.CreateModel(
            name='Report',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('progress', models.CharField(choices=[('0', '0'), ('25', '25'), ('50', '50'), ('75', '75'), ('100', '100')], default='0', max_length=3, verbose_name='Porcentaje de avance')),
                ('accomplished', models.TextField(max_length=1024, verbose_name='Relizado')),
                ('pending', models.TextField(max_length=1024, verbose_name='Pendiente')),
                ('created_at', models.DateTimeField(auto_now=True, verbose_name='Fecha de creación')),
                ('action', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='action_report', to='workflow.Action', verbose_name='Acción')),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='report_created_by', to=settings.AUTH_USER_MODEL, verbose_name='Creado por')),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='project_report', to='workflow.Project', verbose_name='Proyecto')),
            ],
        ),
        migrations.AddField(
            model_name='action',
            name='project',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='project', to='workflow.Project', verbose_name='Proyecto relacionado'),
        ),
    ]

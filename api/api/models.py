# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

from users.models import User


class Project(models.Model):

    PHASES = (
        ('preparacion', 'Preparación'),
        ('negociacion', 'Negociación'),
        ('ejecucion', 'Ejecución'),
        ('evaluacion', 'Evaluación'),
    )

    phase = models.CharField(
        choices=PHASES,
        max_length=11,
        default='created',
        verbose_name='Estado')    

    client = models.ForeignKey(User, related_name='client_project', verbose_name='Cliente')
    producer = models.ForeignKey(User, related_name='producer_project', verbose_name='Realizador')
    agent = models.ForeignKey(User, related_name='agent_project', verbose_name='Observador')

    name = models.CharField(max_length=64, verbose_name='Nombre')
    toDo = models.TextField(max_length=512, verbose_name='¿Qué y como se realizará?')
    satisfactions = models.TextField(max_length=512, verbose_name='Condiciones de satisfacción')

    preparation_at = models.DateField(auto_now=False, verbose_name='Fecha de preparación')
    negotiation_at = models.DateField(auto_now=False, verbose_name='Fecha de negociación')
    execution_at = models.DateField(auto_now=False, verbose_name='Fecha de ejecución')
    evaluation_at = models.DateField(auto_now=False, verbose_name='Fecha de evaluación')

    begin_at = models.DateField(auto_now=False, verbose_name='Fecha de inicio')
    accomplish_at = models.DateField(auto_now=False, verbose_name='Fecha de cumplimiento')
    renegotiation_at = models.DateField(auto_now=False, verbose_name='Fecha de regenociación')
    report_at = models.DateField(auto_now=False, verbose_name='Fecha de reporte de Avance')

    created_at = models.DateField(auto_now=True, verbose_name='Fecha de creación') 
    updated_at = models.DateField(auto_now=True, verbose_name='Fecha de actualización')

    class Meta:
        verbose_name = ("Proyecto")
        verbose_name_plural = ("Proyectos")

    def __str__(self):
        return "%s" % (self.name)

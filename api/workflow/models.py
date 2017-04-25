
from django.db import models

from users.models import User


class Project(models.Model):

    PHASES = (
        ('Preparación', 'Preparación'),
        ('Negociación', 'Negociación'),
        ('Ejecución', 'Ejecución'),
        ('Evaluación', 'Evaluación'),
    )

    TYPES = (
        ('Estándar', 'Estándar'),
        ('Piloto', 'Piloto'),
        ('Jardín', 'Jardín'),
    )

    STATUS = (
        ('Abierta', 'Abierta'),
        ('Satisfactoria', 'Satisfactoria'),
        ('Insatisfactoria', 'Insatisfactoria'),
    )

    PROMISE = (
        ('Creada', 'Creada'),
        ('Aceptada', 'Aceptada'),  # acepted is a action in process
        ('Reportada', 'Reportada'),
        ('Cumplida', 'Cumplida'),
        ('Incumplida', 'Incumplida'),

        ('Negociando', 'Negociando'),
        ('No aceptada', 'No aceptada'),
    )
    
    # focus project
    name = models.CharField(max_length=64, verbose_name='Nombre')
    kind = models.CharField(choices=TYPES, max_length=8, default='estandar', verbose_name='Tipos de proyecto')
    phase = models.CharField(choices=PHASES, max_length=11, default='preparacion', verbose_name='Fase de proyecto')
    status = models.CharField(choices=STATUS, max_length=30, default='Abierta', verbose_name='Estado')
    promise = models.CharField(choices=PROMISE, max_length=11, default='created', verbose_name='Promesa')

    # action roles
    client = models.ForeignKey(User, related_name='client_project', verbose_name='Cliente')
    producer = models.ForeignKey(User, related_name='producer_project', verbose_name='Realizador')
    observer = models.ForeignKey(User, related_name='agent_project', verbose_name='Observador')

    toDo = models.TextField(max_length=1024, verbose_name='¿Qué y como se realizará?')
    satisfactions = models.TextField(max_length=1024, verbose_name='Condiciones de satisfacción')

    # workflow dates
    preparation_at = models.DateField(auto_now=False, verbose_name='Fecha de preparación')
    negotiation_at = models.DateField(auto_now=False, verbose_name='Fecha de negociación')
    execution_at = models.DateField(auto_now=False, verbose_name='Fecha de ejecución')
    evaluation_at = models.DateField(auto_now=False, verbose_name='Fecha de evaluación')

    # agremments
    begin_at = models.DateField(auto_now=False, verbose_name='Fecha de inicio')
    accomplish_at = models.DateField(auto_now=False, verbose_name='Fecha de cumplimiento')
    renegotiation_at = models.DateField(
        null=True, blank=True,
        auto_now=False, verbose_name='Fecha de regenociación')

    report_at = models.DateField(auto_now=False, verbose_name='Fecha de reporte de Avance')

    # indicators
    financial = models.CharField(max_length=64, verbose_name='Financieros')
    operational = models.CharField(max_length=64, verbose_name='Operacionales')
    other1 = models.CharField(max_length=64, verbose_name='Otros')
    other2 = models.CharField(max_length=64, verbose_name='Otros')

    image = models.ImageField(upload_to='images/', verbose_name='Imagen')

    created_at = models.DateTimeField(auto_now=True, verbose_name='Fecha de creación')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Fecha de actualización')

    create_by = models.ForeignKey(
        User,
        related_name='project_create_by',
        verbose_name='Creado por')

    class Meta:
        verbose_name = ("Proyecto")
        verbose_name_plural = ("Proyectos")

    def __str__(self):
        return "%s" % (self.name)


class Action(models.Model):

    PHASES = (
        ('Preparación', 'Preparación'),
        ('Negociación', 'Negociación'),
        ('Ejecución', 'Ejecución'),
        ('Evaluación', 'Evaluación'),
    )

    STATUS = (
        ('Abierta', 'Abierta'),
        ('Satisfactoria', 'Satisfactoria'),
        ('Insatisfactoria', 'Insatisfactoria'),
    )

    PROMISE = (
        ('Creada', 'Creada'),
        ('Aceptada', 'Aceptada'),  # acepted is a action in process
        ('Reportada', 'Reportada'),
        ('Cumplida', 'Cumplida'),
        ('Incumplida', 'Incumplida'),

        ('Negociando', 'Negociando'),
        ('No aceptada', 'No aceptada'),
    )

    project = models.ForeignKey(Project, related_name='project', verbose_name='Proyecto relacionado')
    name = models.CharField(max_length=64, verbose_name='Nombre de la acción')
    phase = models.CharField(choices=PHASES, max_length=11, default='preparacion', verbose_name='Fase de la acción')

    status = models.CharField(choices=STATUS, max_length=30, default='Abierta', verbose_name='Estado')
    promise = models.CharField(choices=PROMISE, max_length=11, default='created', verbose_name='Promesa')

    # focus project
    toDo = models.TextField(max_length=1024, verbose_name='¿Qué y como se realizará?')
    satisfactions = models.TextField(max_length=1024, verbose_name='Condiciones de satisfacción')

    # action roles
    client = models.ForeignKey(User, related_name='client_action', verbose_name='Cliente')
    producer = models.ForeignKey(User, related_name='producer_action', verbose_name='Realizador')
    observer = models.ForeignKey(User, related_name='agent_action', verbose_name='Observador')

    # agremments
    begin_at = models.DateField(auto_now=False, verbose_name='Fecha de inicio')
    accomplish_at = models.DateField(auto_now=False, verbose_name='Fecha de cumplimiento')
    report_at = models.DateField(auto_now=False, verbose_name='Fecha de reporte de Avance')

    # indicators
    financial = models.CharField(max_length=64, verbose_name='Financieros')
    operational = models.CharField(max_length=64, verbose_name='Operacionales')
    other1 = models.CharField(max_length=64, verbose_name='Otros')
    other2 = models.CharField(max_length=64, verbose_name='Otros')

    parent_action = models.ForeignKey(
        'self',
        models.SET_NULL,
        blank=True,
        null=True,
        verbose_name='Acción Padre')

    created_at = models.DateTimeField(auto_now=True, verbose_name='Fecha de creación')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Fecha de actualización')
    create_by = models.ForeignKey(User, related_name='action_create_by', verbose_name='Creado por')

    class Meta:
        verbose_name = ("Acción")
        verbose_name_plural = ("Acciones")

    def __str__(self):
        return "%s" % (self.name)


class Report(models.Model):

    PERCENTAJES = (
        ('0', '0'), ('25', '25'), ('50', '50'),
        ('75', '75'), ('100', '100'),
    )

    project = models.ForeignKey(Project, related_name='project_report', verbose_name='Proyecto')
    action = models.ForeignKey(
                Action,
                blank=True,
                null=True,
                related_name='action_report',
                verbose_name='Acción'
             )

    progress = models.CharField(choices=PERCENTAJES, max_length=3, default='0', verbose_name='Porcentaje de avance')

    accomplished = models.TextField(max_length=1024, verbose_name='Relizado')
    pending = models.TextField(max_length=1024, verbose_name='Pendiente')

    created_at = models.DateTimeField(auto_now=True, verbose_name='Fecha de creación')
    create_by = models.ForeignKey(User, related_name='report_create_by', verbose_name='Creado por')


from django.db import models

from users.models import User


class Project(models.Model):

    PHASES = (
        ('preparacion', 'Preparación'),
        ('negociacion', 'Negociación'),
        ('ejecucion', 'Ejecución'),
        ('evaluacion', 'Evaluación'),
    )

    TYPES = (
        ('estandar', 'Estándar'),
        ('piloto', 'Piloto'),
        ('jardin', 'Jardín'),
    )

    # focus project
    name = models.CharField(max_length=64, verbose_name='Nombre')
    clasification = models.CharField(choices=TYPES, max_length=8, default='estandar', verbose_name='Tipos de proyecto')
    phase = models.CharField(choices=PHASES, max_length=11, default='preparacion', verbose_name='Fase de proyecto')

    # action roles
    client = models.ForeignKey(User, related_name='client_project', verbose_name='Cliente')
    producer = models.ForeignKey(User, related_name='producer_project', verbose_name='Realizador')
    observer = models.ForeignKey(User, related_name='agent_project', verbose_name='Observador')

    toDo = models.TextField(max_length=512, verbose_name='¿Qué y como se realizará?')
    satisfactions = models.TextField(max_length=512, verbose_name='Condiciones de satisfacción')

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

    report_at = models.DateField(
        null=True, blank=True, 
        auto_now=False, verbose_name='Fecha de reporte de Avance')

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
        ('preparacion', 'Preparación'),
        ('negociacion', 'Negociación'),
        ('ejecucion', 'Ejecución'),
        ('evaluacion', 'Evaluación'),
    )

    STATUS = (
        ('open', 'Abierta'),
        ('close', 'Cerrada'),
    )

    PROMISE = (
        ('process', 'Proceso'),
        ('kept', 'Cumplida'),
        ('empty', 'Incumplida'),
    )

    PERCENTAJES = (
        ('0', '0'), ('10', '10'), ('20', '20'), ('30', '30'),
        ('40', '40'), ('50', '50'), ('60', '60'), ('70', '70'),
        ('80', '80'), ('90', '90'), ('100', '100'),
    )

    project = models.ForeignKey(Project, related_name='project', verbose_name='Proyecto relacionado')
    name = models.CharField(max_length=64, verbose_name='Nombre de la acción')
    phase = models.CharField(choices=PHASES, max_length=11, default='preparacion', verbose_name='Fase de la acción')

    progress = models.CharField(choices=PERCENTAJES, max_length=3, default='0', verbose_name='Porcentaje de avance')
    status = models.CharField(choices=STATUS, max_length=5, default='Abierta', verbose_name='Estado')
    promise = models.CharField(choices=PROMISE, max_length=7, default='process', verbose_name='Promesa')
    is_renegotiated = models.BooleanField(default=False, verbose_name='Renegociado')

    # focus project
    toDo = models.TextField(max_length=512, verbose_name='¿Qué y como se realizará?')
    satisfactions = models.TextField(max_length=512, verbose_name='Condiciones de satisfacción')

    # action roles
    client = models.ForeignKey(User, related_name='client_action', verbose_name='Cliente')
    producer = models.ForeignKey(User, related_name='producer_action', verbose_name='Realizador')
    observer = models.ForeignKey(User, related_name='agent_action', verbose_name='Observador')

    expire_at = models.DateField(auto_now=False, verbose_name='Fecha límite de la fase')

    # agremments
    # agremments
    begin_at = models.DateField(auto_now=False, verbose_name='Fecha de inicio')
    
    accomplish_at = models.DateField(auto_now=False, verbose_name='Fecha de cumplimiento')
    
    renegotiation_at = models.DateField(
        null=True, blank=True, 
        auto_now=False, verbose_name='Fecha de regenociación')

    report_at = models.DateField(
        null=True, blank=True, 
        auto_now=False, verbose_name='Fecha de reporte de Avance')

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

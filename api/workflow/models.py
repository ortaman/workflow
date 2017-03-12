
from django.db import models

from users.models import User


class Project(models.Model):

    PHASES = (
        ('preparacion', 'Preparación'),
        ('negociacion', 'Negociación'),
        ('ejecucion', 'Ejecución'),
        ('evaluacion', 'Evaluación'),
    )

    phase = models.CharField(choices=PHASES, max_length=11, default='preparacion', verbose_name='Fase de proyecto')    

    # action roles
    client = models.ForeignKey(User, related_name='client_project', verbose_name='Cliente')
    producer = models.ForeignKey(User, related_name='producer_project', verbose_name='Realizador')
    agent = models.ForeignKey(User, related_name='agent_project', verbose_name='Observador')
    
    # focus project
    name = models.CharField(max_length=64, verbose_name='Nombre')
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
    renegotiation_at = models.DateField(auto_now=False, verbose_name='Fecha de regenociación')
    report_at = models.DateField(auto_now=False, verbose_name='Fecha de reporte de Avance')

    # indicators
    financial = models.CharField(max_length=64, verbose_name='Financieros')
    operational = models.CharField(max_length=64, verbose_name='Operacionales')
    other1 = models.CharField(max_length=64, verbose_name='Otros')
    other2 = models.CharField(max_length=64, verbose_name='Otros')

    created_at = models.DateTimeField(auto_now=True, verbose_name='Fecha de creación') 
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Fecha de actualización')
    create_by = models.ForeignKey(User, related_name='project_create_by', verbose_name='Creado por')

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

    project = models.ForeignKey(Project, related_name='project', verbose_name='Proyecto relacionado')

    phase = models.CharField(choices=PHASES, max_length=11, default='preparacion', verbose_name='Fase de la acción')      

    # action roles
    client = models.ForeignKey(User, related_name='client_action', verbose_name='Cliente')
    producer = models.ForeignKey(User, related_name='producer_action', verbose_name='Realizador')
    agent = models.ForeignKey(User, related_name='agent_action', verbose_name='Observador')

    # focus project
    name = models.CharField(max_length=64, verbose_name='Nombre')
    toDo = models.TextField(max_length=512, verbose_name='¿Qué y como se realizará?')
    satisfactions = models.TextField(max_length=512, verbose_name='Condiciones de satisfacción')

    expire_at = models.DateField(auto_now=False, verbose_name='Fecha límite de la fase')

    # agremments
    begin_at = models.DateField(auto_now=False, verbose_name='Fecha de inicio')
    accomplish_at = models.DateField(auto_now=False, verbose_name='Fecha de cumplimiento')
    renegotiation_at = models.DateField(auto_now=False, verbose_name='Fecha de regenociación')
    report_at = models.DateField(auto_now=False, verbose_name='Fecha de reporte de Avance')

    # indicators
    financial = models.CharField(max_length=64, verbose_name='Financieros')
    operational = models.CharField(max_length=64, verbose_name='Operacionales')
    other1 = models.CharField(max_length=64, verbose_name='Otros')
    other2 = models.CharField(max_length=64, verbose_name='Otros')

    parent_action = models.ManyToManyField(
        'self', 
        blank=True,
        related_name='parent_action', 
        verbose_name='Acción hija')

    created_at = models.DateTimeField(auto_now=True, verbose_name='Fecha de creación') 
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Fecha de actualización')
    create_by = models.ForeignKey(User, related_name='action_create_by', verbose_name='Creado por')

    class Meta:
        verbose_name = ("Acción")
        verbose_name_plural = ("Acciones")

    def __str__(self):
        return "%s" % (self.name)


from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from users.models import User


class Action(models.Model):

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
        ('Pendiente', 'Pendiente'),
        ('Aceptada', 'Aceptada'),

        ('Ejecutada', 'Ejecutada'),

        ('Satisfactoria', 'Satisfactoria'),
        ('Insatisfactoria', 'Insatisfactoria'),
    )

    # focus project
    name = models.CharField(max_length=64, verbose_name='Nombre')
    kind = models.CharField(choices=TYPES, max_length=8, default='estandar', verbose_name='Tipos')
    phase = models.CharField(choices=PHASES, max_length=11, default='preparacion', verbose_name='Fase')
    status = models.CharField(choices=STATUS, max_length=16, default='Pendiente', verbose_name='Estado')

    # action roles
    client = models.ForeignKey(User, related_name='client_project', verbose_name='Cliente')
    producer = models.ForeignKey(User, related_name='producer_project', verbose_name='Realizador')
    observer = models.ForeignKey(User, related_name='agent_project', verbose_name='Observador')

    toDo = models.TextField(max_length=1024, verbose_name='¿Qué y como se realizará?')
    satisfactions = models.TextField(max_length=1024, verbose_name='Condiciones de satisfacción')

    # workflow dates
    preparation_at = models.DateField(null=True, blank=True, verbose_name='Fecha de preparación')
    negotiation_at = models.DateField(null=True, blank=True, verbose_name='Fecha de negociación')
    execution_at = models.DateField(null=True, blank=True, verbose_name='Fecha de ejecución')
    evaluation_at = models.DateField(null=True, blank=True, verbose_name='Fecha de evaluación')

    # agremments
    begin_at = models.DateField(verbose_name='Fecha de inicio')
    report_at = models.DateField(verbose_name='Fecha de reporte de avance')
    accomplish_at = models.DateField(verbose_name='Fecha de cumplimiento')
    renegotiation_at = models.DateField(null=True, blank=True, verbose_name='Fecha de regenociación')

    # indicators
    financial = models.CharField(max_length=128, null=True, blank=True, verbose_name='Financieros')
    operational = models.CharField(max_length=128, null=True, blank=True, verbose_name='Operacionales')
    other1 = models.CharField(max_length=128, null=True, blank=True, verbose_name='Otros')
    other2 = models.CharField(max_length=128, null=True, blank=True, verbose_name='Otros')

    image = models.ImageField(upload_to='images/', null=True, blank=True, verbose_name='Imagen')

    # Important dates of the workflow process given for the users
    created_at = models.DateField(auto_now=False, auto_now_add=True, verbose_name='Creada en la fecha')
    accepted_at = models.DateField(null=True, blank=True, verbose_name='Aceptada en la fecha')
    advance_report_at = models.DateField(null=True, blank=True, verbose_name='Creado el reporte de avance en la fecha')
    ejecution_report_at = models.DateField(null=True, blank=True, verbose_name='Creado el reporte de ejecución en la fecha')
    qualified_at = models.DateField(null=True, blank=True, verbose_name='Calificada en la fecha')

    updated_at = models.DateTimeField(auto_now=True, auto_now_add=False, verbose_name='Fecha de la última actualización')

    project = models.ForeignKey(
        'self',
        blank=True,
        null=True,
        related_name='projectt',
        verbose_name='Proyecto relacionado')

    parent_action = models.ForeignKey(
        'self',
        models.SET_NULL,
        blank=True,
        null=True,
        verbose_name='Acción Padre')

    created_by = models.ForeignKey(
        User,
        related_name='project_created_by',
        verbose_name='Creado por')

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

    created_at = models.DateTimeField(auto_now=False, auto_now_add=True, verbose_name='Fecha de creación')
    updated_at = models.DateTimeField(auto_now=True, auto_now_add=False, verbose_name='Fecha de actualización')

    created_by = models.ForeignKey(User, related_name='report_created_by', verbose_name='Creado por')

    class Meta:
        verbose_name = ("Reporte")
        verbose_name_plural = ("Reportes")

    def __str__(self):
        return "%s" % (self.action.name)


@receiver(post_save, sender=Report)
def change_status(sender, instance, created, **kwargs):
    '''
    Change the project o report status when create the reports.
    '''
    if created:
        obj = Action.objects.get(id=instance.action.id)

        if obj.advance_report_at is None:
            obj.advance_report_at = instance.created_at
            obj.save()

        elif obj.ejecution_report_at is None:
            obj.ejecution_report_at = instance.created_at
            obj.status = 'Ejecutada'
            obj.save()
    else:
        pass


class Alert(models.Model):

    KINDS = (
        ('Before', 'Before'),
        ('Deadline', 'Deadline'),
        ('After', 'After'),
    )

    action = models.ForeignKey(to=Action, related_name="action_alert", verbose_name="Acción")
    message = models.TextField(max_length=128, verbose_name="Mensaje")
    viewed = models.BooleanField(default=False, verbose_name="Mensaje Leido")
    kind = models.CharField(choices=KINDS, max_length=8, verbose_name='Tipos de alerta')

    created_at = models.DateTimeField(auto_now=False, auto_now_add=True, verbose_name='Fecha de creación')

    class Meta:
        verbose_name = ("Alerta")
        verbose_name_plural = ("Alertas")

    def __str__(self):
        return "%s" % (self.action.name)


# Create your tasks here
from __future__ import absolute_import, unicode_literals
from datetime import datetime, timedelta
from celery import shared_task

from workflow.models import Action, Alert


def save_alerts(message, **kwargs):
    actions = Action.objects.filter(**kwargs)

    for action in actions:
        message = '"%s": ' % action.name + message
        alert = Alert(action=action, message=message)
        alert.save()


@shared_task
def alerts():

    deadline = datetime.today()
    before_dealine = deadline - timedelta(days=2)
    after_dealine = deadline + timedelta(days=1)

    save_alerts(
        message = 'La fecha de avance de reporte expira en 2 días.',
        report_at=before_dealine.strftime("%Y-%m-%d"),
        advance_report_at=None,
        kind='Before'
    )

    save_alerts(
        message = 'La fecha de avance de ejecución expira en 2 días.',
        accomplish_at=before_dealine.strftime("%Y-%m-%d"),
        ejecution_report_at=None,
        kind='Before'
    )

    save_alerts(
        message = 'La fecha límite de reporte es el día de hoy',
        report_at=deadline.strftime("%Y-%m-%d"),
        advance_report_at=None,
        kind='Deadline'
    )

    save_alerts(
        message = 'La fecha límite de ejecución es el día de hoy.',
        accomplish_at=deadline.strftime("%Y-%m-%d"),
        ejecution_report_at=None,
        kind='Deadline'
    )

    save_alerts(
        message = 'La fecha de reporte ha expirado.',
        report_at=after_dealine.strftime("%Y-%m-%d"),
        advance_report_at=None,
        kind='After'
    )

    save_alerts(
        message = 'La fecha de ejecución ha expirado.',
        accomplish_at=after_dealine.strftime("%Y-%m-%d"),
        ejecution_report_at=None,
        kind='After'
    )

    return True

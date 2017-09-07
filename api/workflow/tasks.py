
# Create your tasks here
from __future__ import absolute_import, unicode_literals
from datetime import datetime, timedelta
from celery import shared_task

from workflow.models import Action, Alert


def save_alerts(kind, message, **kwargs):
    actions = Action.objects.filter(**kwargs)

    for action in actions:
        message = '"%s": ' % action.name + message
        alert = Alert(action=action, kind=kind, message=message)
        alert.save()


@shared_task
def alerts(post_date=None):

    if not post_date:
        post_date = datetime.today()

    before_dealine = post_date + timedelta(days=2)
    after_dealine = post_date - timedelta(days=1)

    save_alerts(
        kind='Before',
        message = 'La fecha del reporte de avance expira en 2 días.',
        report_at=before_dealine.strftime("%Y-%m-%d"),
        advance_report_at=None,
    )

    save_alerts(
        kind='Before',
        message = 'La fecha del reporte de ejecución expira en 2 días.',
        accomplish_at=before_dealine.strftime("%Y-%m-%d"),
        ejecution_report_at=None,
    )

    save_alerts(
        kind='Deadline',
        message = 'La fecha límite del reporte de avance es el día de hoy.',
        report_at=post_date.strftime("%Y-%m-%d"),
        advance_report_at=None,
    )

    save_alerts(
        kind='Deadline',
        message = 'La fecha límite del reporte de ejecución es el día de hoy.',
        accomplish_at=post_date.strftime("%Y-%m-%d"),
        ejecution_report_at=None,
    )

    save_alerts(
        kind='After',
        message = 'La fecha del reporte de avance ha expirado.',
        report_at=after_dealine.strftime("%Y-%m-%d"),
        advance_report_at=None,
    )

    save_alerts(
        kind='After',
        message = 'La fecha del reporte de ejecución ha expirado.',
        accomplish_at=after_dealine.strftime("%Y-%m-%d"),
        ejecution_report_at=None,
    )

    return True

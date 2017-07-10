
# Create your tasks here
from __future__ import absolute_import, unicode_literals
from celery import shared_task

from celery.utils.log import get_task_logger


@shared_task
def add():
    print ('****************   Adding   ****************')
    return 100


@shared_task
def mul(x, y):
    return x * y


@shared_task
def xsum(numbers):
    return sum(numbers)


from django.apps import AppConfig
from django.db.models.signals import post_save

from workflow.signals import send_action_email


class ApiConfig(AppConfig):
    name = 'workflow'

    def ready(self):
        Action = self.get_model('Action')

        post_save.connect(send_action_email, sender=Action)

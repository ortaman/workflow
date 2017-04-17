
from django.apps import AppConfig
from django.db.models.signals import post_save

from workflow.signals import send_project_email, send_action_email


class ApiConfig(AppConfig):
    name = 'workflow'

    def ready(self):
        Project = self.get_model('Project')
        Action = self.get_model('Action')

        post_save.connect(send_project_email, sender=Project)
        post_save.connect(send_action_email, sender=Action)

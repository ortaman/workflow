
from django.core.mail import send_mail
from django.template.loader import render_to_string


def send_project_email(sender, instance, created, **kwargs):
    context = {
            'project': instance,
        }

    if created:
        message = 'El proyecto "' + instance.name + '" ha sido creado.'
        status = 'ha sido creado'

    else:
        message = 'El proyecto "' + instance.name + '" ha sido actualizado.'
        status = 'ha sido actualizado'

    context = {
            'project': instance,
            'status': status,
        }

    html_message = render_to_string('workflow/project_email.html', context)

    send_mail(
        subject=instance.name,
        message=message,
        from_email=instance.client.email,
        recipient_list=[instance.client.email, instance.producer.email, instance.observer.email],
        fail_silently=False,
        html_message=html_message)


def send_action_email(sender, instance, created, **kwargs):
    context = {
            'action': instance,
        }

    if created:
        message = 'La acción "' + instance.name + '" ha sido creada.'
        status = 'ha sido creada'

    else:
        message = 'El acción "' + instance.name + '" ha sido actualizada.'
        status = 'ha sido actualizada'

    context = {
            'action': instance,
            'status': status,
        }

    html_message = render_to_string('workflow/action_email.html', context)

    send_mail(
        subject=instance.name,
        message=message,
        from_email=instance.client.email,
        recipient_list=[instance.client.email, instance.producer.email, instance.observer.email],
        fail_silently=False,
        html_message=html_message)


'''
def change_to_report_status(sender, instance, created, **kwargs):

    if created:
        pass

    else:
        pass
'''
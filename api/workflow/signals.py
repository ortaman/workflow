
from django.core.mail import send_mail
from django.template.loader import render_to_string


def send_action_email(sender, instance, created, **kwargs):

    if instance.parent_action is None:
        if created:
            message = 'El proyecto "' + instance.name + '" ha sido creado.'
            status = 'ha sido creado'

        else:
            message = 'El proyecto "' + instance.name + '" ha sido actualizado.'
            status = 'ha sido actualizado'

        template_url = 'workflow/project_email.html'
        context = {'project': instance, 'status': status}

    else:
        if created:
            message = 'La acción "' + instance.name + '" ha sido creada.'
            status = 'ha sido creada'

        else:
            message = 'La acción "' + instance.name + '" ha sido actualizada.'
            status = 'ha sido actualizada'

        template_url = 'workflow/action_email.html'
        context = {'action': instance, 'status': status}

    html_message = render_to_string(template_url, context)

    send_mail(
        subject=instance.name,
        message=message,
        from_email=instance.client.email,
        recipient_list=[instance.client.email, instance.producer.email, instance.observer.email],
        fail_silently=False,
        html_message=html_message)


from rest_framework import permissions
from workflow.models import Action


class ActionPermisssions(permissions.BasePermission):
    """
    All users can retrieve anyone action.
    All can create action with project and parent_action equal to null
    Producer can create action if is producer the parent_action.
    Only client can update action.
    Only producer can update parcial action.
    """

    def has_object_permission(self, request, view, obj):

        if request.method in SAFE_METHODS:
            return True

        if request.method is 'POST':
            
            parent_action = obj.get('parent_action')

            if parent_action is None and obj.created_by.id == request.user.id:
                return True

            elif parent_action is not None:
                action = Action.objects.get(id=obj.parent_action)

                if action.parent_action.producer.id == request.user.id:
                    return True

        if request.method is 'PUT':
            return obj.client.id == request.user.id

        if request.method is 'PATCH':
            return obj.producer.id == request.user.id

        return False


from rest_framework import permissions
from users.models import User


SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS']


class UserIsOwnerOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow an object to edit if is owner.
    """

    def has_object_permission(self, request, view, obj):

        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in SAFE_METHODS:
            return True

        # obj is retrieved by the :id url parameter.
        # request.user is retrieved by the token user. 
        return obj.id == request.user.id

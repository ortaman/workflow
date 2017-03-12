
from rest_framework import viewsets
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import User
from .permissions import UserIsOwnerOrReadOnly
from .serializer import UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    Provides list, create, retrieve, update and destroy user.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    lookup_field = 'id'
    permission_classes = (IsAuthenticated, UserIsOwnerOrReadOnly)


    def create(self, request, *args, **kwargs):
        """
        """
        content = {'error': 'Acceso no autorizado'}
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)


    def list(self, request, *args, **kwargs):
        """
        """
        content = {'error': 'Acceso no autorizado'}
        return Response(content, status=status.HTTP_401_UNAUTHORIZED)

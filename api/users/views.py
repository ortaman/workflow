
from rest_framework import viewsets, status
from rest_framework.views import APIView
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


class MyUser(APIView):
    """
    Retrieve, my account instance.
    """
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        serializer = UserSerializer(request.user)

        return Response(serializer.data)

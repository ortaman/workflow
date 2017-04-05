
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from workflow.models import Action
from workflow.serializers import ActionUserSerializer

from .models import User
from .permissions import UserIsOwnerOrReadOnly
from .serializers import UserSerializer


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
        return super(UserViewSet, self).list(request, *args, **kwargs)


    def get_queryset(self):

        query = self.request.query_params

        if 'first_surname' in query.keys():
            surname = query.get('first_surname')
            self.queryset = self.queryset.filter(first_surname__startswith=surname)

        elif 'project_id' in query.keys():

            self.queryset = Action.objects.all()
            self.serializer_class = ActionUserSerializer

            if query.get('parent_action')=='none':
                self.queryset = self.queryset.filter(
                    project_id=query.get('project_id'),
                    parent_action__isnull=True)
            else:
                self.queryset = self.queryset.filter(
                    project_id=query.get('project_id'))

        elif 'parent_action_id' in query.keys():
            self.queryset = self.queryset.filter(parent_action_id=query.get('parent_action_id'))


        return self.queryset


class MyUser(APIView):
    """
    Retrieve, my account instance.
    """
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        serializer = UserSerializer(request.user)

        return Response(serializer.data)

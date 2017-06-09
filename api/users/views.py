
from rest_framework import generics, viewsets, status, mixins
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination

from workflow.models import Action
from workflow.serializers import ActionProducerSerializer

from common.mixins import APIMixin
from .models import User
from .permissions import UserIsOwnerOrReadOnly
from .serializers import UserSerializer, UserPostSerializer



class MyCustomPagination(PageNumberPagination):
    page_size = 8
    page_size_query_param = 'paginate_by'
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response({
            'page': self.page.number,
            'paginated_by': self.page.paginator.per_page,
            'count': self.page.paginator.count,
            'results': data
        })


class UserViewSet(viewsets.ModelViewSet):
    """
    Provides list, create, retrieve, update and destroy user.
    """
    queryset = User.objects.all()

    pagination_class = MyCustomPagination
    serializer_class = UserSerializer

    lookup_field = 'id'
    permission_classes = (IsAuthenticated, UserIsOwnerOrReadOnly)


    def create(self, request, *args, **kwargs):
        self.serializer_class = UserPostSerializer
        return super(UserViewSet, self).create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        self.serializer_class = UserPostSerializer
        return super(UserViewSet, self).update(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        return super(UserViewSet, self).list(request, *args, **kwargs)


    def get_queryset(self):

        query = self.request.query_params

        if 'first_surname' in query.keys():
            surname = query.get('first_surname')
            self.queryset = self.queryset.filter(first_surname__istartswith=surname)

        return self.queryset


class ProducerList(APIView, APIMixin):
    """
    List all prodicer and producer stadistics
    searching by the project or action.
    """
    permission_classes = (IsAuthenticated,)

    # Mixing initial variables
    model = Action
    serializer_list = ActionProducerSerializer

    paginate_by = 6

    def get(self, request, format=None):
        page = request.GET.get('page', None)
        query = request.query_params
        query_keys = query.keys()

        queryset = self.model.objects.all()

        if 'project_id' in query_keys:

            if query.get('parent_action')=='none':
                queryset = queryset.filter(
                    project_id=query.get('project_id'),
                    parent_action__isnull=True)
            else:
                queryset = queryset.filter(
                    project_id=query.get('project_id'))

        elif 'parent_action_id' in query_keys:

            queryset = queryset.filter(
                parent_action_id=query.get('parent_action_id'))

        queryset = queryset.distinct('producer__id')
        paginated_data = self.get_pagination(queryset, page, self.paginate_by)

        data = {
            'count':  paginated_data['count'],
            'page': paginated_data['page'],
            'paginate_by': paginated_data['paginate_by'],
            'producers': []
        }

        for producer in paginated_data['results']:
            data['producers'].append({
                'producer': producer['producer'],
                'pending': Action.objects.filter(status="Pendiente", producer_id=producer['producer']['id']).count(),
                'accepted': Action.objects.filter(status="Aceptada", producer_id=producer['producer']['id']).count(),
                'ejecuted': Action.objects.filter(status="Ejecutada", producer_id=producer['producer']['id']).count(),
                'satisfactories': Action.objects.filter(status="Satisfactoria", producer_id=producer['producer']['id']).count(),
                'unsatisfactories': Action.objects.filter(status="Insatisfactoria", producer_id=producer['producer']['id']).count()
            })

        return Response(data)


class MyUser(APIView):
    """
    Retrieve, my account instance.
    """
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        serializer = UserSerializer(request.user)

        return Response(serializer.data)

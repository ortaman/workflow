
from rest_framework.viewsets import GenericViewSet
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.mixins import ListModelMixin, UpdateModelMixin

from workflow.models import Alert
from workflow.permissions import AlertReadOnlyIfIsProducer
from workflow.serializers import AlertListSerializer, AlertPartialUpdateSerializer


class MyCustomPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'paginate_by'
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response({
            'page': self.page.number,
            'paginated_by': self.page.paginator.per_page,
            'count': self.page.paginator.count,
            'results': data
        })


class AlertsList(ListModelMixin, UpdateModelMixin, GenericViewSet):
    """
    Retrieve a list of alrts.
    """
    queryset = Alert.objects.all()
    lookup_field = 'pk'

    serializer_class = AlertListSerializer
    pagination_class = MyCustomPagination
    permission_classes = (IsAuthenticated, AlertReadOnlyIfIsProducer)

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return AlertListSerializer
        if self.request.method == 'PATCH':
            return AlertPartialUpdateSerializer

    def get_queryset(self):
        return self.queryset.filter(
            action__producer_id=self.request.user.id,
            viewed = False
            )

    '''
    def get(self, request, *args, **kwargs):
        return super(AlertsList, self).list(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        return super(AlertsList, self).update(request, *args, **kwargs)
    '''

    def partial_update(self, request, *args, **kwargs):
        return super(AlertsList, self).partial_update(request, *args, **kwargs)

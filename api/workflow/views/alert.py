
from rest_framework.viewsets import GenericViewSet
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.mixins import ListModelMixin, UpdateModelMixin

from common.paginations import MyCustomPagination
from workflow.models import Alert
from workflow.permissions import AlertReadOnlyIfIsProducer
from workflow.serializers import AlertListSerializer, AlertPartialUpdateSerializer


class AlertsListViewSet(ListModelMixin, UpdateModelMixin, GenericViewSet):
    """
    Retrieve a list of alrts.
    """
    lookup_field = 'pk'

    queryset = Alert.objects.all()

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
    def create(self, request, *args, **kwargs):
        return super(AlertsListViewSet, self).create(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        return super(AlertsListViewSet, self).list(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        return super(AlertsListViewSet, self).update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        return super(AlertsListViewSet, self).partial_update(request, *args, **kwargs)
    '''
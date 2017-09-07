
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.mixins import ListModelMixin, UpdateModelMixin

from common.paginations import MyCustomPagination
from django.utils.dateparse import parse_date
from workflow.models import Alert
from workflow.permissions import AlertReadOnlyIfIsProducer
from workflow.serializers import AlertListSerializer, AlertPartialUpdateSerializer
from workflow.tasks import alerts


class AlertsListViewSet(ListModelMixin, UpdateModelMixin, GenericViewSet):
    """
    Retrieve a list of alerts.
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

class AlertTaskView(APIView):
    """
    End point to testing Alert tasks
    """

    def get(self, request, format=None):

        post_date = request.query_params.get('post_date', '')
        post_date = parse_date(post_date)

        alerts(post_date=post_date)
        data = {'status': 'Alerts worker triggered successfully for date %s' % post_date}

        return Response(data=data, status=status.HTTP_200_OK)

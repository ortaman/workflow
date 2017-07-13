
from rest_framework.generics import GenericAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.mixins import ListModelMixin, CreateModelMixin

from workflow.models import Alert
from workflow.permissions import AlertOrReadOnlyIfIsProducer
from workflow.serializers import AlertListSerializer


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


class AlertsList(ListModelMixin, CreateModelMixin, GenericAPIView):
    """
    Retrieve a list of alrts.
    """
    queryset = Alert.objects.all()

    serializer_class = AlertListSerializer
    pagination_class = MyCustomPagination
    permission_classes = (IsAuthenticated, AlertOrReadOnlyIfIsProducer)

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


from rest_framework.mixins import ListModelMixin, CreateModelMixin
from rest_framework.generics import GenericAPIView

from workflow.models import Alert
from workflow.serializers import AlertSerializer


class AlertsList(ListModelMixin, CreateModelMixin, GenericAPIView):
    queryset = Alert.objects.all()
    serializer_class = AlertSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

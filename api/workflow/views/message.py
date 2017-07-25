
from rest_framework.viewsets import GenericViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.mixins import CreateModelMixin, ListModelMixin

from common.paginations import MyCustomPagination
from workflow.models import Message
from workflow.serializers import MessageCreateSerializer


class CommentsListViewSet(CreateModelMixin, ListModelMixin, GenericViewSet):

    """
    Create a message or retrieve a list of messages.
    """

    queryset = Message.objects.all()

    serializer_class = MessageCreateSerializer
    pagination_class = MyCustomPagination
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        action_id = self.request.query_params.get('action_id')
        return self.queryset.filter(action_id=action_id)


from rest_framework import status
from rest_framework.viewsets import GenericViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.mixins import CreateModelMixin, ListModelMixin
from rest_framework.response import Response

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

    def create(self, request, *args, **kwargs):
        data = request.data
        data['sender'] = request.user
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
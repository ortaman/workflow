
from rest_framework.viewsets import GenericViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.mixins import CreateModelMixin, ListModelMixin

from common.paginations import MyCustomPagination
from workflow.models import Message
from workflow.serializers import MessageCreateSerializer


class CommentsListViewSet(CreateModelMixin, ListModelMixin, GenericViewSet):

    """
    Retrieve a list of alrts.
    """
    # paginate_by = 20
    # lookup_field = 'pk'

    queryset = Message.objects.all()

    serializer_class = MessageCreateSerializer
    pagination_class = MyCustomPagination
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        action_id = self.request.query_params.get('action_id')
        return self.queryset.filter(action_id=action_id)

    '''
    def create(self, request, *args, **kwargs):
        return super(CommentsListViewSet, self).create(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        return super(CommentsListViewSet, self).list(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        return super(CommentsListViewSet, self).update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        return super(CommentsListViewSet, self).partial_update(request, *args, **kwargs)
    '''

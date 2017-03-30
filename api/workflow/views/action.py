
from django.http import Http404

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from workflow.models import Action
from workflow.serializers import ActionSerializer, ActionSerializerExtended
from common.mixins import CommonMixin


class ActionDetail(APIView, CommonMixin):
    """
    Retrieve, update or delete a action instance.
    """
    permission_classes = (IsAuthenticated,)

    # Initial mixin variables
    model = Action
    serializer_class = ActionSerializer
    serializer_class_extended = ActionSerializerExtended

    def get(self, request, pk, format=None):
        action = self.get_object(pk)
        serializer = self.serializer_class_extended(action)

        return Response(serializer.data)

    def put(self, request, pk, format=None):
        action = self.get_object(pk)
        serializer = self.serializer_class(action, data=request.data)
        
        if serializer.is_valid(): 
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        action = self.get_object(pk)
        action.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)



class ActionList(APIView, CommonMixin):
    """
    List all actions, or create a new action.
    List all actions from specific project: ?project_id='id'
    List the actions linked with the specific project: ?project_id='id'&action_isnull

    List all actions from specific action: ?action_id='id'
    """
    permission_classes = (IsAuthenticated,)

    # Initial mixin variables
    model = Action
    serializer_class = ActionSerializer
    serializer_class_extended = ActionSerializerExtended
    
    paginate_by = 10

    def get(self, request, format=None):
        page = request.GET.get('page')
        query = request.query_params

        queryset = self.model.objects.all()

        if 'project_id' in query.keys():
            if 'action_isnull' in query.keys():
                queryset = queryset.filter(
                    project_id=query.get('project_id'), 
                    parent_action__isnull=True
                )
            else:
                queryset = queryset.filter(project_id=query.get('project_id'))

        elif 'parent_action_id' in query.keys():
            queryset = queryset.filter(parent_action_id=query.get('parent_action_id'))
            
        data = self.get_pagination(queryset, page, self.paginate_by)
        return Response(data)

    def post(self, request, format=None):
        serializer = serializer_class(data=request.data)
        
        if serializer.is_valid():
            serializer.save(create_by=request.user)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

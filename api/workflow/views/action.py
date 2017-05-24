
from django.db.models import Q
from django.http import Http404

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from workflow.models import Action
from workflow.serializers import ActionPostSerializer, ActionGetSerializer, ActionListSerializer
from common.mixins import APIMixin


class ActionDetail(APIView, APIMixin):
    """
    Retrieve, update or delete a action instance.
    """
    permission_classes = (IsAuthenticated,)

    # Initial mixin variables
    model = Action
    serializer_get = ActionGetSerializer
    serializer_put = ActionPostSerializer

    def get(self, request, pk, format=None):
        obj = self.get_object(pk)
        serializer = self.serializer_get(obj)

        return Response(serializer.data)

    def put(self, request, pk, format=None):
        obj = self.get_object(pk)
        serializer = self.serializer_put(obj, data=request.data)

        self.put_vatidations(obj, request.user)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk, format=None):
        obj = self.get_object(pk)
        serializer = self.serializer_put(obj, data=request.data, partial=True)

        self.patch_vatidations(obj, request.user)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def delete(self, request, pk, format=None):
        obj = self.get_object(pk)
        obj.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)



class ActionList(APIView, APIMixin):
    """
    List all actions, or create a new action.
    List all actions from specific project: ?project_id='id'
    List the actions linked with the specific project: ?project_id='id'&action_isnull

    List all actions from specific action: ?action_id='id'
    """
    permission_classes = (IsAuthenticated,)

    # Initial mixin variables (model and serializer_list)
    model = Action

    serializer_list = ActionListSerializer
    serializer_post = ActionPostSerializer

    paginate_by = 10

    def get(self, request, format=None):
        page = request.GET.get('page')
        query = request.query_params

        queryset = self.model.objects.all()

        if 'project_id' in query.keys():

            if query.get('parent_action') == 'none' and 'status' in query.keys():
                queryset = queryset.filter (
                    project_id=query.get('project_id'),
                    parent_action__isnull=True,
                    status=query.get('status')
                )

            elif 'begin_date' in query.keys() and 'end_date' in query.keys():
                range_date = [query.get('begin_date'), query.get('end_date')]
                q1 = Q(project__id = query.get('project_id'))
                q2 = (
                    Q(begin_at__range         = range_date) |
                    Q(report_at__range        = range_date) |
                    Q(accomplish_at__range    = range_date))

                queryset = queryset.filter(q1, q2)
                serializer = self.serializer_list(queryset, many=True)

                return Response(serializer.data)

            else:
                queryset = queryset.filter(project_id=query.get('project_id'))

        # Search by parent action and status.
        elif 'parent_action_id' in query.keys():

            queryset = queryset.filter(
                parent_action_id=query.get('parent_action_id'),
                status=query.get('status'),
            )

        # Search actions by producer and  status.
        elif 'producer' in query.keys() and 'status' in query.keys():
                queryset = queryset.filter(
                    producer_id=query.get('producer'),
                    status=query.get('status'),
                )

        # Search actions by client and  status.
        elif 'client' in query.keys() and 'status' in query.keys():
                queryset = queryset.filter(
                    client_id=query.get('client'),
                    status=query.get('status'),
                )

        data = self.get_pagination(queryset, page, self.paginate_by)

        return Response(data)

    def post(self, request, format=None):
        serializer = self.serializer_post(data=request.data)

        if serializer.is_valid():
            serializer.save(created_by=request.user)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ActionStadisctic(APIView, APIMixin):
    """
    """
    permission_classes = (IsAuthenticated,)

    # Initial mixin variables (model and serializer_list)
    model = Action

    def get(self, request, format=None):

        user_id = request.user.id
        queryset = self.model.objects.all()
        
        q1 = Q(client_id = user_id)
        q2 = (Q(status = 'Pendiente') | Q(status = 'Abierta') | Q(status = 'Ejecutada'))
        q3 = Q(status = 'Ejecutada')
        q4 = Q(status = 'Satisfactoria')  
        q5 = Q(status = 'Insatisfactoria')
        q7 = Q(producer_id=user_id)

        data = {
            'pending_promises': queryset.filter(q1, q2).count(),
            'ejecuted_promises': queryset.filter(q1, q3).count(),
            'satisfactory_promises':  queryset.filter(q1, q4).count(),
            'insatisfactory_promises': queryset.filter(q1, q5).count(),
            'pending_order': queryset.filter(q7, q2).count(),
            'ejecuted_order': queryset.filter(q7, q3).count(),
            'satisfactory_order': queryset.filter(q7, q4).count(),
            'insatisfactory_order': queryset.filter(q7, q5).count(),
        }

        return Response(data)

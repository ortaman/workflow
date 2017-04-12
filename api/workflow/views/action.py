
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
        action = self.get_object(pk)
        serializer = self.serializer_get(action)

        return Response(serializer.data)

    def put(self, request, pk, format=None):
        action = self.get_object(pk)
        serializer = self.serializer_put(action, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        action = self.get_object(pk)
        action.delete()

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
                    Q(expire_at__range        = range_date) |
                    Q(report_at__range        = range_date) |
                    Q(accomplish_at__range    = range_date) |
                    Q(renegotiation_at__range = range_date))

                queryset = queryset.filter(q1, q2)
                serializer = self.serializer_list(queryset, many=True)

                from datetime import datetime

                begin_date = datetime.strptime(query.get('begin_date'), "%Y-%m-%d")
                end_date   = datetime.strptime(query.get('end_date'), "%Y-%m-%d")

                data = []

                timelines = [
                    {
                    'date':'begin_at',
                    'text':'Fecha de inicio'
                    },{
                    'date':'expire_at',
                    'text':'Fecha de expiración'
                    },{
                    'date':'report_at',
                    'text':'fecha de cumplimiento'
                    },{
                    'date':'accomplish_at',
                    'text':'Fecha de reporte de avance'
                    },{
                    'date':'renegotiation_at',
                    'text':'Fecha de Renegociación'
                    },
                ]

                for action in serializer.data:

                    for tl in timelines:

                        action_begin_date = datetime.strptime(action[tl['date']], "%Y-%m-%d")
                        action_end_date   = datetime.strptime(action[tl['date']], "%Y-%m-%d")

                        if action_begin_date >= begin_date and action_end_date <= end_date:

                            action_copy = action.copy()
                            action_copy['timeline_text'] = tl['text']

                            data.append({
                                'timeline': action_copy[tl['date']],
                                'actions': [action_copy]
                            })

                return Response(data)

            else:
                queryset = queryset.filter(project_id=query.get('project_id'))

        elif 'parent_action_id' in query.keys():

            queryset = queryset.filter(
                parent_action_id=query.get('parent_action_id'),
                status=query.get('status'),
            )

        elif 'client' in query.keys() and 'promise' in query.keys():
            
            queryset = queryset.filter(
                client_id=query.get('client'),
                promise=query.get('promise'),
            )

        elif 'producer' in query.keys() and 'promise' in query.keys():

            queryset = queryset.filter(
                producer_id=query.get('producer'),
                promise=query.get('promise'),
            )

        data = self.get_pagination(queryset, page, self.paginate_by)

        return Response(data)

    def post(self, request, format=None):
        serializer = self.serializer_post(data=request.data)

        if serializer.is_valid():
            serializer.save(create_by=request.user)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def add_custom_action(self, action, begin_date, end_date, timeline_text):
        if action['begin_at'] >= begin_date and action['begin_at'] <= end_date:

            action['timeline_text'] = timeline_text
            data.append({
                'timeline': action['begin_at'],
                'actions': [action]
            })

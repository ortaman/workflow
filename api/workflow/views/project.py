
from datetime import datetime

from django.db.models import Q

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from workflow.models import Action
from workflow.serializers import (ProjectPostSerializer, ProjectGetSerializer, ProjectListSerializer, ProjectPatchSerializer)
from common.mixins import APIMixin


class ProjectDetail(APIView, APIMixin):
    """
    Retrieve, update or delete a projects instance.
    """
    permission_classes = (IsAuthenticated,)

    # Mixing initial variables
    model = Action
    serializer_get = ProjectGetSerializer
    serializer_put = ProjectPostSerializer
    serializer_patch = ProjectPatchSerializer

    def get(self, request, pk, format=None):

        obj = self.get_object(pk)
        serializer = self.serializer_get(obj)

        return Response(serializer.data)

    def put(self, request, pk, format=None):
        obj = self.get_object(pk)
        serializer = self.serializer_put(obj, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk, format=None):
        obj = self.get_object(pk)
        serializer = self.serializer_patch(obj, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    '''
    def delete(self, request, pk, format=None):
        obj = self.get_object(pk)
        obj.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)
    '''


class ProjectList(APIView, APIMixin):
    """
    List all proyects, or create a new project.
    """
    permission_classes = (IsAuthenticated,)

    # Mixing initial variables
    model = Action
    serializer_list = ProjectListSerializer
    serializer_post = ProjectPostSerializer

    paginate_by = 6

    def get(self, request, format=None):
        page = request.GET.get('page', None)
        query = request.query_params

        queryset = self.model.objects.all()

        if page is None:
            # Retrieve all projects without paginated used on actions board combobox filter.
            queryset = queryset.filter(
                parent_action__isnull=True,
            )

        else:
            # Retrieve projects filter by phase used on project board.
            if 'phase' in query.keys():
                queryset = queryset.filter(
                    phase=query.get('phase'),
                    parent_action__isnull=True,
                )

            # Retrieve thec lient and produce owner projects filter by user_id used on profile user.
            elif 'client_id' in query.keys():
                queryset = queryset.filter(
                    Q(status=query.get('status')),
                    Q(client=query.get('client_id')) | Q(producer=query.get('client_id'))
                )

            else:
                queryset = queryset.filter(parent_action__isnull=True)

        data = self.get_pagination(queryset, page, self.paginate_by)

        return Response(data)

    def post(self, request, format=None):
        serializer = self.serializer_post(data=request.data)

        if serializer.is_valid():
            serializer.save(created_by=request.user)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProjectTimeStadistic(APIView):
    """
    """
    permission_classes = (IsAuthenticated,)

    # Initial mixin variables (model and serializer_list)
    model = Action

    def get(self, request, format=None):

        queryset = self.model.objects.filter(
                parent_action__isnull=True,
        )

        in_time = 0
        delayed = 0

        for obj in queryset:
            if datetime.now().date() <= obj.accomplish_at:
                if datetime.now().date() <= obj.report_at:
                    in_time += 1
                elif obj.ejecution_report_at is not None:
                    if obj.ejecution_report_at <= obj.report_at:
                        in_time += 1

            # to count proyects delayed
            if obj.ejecution_report_at is None:
                if datetime.now().date() > obj.accomplish_at:
                    delayed += 1
            else:
                if obj.ejecution_report_at > obj.accomplish_at:
                    delayed += 1

        data = {
            'in_time': in_time,
            'in_risk': queryset.count() - (in_time + delayed),
            'delayed': delayed,
        }

        return Response(data)

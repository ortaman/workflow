
from django.db.models import Q
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.http import Http404

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from workflow.models import Project
from workflow.serializers import ProjectPostSerializer, ProjectGetSerializer, ProjectListSerializer
from common.mixins import APIMixin


class ProjectDetail(APIView, APIMixin):
    """
    Retrieve, update or delete a projects instance.
    """
    permission_classes = (IsAuthenticated,)

    # Mixing initial variables
    model = Project
    serializer_get = ProjectGetSerializer
    serializer_put = ProjectPostSerializer

    def get(self, request, pk, format=None):
        project = self.get_object(pk)
        serializer = self.serializer_get(project)

        return Response(serializer.data)

    def put(self, request, pk, format=None):
        project = self.get_object(pk)
        serializer = self.serializer_put(project, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        project = self.get_object(pk)
        project.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)


class ProjectList(APIView, APIMixin):
    """
    List all proyects, or create a new project.
    """

    # Mixing initial variables
    model = Project
    serializer_list = ProjectListSerializer
    serializer_post = ProjectPostSerializer

    paginate_by = 6

    def get(self, request, format=None):
        page = request.GET.get('page')
        query = request.query_params

        queryset = self.model.objects.all()

        if 'begin_date' in query.keys() and 'end_date' in query.keys():
            range_date = [query.get('begin_date'), query.get('end_date')]

            q = (
                Q(preparation_at__range   = range_date) |
                Q(negotiation_at__range   = range_date) |
                Q(execution_at__range     = range_date) |
                Q(evaluation_at__range    = range_date) |
                Q(begin_at__range         = range_date) |
                Q(accomplish_at__range    = range_date) |
                Q(renegotiation_at__range = range_date) |
                Q(report_at__range        = range_date)
            )

            queryset = queryset.filter(q)

            serializer = self.serializer_list(queryset, many=True)
            return Response(serializer.data)

        data = self.get_pagination(queryset, page, self.paginate_by)
        return Response(data)


    def post(self, request, format=None):
        serializer = self.serializer_post(data=request.data)

        if serializer.is_valid():
            serializer.save(create_by=request.user)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

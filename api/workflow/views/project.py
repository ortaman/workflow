
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
        serializer = self.serializer_put(obj, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        obj = self.get_object(pk)
        obj.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)


class ProjectList(APIView, APIMixin):
    """
    List all proyects, or create a new project.
    """
    permission_classes = (IsAuthenticated,)

    # Mixing initial variables
    model = Project
    serializer_list = ProjectListSerializer
    serializer_post = ProjectPostSerializer

    paginate_by = 6

    def get(self, request, format=None):
        page = request.GET.get('page', None)
        query = request.query_params

        queryset = self.model.objects.all()

        if page is None:
            data = self.serializer_list(queryset, many=True).data
        else:
            if 'phase' in query.keys():
                queryset = queryset.filter(phase=query.get('phase'))

            # Search project by client and  status.
            elif 'client' in query.keys() and 'status' in query.keys():
                queryset = queryset.filter(
                    client_id=query.get('client'),
                    status=query.get('status'),
                )

            elif 'client' in query.keys() and 'promise' in query.keys():
                    queryset = queryset.filter(
                        client_id=query.get('client'),
                        promise=query.get('promise'),
                    )
            # Search project by producer and promise status.
            elif 'producer' in query.keys() and 'promise' in query.keys():

                queryset = queryset.filter(
                    producer_id=query.get('producer'),
                    promise=query.get('promise'),
                )



            elif 'producer' in query.keys() and 'status' in query.keys():

                queryset = queryset.filter(
                    producer_id=query.get('producer'),
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

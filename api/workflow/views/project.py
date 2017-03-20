
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.http import Http404

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from workflow.models import Project
from workflow.serializers import ProjectSerializer, ProjectSerializerExtended
from common.mixins import CommonMixin


class ProjectDetail(APIView, CommonMixin):
    """
    Retrieve, update or delete a projects instance.
    """
    permission_classes = (IsAuthenticated,)

    # Mixing initial variables
    model = Project
    serializer_class = ProjectSerializer

    def get(self, request, pk, format=None):
        project = self.get_object(pk)
        serializer = ProjectSerializerExtended(project)

        return Response(serializer.data)

    def put(self, request, pk, format=None):
        project = self.get_object(pk)
        serializer = self.serializer_class(project, data=request.data)
        
        if serializer.is_valid(): 
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        project = self.get_object(pk)
        project.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)



class ProjectList(APIView, CommonMixin):
    """
    List all proyects, or create a new project.
    """

    # Mixing initial variables
    model = Project
    serializer_class = ProjectSerializer
    paginate_by = 6

    def get(self, request, format=None):
        page = request.GET.get('page')
        proyects = self.model.objects.all()

        data = self.get_pagination(proyects, page, self.paginate_by)
        return Response(data)


    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        
        if serializer.is_valid():	
            serializer.save(create_by=request.user)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

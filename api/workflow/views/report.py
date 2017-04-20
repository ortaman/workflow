
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from workflow.models import Report
from workflow.serializers import ReportPostSerializer, ReportListSerializer, ReportGetSerializer
from common.mixins import APIMixin


class ReportDetail(APIView, APIMixin):
    """
    Retrieve a report instance.
    """
    permission_classes = (IsAuthenticated,)

    # Mixing initial variables
    model = Report
    serializer_get = ReportGetSerializer

    def get(self, request, pk, format=None):
        report = self.get_object(pk)
        serializer = self.serializer_get(report)

        return Response(serializer.data)


class ReportList(APIView, APIMixin):
    """
    Create a new report.
    """
    permission_classes = (IsAuthenticated,)

    # Mixing initial variables
    model = Report
    serializer_post = ReportPostSerializer
    serializer_list = ReportListSerializer


    def get(self, request, format=None):
        query = request.query_params
        query_keys = query.keys()

        if 'project_id' in query_keys and 'action_id' in query_keys:
            print("kkkkk")
            queryset = self.model.objects.filter(
                project_id=query.get('proyect_id'),
                action_id=query.get('action_id'))

            data = self.serializer_list(queryset, many=True).data

        else:
            print("uuuuu")

            data = []


        return Response(data)

    def post(self, request, format=None):
        serializer = self.serializer_post(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

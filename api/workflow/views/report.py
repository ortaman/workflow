
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from workflow.models import Report
from workflow.serializers import ReportPostSerializer


class ReportList(APIView):
    """
    Create a new report.
    """
    permission_classes = (IsAuthenticated,)

    # Mixing initial variables
    model = Report
    serializer_post = ReportPostSerializer

    def post(self, request, format=None):
        serializer = self.serializer_post(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

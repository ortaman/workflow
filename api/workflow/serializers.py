import base64, uuid

from django.core.files.base import ContentFile
from django.conf import settings

from rest_framework import serializers

from users.serializers import UserSerializer
from workflow.models import Action, Report


class Base64ImageField(serializers.ImageField):
    def to_internal_value(self, data):
        if isinstance(data, str) and data.startswith('data:'): # You can change "data:" to "data/image:"
            format, imgstr = data.split(';base64,')
            ext  = format.split('/')[-1]
            id   = uuid.uuid4()
            data = ContentFile(base64.b64decode(imgstr), name=id.urn[9:])

        return super(Base64ImageField, self).to_internal_value(data)


class ReportPostSerializer(serializers.ModelSerializer):

    class Meta:
        model  = Report
        fields = '__all__'


class ReportListSerializer(serializers.ModelSerializer):

    class Meta:
        model  = Report
        fields = '__all__'


class ReportGetSerializer(serializers.ModelSerializer):

    class Meta:
        model  = Report
        fields = '__all__'


class ActionPostSerializer(serializers.ModelSerializer):

    class Meta:
        model  = Action
        fields = (
            'name', 'kind', 'phase', 'status',
            'client', 'producer', 'observer',
            'toDo', 'satisfactions',
            'preparation_at', 'negotiation_at', 'execution_at', 'evaluation_at',
            'begin_at', 'report_at', 'accomplish_at', 'renegotiation_at',
            'advance_report_at', 'ejecution_report_at',
            'financial', 'operational', 'other1', 'other2', 
            'image',
            'advance_reported', 'ejecution_report'
            'project', 'parent_action', 'created_by')

    read_only_fields =  ('status', 'created_at', 'updated_at','created_by')


class ActionPutSerializer(serializers.ModelSerializer):

    class Meta:
        model  = Action
        fields = ('phase', 'status')

    read_only_fields =  ('status', 'created_at', 'updated_at','created_by')    


class ActionGetSerializer(serializers.ModelSerializer):

    client = UserSerializer()
    producer = UserSerializer()
    observer = UserSerializer()

    advance_reported = ReportGetSerializer()
    ejecution_report = ReportGetSerializer()

    project = ActionPostSerializer()
    project = ActionPostSerializer()

    class Meta:
        model  = Action
        fields = '__all__'


class ActionListSerializer(serializers.ModelSerializer):

    producer = UserSerializer()
    client = UserSerializer()

    project = ActionGetSerializer()
    parent_action = ActionGetSerializer()

    class Meta:
        model  = Action
        fields = (
            'id', 'name', 'kind', 'phase', 'status',
            'client', 'producer',
            'preparation_at', 'negotiation_at', 'execution_at', 'evaluation_at',
            'begin_at', 'report_at', 'accomplish_at', 'renegotiation_at',
            'image',
            'advance_report_at', 'ejecution_report_at',
            'project', 'parent_action')


class ActionClientSerializer(serializers.ModelSerializer):

    client = UserSerializer()

    class Meta:
        model  = Action
        fields = ('client',)


class ActionProducerSerializer(serializers.ModelSerializer):

    producer = UserSerializer()

    class Meta:
        model  = Action
        fields = ('producer',)

import base64, uuid

from django.core.files.base import ContentFile
from django.conf import settings

from rest_framework import serializers

from users.serializers import UserSerializer
from .models import Project, Action, Report


class Base64ImageField(serializers.ImageField):
    def to_internal_value(self, data):
        if isinstance(data, str) and data.startswith('data:'): # You can change "data:" to "data/image:"
            format, imgstr = data.split(';base64,')
            ext  = format.split('/')[-1]
            id   = uuid.uuid4()
            data = ContentFile(base64.b64decode(imgstr), name=id.urn[9:])

        return super(Base64ImageField, self).to_internal_value(data)


class ProjectPostSerializer(serializers.ModelSerializer):
    image = Base64ImageField(max_length=None, use_url=True)

    class Meta:
        model  = Project
        fields = ('id','client', 'producer', 'observer', 'name', 'kind', 'phase',
            'toDo', 'satisfactions', 'preparation_at', 'negotiation_at', 'execution_at',
            'evaluation_at', 'begin_at', 'accomplish_at', 'renegotiation_at', 'report_at',
            'financial', 'operational', 'other1', 'other2', 'image', 'promise', 'status' )

    read_only_fields =  ('created_at', 'updated_at','create_by',)


class ProjectGetSerializer(serializers.ModelSerializer):

    client = UserSerializer()
    producer = UserSerializer()
    observer = UserSerializer()

    class Meta:
        model = Project
        fields = '__all__'


class ProjectListSerializer(serializers.ModelSerializer):

    report = serializers.SerializerMethodField()
    producer = UserSerializer()
    client = UserSerializer()

    def get_report(self, obj):
        reports = Report.objects.filter(project_id = obj.id)
        try:
            return reports[0].progress
        except IndexError as e:
            return 0

    class Meta:
        model  = Project
        fields = (
            'id', 'name', 'kind', 'phase', 'image',
            'preparation_at', 'negotiation_at', 'execution_at', 'evaluation_at',
            'begin_at', 'accomplish_at', 'renegotiation_at', 'report_at', 'report',
            'client', 'producer')


class ActionPostSerializer(serializers.ModelSerializer):

    class Meta:
        model  = Action
        fields = (
            'id', 'project', 'name', 'phase',
            'status', 'promise',
            'client', 'producer', 'observer',
            'toDo', 'satisfactions',
            'begin_at', 'accomplish_at', 'report_at',
            'financial', 'operational', 'other1', 'other2', 'parent_action')

    read_only_fields =  ('created_at', 'updated_at','create_by', 'promise')


class ActionGetSerializer(serializers.ModelSerializer):

    project = ProjectPostSerializer()

    client = UserSerializer()
    producer = UserSerializer()
    observer = UserSerializer()

    class Meta:
        model  = Action
        fields = '__all__'


class ActionListSerializer(serializers.ModelSerializer):

    producer = UserSerializer()
    client = UserSerializer()
    project = ProjectGetSerializer()
    report = serializers.SerializerMethodField()

    def get_report(self, obj):
        reports = Report.objects.filter(action_id = obj.id)
        try:
            return reports[0].progress
        except IndexError as e:
            return 0


    class Meta:
        model  = Action
        fields = (
            'id', 'name', 'producer', 'client', 'project', 'toDo',
            'begin_at', 'accomplish_at', 'report_at', 'report')


class ActionUserSerializer(serializers.ModelSerializer):

    producer = UserSerializer()

    class Meta:
        model  = Action
        fields = ('producer',)


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


from rest_framework import serializers

from .models import Project, Action
from users.serializers import UserSerializer

from django.conf import settings


class ProjectSerializer(serializers.ModelSerializer):
    preparation_at = serializers.DateField(input_formats=settings.DATE_INPUT_FORMATS)
    negotiation_at = serializers.DateField(input_formats=settings.DATE_INPUT_FORMATS)
    execution_at = serializers.DateField(input_formats=settings.DATE_INPUT_FORMATS)
    evaluation_at = serializers.DateField(input_formats=settings.DATE_INPUT_FORMATS)
    
    begin_at = serializers.DateField(input_formats=settings.DATE_INPUT_FORMATS)
    accomplish_at = serializers.DateField(input_formats=settings.DATE_INPUT_FORMATS)
    renegotiation_at = serializers.DateField(input_formats=settings.DATE_INPUT_FORMATS)
    report_at = serializers.DateField(input_formats=settings.DATE_INPUT_FORMATS)
    
    class Meta:
        model = Project
        fields = ('id','client', 'producer', 'observer', 'name', 'clasification', 'phase',
            'toDo', 'satisfactions', 'preparation_at', 'negotiation_at', 'execution_at',
            'evaluation_at', 'begin_at', 'accomplish_at', 'renegotiation_at', 'report_at',
            'financial', 'operational', 'other1', 'other2')

    read_only_fields =  ('created_at', 'updated_at','create_by',)


class ProjectSerializerExtended(serializers.ModelSerializer):

    client = UserSerializer()
    producer = UserSerializer()
    observer = UserSerializer()
    create_by = UserSerializer()

    class Meta:
        model = Project
        fields = '__all__'


class ActionSerializer(serializers.ModelSerializer):

    expire_at =serializers.DateField(input_formats=settings.DATE_INPUT_FORMATS)
    
    begin_at = serializers.DateField(input_formats=settings.DATE_INPUT_FORMATS)
    accomplish_at = serializers.DateField(input_formats=settings.DATE_INPUT_FORMATS)
    renegotiation_at = serializers.DateField(input_formats=settings.DATE_INPUT_FORMATS)
    report_at = serializers.DateField(input_formats=settings.DATE_INPUT_FORMATS)
    
    class Meta:
        model = Project
        fields = ('id', 'project', 'phase', 'client', 'producer', 'observer', 'clasification',
            'name', 'toDo', 'satisfactions', 'expire_at',
            'begin_at', 'accomplish_at', 'renegotiation_at', 'report_at',
            'financial', 'operational', 'other1', 'other2', 'parent_action')

    read_only_fields =  ('created_at', 'updated_at','create_by',)


class ActionSerializerExtended(serializers.ModelSerializer):

    project = ProjectSerializer()

    client = UserSerializer()
    producer = UserSerializer()
    observer = UserSerializer()
    create_by = UserSerializer()

    parent_action = ActionSerializer(many=True)

    class Meta:
        model = Action
        fields = '__all__'

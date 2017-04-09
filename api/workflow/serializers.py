import base64, uuid

from django.core.files.base import ContentFile
from django.conf import settings

from rest_framework import serializers

from users.serializers import UserSerializer

from .models import Project, Action

 
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

    preparation_at = serializers.DateField(input_formats=settings.DATE_INPUT_FORMATS)
    negotiation_at = serializers.DateField(input_formats=settings.DATE_INPUT_FORMATS)
    execution_at = serializers.DateField(input_formats=settings.DATE_INPUT_FORMATS)
    evaluation_at = serializers.DateField(input_formats=settings.DATE_INPUT_FORMATS)
    
    begin_at = serializers.DateField(input_formats=settings.DATE_INPUT_FORMATS)
    accomplish_at = serializers.DateField(input_formats=settings.DATE_INPUT_FORMATS)
    renegotiation_at = serializers.DateField(input_formats=settings.DATE_INPUT_FORMATS)
    report_at = serializers.DateField(input_formats=settings.DATE_INPUT_FORMATS)
    
    class Meta:
        model  = Project
        fields = ('id','client', 'producer', 'observer', 'name', 'clasification', 'phase',
            'toDo', 'satisfactions', 'preparation_at', 'negotiation_at', 'execution_at',
            'evaluation_at', 'begin_at', 'accomplish_at', 'renegotiation_at', 'report_at',
            'financial', 'operational', 'other1', 'other2', 'image')

    read_only_fields =  ('created_at', 'updated_at','create_by',)


class ProjectGetSerializer(serializers.ModelSerializer):

    client = UserSerializer()
    producer = UserSerializer()
    observer = UserSerializer()

    class Meta:
        model = Project
        fields = '__all__'


class ProjectListSerializer(serializers.ModelSerializer):

    class Meta:
        model  = Project
        fields = (
            'id', 'name', 'clasification', 'phase', 'image',
            'preparation_at', 'negotiation_at', 'execution_at', 'evaluation_at', 
            'begin_at', 'accomplish_at', 'renegotiation_at', 'report_at')


class ActionPostSerializer(serializers.ModelSerializer):

    expire_at =serializers.DateField(input_formats=settings.DATE_INPUT_FORMATS)
    
    begin_at = serializers.DateField(input_formats=settings.DATE_INPUT_FORMATS)
    accomplish_at = serializers.DateField(input_formats=settings.DATE_INPUT_FORMATS)
    renegotiation_at = serializers.DateField(input_formats=settings.DATE_INPUT_FORMATS)
    report_at = serializers.DateField(input_formats=settings.DATE_INPUT_FORMATS)
    
    class Meta:
        model  = Action
        fields = (
            'id', 'project', 'name', 'phase',
            'progress', 'status', 'is_renegotiated',
            'client', 'producer', 'observer',
            'toDo', 'satisfactions', 'expire_at',
            'begin_at', 'accomplish_at', 'renegotiation_at', 'report_at',
            'financial', 'operational', 'other1', 'other2', 'parent_action')

    read_only_fields =  ('created_at', 'updated_at','create_by', 'promise',)


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

    class Meta:
        model  = Action
        fields = (
            'id', 'name', 'producer', 'toDo',
            'begin_at', 'accomplish_at', 'renegotiation_at', 'report_at')


class ActionUserSerializer(serializers.ModelSerializer):

    producer = UserSerializer()

    class Meta:
        model  = Action
        fields = ('producer',)

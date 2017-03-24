import base64, uuid

from django.core.files.base import ContentFile
from django.conf import settings

from rest_framework import serializers

from .models import Project, Action
from users.serializers import UserSerializer

 

class Base64ImageField(serializers.ImageField):
    def to_internal_value(self, data):
        if isinstance(data, str) and data.startswith('data:'): # You can change "data:" to "data/image:"
            format, imgstr = data.split(';base64,')
            ext  = format.split('/')[-1]
            id   = uuid.uuid4()
            data = ContentFile(base64.b64decode(imgstr), name=id.urn[9:])
 
        return super(Base64ImageField, self).to_internal_value(data)



class ProjectSerializer(serializers.ModelSerializer):
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
        model = Project
        fields = ('id','client', 'producer', 'observer', 'name', 'clasification', 'phase',
            'toDo', 'satisfactions', 'preparation_at', 'negotiation_at', 'execution_at',
            'evaluation_at', 'begin_at', 'accomplish_at', 'renegotiation_at', 'report_at',
            'financial', 'operational', 'other1', 'other2', 'image')

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
        model = Action
        fields = ('id', 'project', 'phase', 'client', 'producer', 'observer',
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

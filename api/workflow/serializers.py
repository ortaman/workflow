
from rest_framework import serializers

from .models import Project, Action
from users.serializers import UserSerializer


class ProjectSerializer(serializers.ModelSerializer):
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

    class Meta:
        model = Action
        fields = '__all__'


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

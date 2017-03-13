
from rest_framework import serializers

from .models import Project, Action
from users.serializers import UserSerializer


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'


class ProjectSerializerExtended(serializers.ModelSerializer):

    client = UserSerializer()
    producer = UserSerializer()
    agent = UserSerializer()
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
    agent = UserSerializer()
    create_by = UserSerializer()

    class Meta:
        model = Action
        fields = '__all__'

    def get_fields(self):
        fields = super(ActionSerializerExtended, self).get_fields()
        fields['parent_action'] = ActionSerializer(many=True)
        return fields
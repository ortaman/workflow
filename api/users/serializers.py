
from django.conf import settings

from rest_framework import serializers

from .models import User





class UserSerializer(serializers.ModelSerializer):

    photo = serializers.SerializerMethodField('get_photo_url')

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password',
        	'name', 'first_surname', 'second_surname',  'position', 'photo')

        # read_only_fields =  ('is_staff', 'is_superuser')

        extra_kwargs = {
            'password': {'write_only': True}
        }


class Base64ImageField(serializers.ImageField):
    def to_internal_value(self, data):
        if isinstance(data, str) and data.startswith('data:'): # You can change "data:" to "data/image:"
            format, imgstr = data.split(';base64,')
            ext  = format.split('/')[-1]
            id   = uuid.uuid4()
            data = ContentFile(base64.b64decode(imgstr), name=id.urn[9:])

        return super(Base64ImageField, self).to_internal_value(data)

class UserPostSerializer(serializers.ModelSerializer):

    photo = Base64ImageField(max_length=None, use_url=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password',
        	'name', 'first_surname', 'second_surname',  'position', 'photo')

        # read_only_fields =  ('is_staff', 'is_superuser')

        extra_kwargs = {
            'password': {'write_only': True}
        }

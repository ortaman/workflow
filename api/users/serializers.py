
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

    def get_photo_url(self, obj):
        return obj.photo.url

from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password',
        	'name', 'first_surname', 'second_surname',  'position', 'photo')

        # read_only_fields =  ('is_staff', 'is_superuser')
     
        extra_kwargs = {
            'password': {'write_only': True}
        }

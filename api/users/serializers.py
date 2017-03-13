
from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password','is_active',
        	'name', 'first_surname', 'second_surname')

        # read_only_fields =  ('is_staff', 'is_superuser')
     
        extra_kwargs = {
            'password': {'write_only': True}
        }

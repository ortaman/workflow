
import json

from django.test import TestCase
from rest_framework.test import APIRequestFactory, force_authenticate

from users.models import User
from workflow.views.message import CommentsListViewSet


class MessageWithoutAuthAPITest(TestCase):

    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = CommentsListViewSet.as_view({'post': 'create', 'get': 'list'})

        self.message = json.dumps({"action": 1,"message_json": "crud sin autenticación"})
        self.detail = 'Las credenciales de autenticación no se proveyeron.'

    def test_post_message(self):
        request = self.factory.post(
            path='/api/messages/', data=self.message, content_type='application/json'
        )
        response = self.view(request)

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.data.get('detail'), self.detail)

    def test_put_message(self):
        request = self.factory.put(path='/api/messages/1/', data=self.message, content_type='application/json')
        response = self.view(request)

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.data.get('detail'), self.detail)

    def test_patch_message_without_authentication(self):
        request = self.factory.patch(path='/api/messages/1/', data=self.message, content_type='application/json')
        response = self.view(request)

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.data.get('detail'), self.detail)

    def test_get_message_without_authentication(self):
        request = self.factory.get(path='/api/messages/')
        response = self.view(request)

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.data.get('detail'), self.detail)


class MessageWithAuthAPITest(TestCase):

    fixtures = ['users.json']

    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = CommentsListViewSet.as_view({'post': 'create', 'get': 'list'})

        self.user = User.objects.get(username='admin')
        self.message = json.dumps({"action": 1,"message": "crud con autenticación"})

    def test_post_message_with_null_data(self):
        request = self.factory.post(
            path='/api/messages/', data={}, content_type='application/json'
        )

        force_authenticate(request, user=self.user)
        response = self.view(request)

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['action'][0], 'Este campo es requerido.')
        self.assertEqual(response.data['message'][0], 'Este campo es requerido.')

    def test_post_message_with_invalid_action_id(self):
        request = self.factory.post(
            path='/api/messages/', data=self.message, content_type='application/json'
        )

        force_authenticate(request, user=self.user)
        response = self.view(request)

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['action'][0], 'Clave primaria "1" inválida - objeto no existe.')

    def test_list_messages_with_null_db(self):
        request = self.factory.get(path='/api/messages/')

        force_authenticate(request, user=self.user)
        response = self.view(request)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {'page': 1, 'results': [], 'count': 0, 'paginated_by': 10})

    def test_get_messages_with_null_db(self):
        request = self.factory.get(path='/api/messages/1/')

        force_authenticate(request, user=self.user)
        response = self.view(request)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {'page': 1, 'results': [], 'count': 0, 'paginated_by': 10})

    def test_put_messages_with_null_db(self):
        request = self.factory.put(path='/api/messages/1/')

        force_authenticate(request, user=self.user)
        response = self.view(request)

        self.assertEqual(response.status_code, 405)
        self.assertEqual(response.data, {'detail': 'Método "PUT" no permitido.'})

    def test_patch_messages_with_null_db(self):
        request = self.factory.patch(path='/api/messages/1/')

        force_authenticate(request, user=self.user)
        response = self.view(request)

        self.assertEqual(response.status_code, 405)
        self.assertEqual(response.data, {'detail': 'Método "PATCH" no permitido.'})

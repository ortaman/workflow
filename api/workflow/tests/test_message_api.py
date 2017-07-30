
import json

from django.test import TestCase
from rest_framework.test import APIRequestFactory, force_authenticate

from users.models import User
from workflow.models import Message
from workflow.views.message import CommentsListViewSet


class MessageWithoutAuthAPITest(TestCase):

    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = CommentsListViewSet.as_view({'post': 'create', 'get': 'list'})

        self.message = json.dumps({"action": 1,"message_json": "crud sin autenticación"})
        self.expected = 'Las credenciales de autenticación no se proveyeron.'

    def test_post_message(self):
        request = self.factory.post(
            path='/api/messages/', data=self.message, content_type='application/json'
        )
        response = self.view(request)

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.data.get('detail'), self.expected)

    def test_put_message(self):
        request = self.factory.put(path='/api/messages/1/', data=self.message, content_type='application/json')
        response = self.view(request)

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.data.get('detail'), self.expected)

    def test_patch_message_without_authentication(self):
        request = self.factory.patch(path='/api/messages/1/', data=self.message, content_type='application/json')
        response = self.view(request)

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.data.get('detail'), self.expected)

    def test_get_message_without_authentication(self):
        request = self.factory.get(path='/api/messages/')
        response = self.view(request)

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.data.get('detail'), self.expected)


class MessageWithAuthAPIAndNullDbTest(TestCase):

    fixtures = ['users.json',
                'projects.json']

    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = CommentsListViewSet.as_view({'post': 'create', 'get': 'list'})

        self.user = User.objects.get(username='user2')
        self.message = json.dumps({"action": 1, "message": "crud con autenticación"})

    def test_post_message(self):
        request = self.factory.post(
            path='/api/messages/', data=self.message, content_type='application/json'
        )

        force_authenticate(request, user=self.user)
        response = self.view(request)

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['id'], 1)
        self.assertEqual(response.data['action'], 1)
        self.assertEqual(response.data['message'], 'crud con autenticación')

        response.render()
        self.assertIn('created_at', response.content.decode('utf-8'))

    def test_list_messages(self):
        request = self.factory.get(path='/api/messages/')

        force_authenticate(request, user=self.user)
        response = self.view(request)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {'page': 1, 'results': [], 'count': 0, 'paginated_by': 10})

    def test_get_messages(self):
        request = self.factory.get(path='/api/messages/1/')

        force_authenticate(request, user=self.user)
        response = self.view(request)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {'page': 1, 'results': [], 'count': 0, 'paginated_by': 10})

    def test_put_messages(self):
        request = self.factory.put(path='/api/messages/1/')

        force_authenticate(request, user=self.user)
        response = self.view(request)

        self.assertEqual(response.status_code, 405)
        self.assertEqual(response.data, {'detail': 'Método "PUT" no permitido.'})

    def test_patch_messages(self):
        request = self.factory.patch(path='/api/messages/1/')

        force_authenticate(request, user=self.user)
        response = self.view(request)

        self.assertEqual(response.status_code, 405)
        self.assertEqual(response.data, {'detail': 'Método "PATCH" no permitido.'})


class MessageWithAuthAPITest(TestCase):

    fixtures = ['users.json',
                'projects.json',
                'messages.json']

    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = CommentsListViewSet.as_view({'post': 'create', 'get': 'list'})

        self.user = User.objects.get(username='user2')
        self.message = json.dumps({"action": 1,"message": u"crud con autenticación"})

    def test_post_message(self):
        request = self.factory.post(
            path='/api/messages/', data=self.message, content_type='application/json'
        )

        force_authenticate(request, user=self.user)
        response = self.view(request)

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['id'], 11)
        self.assertEqual(response.data['action'], 1)
        self.assertEqual(response.data['message'], 'crud con autenticación')

        response.render()
        self.assertIn('id', response.content.decode('utf-8'))
        self.assertIn('created_at', response.content.decode('utf-8'))


    def test_post_message_with_empty_data(self):
        request = self.factory.post(
            path='/api/messages/', data={}, content_type='application/json'
        )

        force_authenticate(request, user=self.user)
        response = self.view(request)

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data, {'action': ['Este campo es requerido.'], 'message': ['Este campo es requerido.']})

    def test_post_message_with_invalid_action_id(self):
        self.message = json.dumps({"action": 1234,"message": "crud con autenticación"})

        request = self.factory.post(
            path='/api/messages/', data=self.message, content_type='application/json'
        )

        force_authenticate(request, user=self.user)
        response = self.view(request)

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data, {'action': ['Clave primaria "1234" inválida - objeto no existe.']})

    def test_list_messages(self):
        request = self.factory.get(path='/api/messages/?action_id=1')

        force_authenticate(request, user=self.user)
        response = self.view(request)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['page'], 1)
        self.assertIsInstance(response.data['results'], list)
        self.assertIsInstance(response.data['results'][0], dict)
        self.assertEqual(response.data['count'], Message.objects.filter(action_id=1).count())
        self.assertEqual(response.data['paginated_by'], 10)

        response.render()
        self.assertIn('id', response.content.decode('utf-8'))


import json

from django.test import TestCase
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient

from users.models import User
from workflow.models import Alert


class AlertWithoutAuthAPITest(TestCase):

    def setUp(self):
        self.client = APIClient()

        self.alert = json.dumps({"action": 1, "alert": "crud sin autenticación"})
        self.expected = '{"detail":"Las credenciales de autenticación no se proveyeron."}'

    def test_post(self):
        response = self.client.post(path='http://localhost:9000/api/alerts/', json=self.alert)

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.content.decode(), self.expected)

    def test_get(self):
        response = self.client.get(path='http://localhost:9000/api/alerts/')

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.content.decode(), self.expected)

    def test_get_by_id(self):
        response = self.client.get(path='http://localhost:9000/api/alerts/1/')

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.content.decode(), self.expected)

    def test_put(self):
        response = self.client.put(path='http://localhost:9000/api/alerts/1/', json=self.alert)

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.content.decode(), self.expected)

    def test_patch(self):
        response = self.client.patch(path='http://localhost:9000/api/alerts/1/', json='{"viewed":"True"}')

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.content.decode(), self.expected)


class AlertWitAuthAPITest(TestCase):

    fixtures = ['users.json',
                'projects.json',
                'alerts.json']

    def setUp(self):
        self.client = APIClient()

        self.user = User.objects.get(username='user3')
        # self.client.force_authenticate(user=self.user)
        token = Token.objects.get(user__username='user3')
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)

        self.alert = json.dumps({"action": 1, "alert": "crud con autenticación"})

    def test_post(self):
        response = self.client.post(path='http://localhost:9000/api/alerts/')

        self.assertEqual(response.status_code, 405)
        self.assertEqual(response.data, {'detail': 'Método "POST" no permitido.'})

    def test_get(self):
        response = self.client.get(path='http://localhost:9000/api/alerts/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['page'], 1)
        self.assertIsInstance(response.data['results'], list)
        self.assertIsInstance(response.data['results'][0], dict)
        self.assertEqual(response.data['count'], Alert.objects.filter(action__producer_id=self.user.id).count())
        self.assertEqual(response.data['paginated_by'], 10)

    def test_get_by_id(self):
        response = self.client.get(path='http://localhost:9000/api/alerts/1/')

        self.assertEqual(response.status_code, 405)
        self.assertEqual(response.data, {'detail': 'Método "GET" no permitido.'})

    def test_put(self):
        response = self.client.put(path='http://localhost:9000/api/alerts/1/', json=self.alert)

        self.assertEqual(response.status_code, 405)
        self.assertEqual(response.data, {'detail': 'Método "PUT" no permitido.'})

    def test_patch(self):
        response = self.client.patch(
            path='http://localhost:9000/api/alerts/1/',
            data=json.dumps({"viewed": True}),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {'viewed': True})


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
        '''
        Get the the alerts list paginated
        '''
        response = self.client.get(path='http://localhost:9000/api/alerts/')

        self.assertEqual(response.status_code, 200)

        self.assertEqual(response.data['page'], 1)
        self.assertEqual(response.data['count'], Alert.objects.filter(action__producer_id=self.user.id).count())
        self.assertEqual(response.data['paginated_by'], 10)

        self.assertIsInstance(response.data['results'], list)
        self.assertEqual(
            response.data['results'][0],
            {
                'id': 1,
                'kind': '',
                'message': 'alerta 1',
                'viewed': False,
                'created_at': '2011-11-11T00:00:00Z',
                'action': {
                    'parent_action': None, 'phase': 'Preparación',
                    'accomplish_at': '2017-04-01', 'report_at': '2017-03-15', 'preparation_at': '2017-02-01',
                    'evaluation_at': '2017-05-01', 'begin_at': '2017-01-01', 'advance_report_at': None,
                    'project': None, 'id': 1, 'negotiation_at': '2017-03-01',

                    'client': {
                        'id': 2, 'username': 'user2', 'email': 'user2@email.com',
                        'name': 'Terry2',  'first_surname': 'Boward2', 'second_surname': 'Garcia2',
                        'cel_phone': '2222222222', 'photo': 'api/media/api/media/photos/perfil-2.png',
                        'position': 'Coordinador'
                    },

                    'producer': {
                         'id': 3, 'username': 'user3', 'email': 'user3@email.com',
                         'name': 'Terry3', 'first_surname': 'Boward3', 'second_surname': 'Garcia3',
                         'cel_phone': '33333333333', 'photo': 'api/media/api/media/photos/perfil-3.png',
                         'position': 'Coordinadora de comunicación comercial/ventas',
                    },
                    'name': 'Proyecto I', 'kind': 'Estándar', 'status': 'Pendiente',
                    'execution_at': '2017-04-01', 'renegotiation_at': None,
                    'accepted_at': None, 'qualified_at': None, 'ejecution_report_at': None,
                    'reports': [],
                    'image': 'http://testserver/api/alerts/api/media/api/media/images/image1.png',
                    'created_at': '2017-01-01',
                },
            }
        )

    def test_get_by_id(self):
        response = self.client.get(path='http://localhost:9000/api/alerts/1/')

        self.assertEqual(response.status_code, 405)
        self.assertEqual(response.data, {'detail': 'Método "GET" no permitido.'})

    def test_put(self):
        response = self.client.put(path='http://localhost:9000/api/alerts/1/', json=self.alert)

        self.assertEqual(response.status_code, 405)
        self.assertEqual(response.data, {'detail': 'Método "PUT" no permitido.'})

    def test_patch(self):
        '''
        Alert partial update only viewed field.
        '''
        response = self.client.patch(
            path='http://localhost:9000/api/alerts/1/',
            data=json.dumps({"viewed": True}),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {'viewed': True})

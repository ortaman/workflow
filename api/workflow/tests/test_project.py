
import io
import json

from PIL import Image

from django.test import TestCase
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient

from workflow.models import Action


class ProjectWithoutAuthAPITest(TestCase):

    def setUp(self):
        self.client = APIClient()

        self.project = json.dumps({})
        self.expected = '{"detail":"Las credenciales de autenticación no se proveyeron."}'

    def test_post(self):
        response = self.client.post(path='http://localhost:9000/api/projects/', json=self.project)

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.content.decode(), self.expected)

    def test_get(self):
        response = self.client.get(path='http://localhost:9000/api/projects/')

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.content.decode(), self.expected)

    def test_get_by_id(self):
        response = self.client.get(path='http://localhost:9000/api/projects/1/')

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.content.decode(), self.expected)

    def test_put(self):
        response = self.client.put(path='http://localhost:9000/api/projects/1/', json=self.project)

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.content.decode(), self.expected)

    def test_patch(self):
        response = self.client.patch(path='http://localhost:9000/api/projects/1/', json='{"viewed":"True"}')

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.content.decode(), self.expected)


class MessageWithAuthAPIAndNullDbTest(TestCase):

    fixtures = [
        'users.json',
        # 'projects.json',
        # 'alerts.json',
        # 'messages.json'
    ]

    def generate_image_file(self):

        file = io.BytesIO()

        image = Image.new('RGBA', size=(100, 100), color=(155, 0, 0))
        image.save(file, 'png')

        file.name = 'test_image_1.png'
        file.seek(0)

        return file

    def setUp(self):

        token = Token.objects.get(user__username='user2')

        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)

        self.new_project = {
            "name": "Proyecto X",
            "kind": "Estándar",
            "phase": "Preparación",
            "status": "Pendiente",

            "client": 2,
            "producer": 3,
            "observer": 4,

            "toDo": "Por hacer X",
            "satisfactions": "Satisfacciones X",

            "preparation_at": "2017-02-03",
            # "negotiation_at": None,
            "execution_at": "2017-04-03",
            "evaluation_at": "2017-05-03",

            "begin_at": "2017-01-03",
            "report_at": "2017-04-25",
            "accomplish_at": "2017-04-03",

            "financial": "financial X",
            "operational": "operational X",
            "other1": "other X-I",
            "other2": "other X-II",

            "image": self.generate_image_file(),

            "created_at": "2017-01-03"
        }

    def test_project_post(self):

        response = self.client.post(
            path='/api/projects/',
            data=self.new_project,
            # content_type='application/json'
        )

        self.assertEqual(response.status_code, 201)

        image_url = Action.objects.get(name='Proyecto X').image.name

        self.assertEqual(
            response.data,
            {
                'name': 'Proyecto X',
                'kind': 'Estándar',
                'phase': 'Preparación',

                'client': 2,
                'producer': 3,
                'observer': 4,

                'toDo': 'Por hacer X',
                'satisfactions': 'Satisfacciones X',

                'preparation_at': '2017-02-03',
                'negotiation_at': None,
                'execution_at': '2017-04-03',
                'evaluation_at': '2017-05-03',

                'begin_at': '2017-01-03',
                'report_at': '2017-04-25',
                'accomplish_at': '2017-04-03',
                'renegotiation_at': None,

                'advance_report_at': None,
                'ejecution_report_at': None,

                'financial': 'financial X',
                'operational': 'operational X', 'phase': 'Preparación',
                'other1': 'other X-I',
                'other2': 'other X-II',

                'image': "api/media/" + image_url
            }
        )

        # response.render()
        # self.assertIn('created_at', response.content.decode('utf-8'))

    def test_projects_list(self):
        response = self.client.get(path='/api/projects/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {'page': None, 'results': [], 'count': Total, 'paginate_by': None})

    def test_projects_get_by_id(self):
        response = self.client.get(path='/api/projects/1/')

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data, {'detail': 'No encontrado.'})

    def test_put_messages(self):
        response = self.client.get(path='/api/projects/1/')

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data, {'detail': 'No encontrado.'})

    def test_project_patch(self):
        response = self.client.get(path='/api/projects/1/')

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data, {'detail': 'No encontrado.'})

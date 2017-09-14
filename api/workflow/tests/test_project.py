
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

    def test_delete(self):
        response = self.client.delete(path='http://localhost:9000/api/projects/1/', json='{"viewed":"True"}')

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.content.decode(), self.expected)


class ProjectWithAuthAPIAndNullDbTest(TestCase):

    fixtures = [
        'users.json',
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

    def test_get_all_projects_no_paginated(self):
        # url without query param page
        response = self.client.get(path='/api/projects/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])
        self.assertEqual(response.data, {'page': 'all', 'results': [], 'count': 'all', 'paginate_by': None})

    def test_get_all_projects_paginated(self):
        # url with query param page
        response = self.client.get(path='/api/projects/?page=1')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {'page': '1', 'results': [], 'count': 0, 'paginate_by': 6})

    def test_get_projects_with_filter_by_phase(self):
        response = self.client.get(path='/api/projects/?phase=Preparación&page=1')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {'page': '1', 'results': [], 'count': 0, 'paginate_by': 6})

    def test_get_projects_with_filter_by_client_id(self):
        response = self.client.get(path='/api/projects/?client_id=1&page=1')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {'page': '1', 'results': [], 'count': 0, 'paginate_by': 6})

    def test_get_project_by_id(self):
        response = self.client.get(path='/api/projects/1/')

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data, {'detail': 'No encontrado.'})

    def test_put_project(self):
        response = self.client.get(path='/api/projects/1/')

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data, {'detail': 'No encontrado.'})

    def test_patch_project(self):
        response = self.client.get(path='/api/projects/1/')

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data, {'detail': 'No encontrado.'})

    def test_delete_project(self):
        response = self.client.delete(path='/api/projects/')

        self.assertEqual(response.status_code, 405)
        self.assertEqual(response.data, {'detail': 'Método "DELETE" no permitido.'})


class ProjectWithAuthAPIAndNullDbTest(TestCase):

    fixtures = [
        'users.json',
        'projects.json',
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

    def test_get_all_projects_no_paginated(self):
        # url without query param page
        response = self.client.get(path='/api/projects/')

        self.assertEqual(response.status_code, 200)

        # from json import loads, dumps
        # d = loads(dumps(response.data))

        self.assertEqual(
            response.data[0],
            {
                'id': 1, 'name': 'Proyecto I', 'kind': 'Estándar', 'phase': 'Preparación', 'status': 'Pendiente',
                'client': {
                    'id': 2, 'username': 'user2', 'email': 'user2@email.com',
                    'name': 'Terry2', 'first_surname': 'Boward2', 'second_surname': 'Garcia2',
                    'position': 'Coordinador', 'cel_phone': '2222222222',
                    'photo': 'api/media/api/media/photos/perfil-2.png'
                },
                'producer': {
                    'cel_phone': '33333333333', 'id': 3, 'username': 'user3', 'email': 'user3@email.com',
                    'name': 'Terry3', 'first_surname': 'Boward3', 'second_surname': 'Garcia3',
                    'position': 'Coordinadora de comunicación comercial/ventas',
                    'photo': 'api/media/api/media/photos/perfil-3.png',
                },
                'begin_at': '2017-01-01', 'accomplish_at': '2017-04-01',
                'preparation_at': '2017-02-01', 'execution_at': '2017-04-01',
                'report_at': '2017-03-15', 'evaluation_at': '2017-05-01',
                'accepted_at': None, 'advance_report_at': None, 'qualified_at': None,
                'negotiation_at': '2017-03-01',
                'renegotiation_at': None, 'ejecution_report_at': None,
                'reports': [], 'image': 'api/media/api/media/images/image1.png', 'created_at': '2017-01-01',
            }
        )

    def test_get_all_projects_paginated(self):
        # url with query param page
        response = self.client.get(path='/api/projects/?page=1')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['page'], '1')
        self.assertEqual(response.data['paginate_by'], 6)
        self.assertEqual(response.data['count'], 2)
        self.assertEqual(len(response.data['results']), 2)

    def test_get_projects_with_filter_by_phase(self):
        response = self.client.get(path='/api/projects/?phase=Preparación&page=1')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['page'], '1')
        self.assertEqual(response.data['paginate_by'], 6)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['id'], 1 )
        self.assertEqual(len(response.data['results']), 1)

        response = self.client.get(path='/api/projects/?phase=Ejecución&page=1')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['id'], 2)

    def test_get_projects_with_filter_by_client_id_and_status(self):
        response = self.client.get(path='/api/projects/?client_id=2&status=Pendiente&page=1')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['page'], '1')
        self.assertEqual(response.data['paginate_by'], 6)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['id'], 1)
        self.assertEqual(len(response.data['results']), 1)

        response = self.client.get(path='/api/projects/?client_id=5&status=Pendiente&page=1')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['results'][0]['id'], 2)
        self.assertEqual(len(response.data['results']), 1)
    '''
    def test_get_project_by_id(self):
        response = self.client.get(path='/api/projects/1/')
        self.assertEqual(response.status_code, 200)

    def test_put_project(self):
        response = self.client.get(path='/api/projects/1/')

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data, {'detail': 'No encontrado.'})

    '''
    def test_patch_project(self):

        partial_data = {
            'phase': 'Ejecución',
            'status': 'Aceptada',
            'accepted_at': '2017-01-01',
            'qualified_at': '2017-04-01',
        }
        response = self.client.patch(path='/api/projects/1/', data=partial_data)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.data,
            {
                'accepted_at': '2017-01-01',
                'qualified_at': '2017-04-01',
                'phase': 'Ejecución',
                'status': 'Aceptada'
            }
         )

    def test_delete_project(self):
        response = self.client.delete(path='/api/projects/')

        self.assertEqual(response.status_code, 405)
        self.assertEqual(response.data, {'detail': 'Método "DELETE" no permitido.'})


from django.test import TestCase
from django.forms.models import model_to_dict
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient

from workflow.models import Alert


class AlertsTaskTest(TestCase):
    '''
        Deadlines for Proyect I
        "report_at": "2017-03-15",
        "accomplish_at": "2017-04-01",

        Deadlines for Proyect II
        "report_at": "2017-03-16",
        "accomplish_at": "2017-04-02",
    '''

    fixtures = [
        'users.json',
        'projects.json',
    ]

    def setUp(self):
        token = Token.objects.get(user__username='user2')

        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)

    def test_alet_report_two_days_before_of_the_report_at_date(self):

        response = self.client.get(path='/api/tasks/alerts/?post_date=2017-03-13')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.data, {
            'status': 'Alerts worker triggered successfully for date 2017-03-13' }
        )

        alert = Alert.objects.all().first()

        self.assertEqual(
            model_to_dict(alert), {
            'id': 1,
            'action': 1,
            'kind': 'Before',
            'message': '"Proyecto I": La fecha del reporte de avance expira en 2 días.',
            'viewed': False }
        )

    def test_alet_report_two_days_before_of_the_accomplish_at_date(self):

        response = self.client.get(path='/api/tasks/alerts/?post_date=2017-03-30')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.data, {
            'status': 'Alerts worker triggered successfully for date 2017-03-30' }
        )

        alert = Alert.objects.all().first()

        self.assertEqual(
            model_to_dict(alert),
            {
                'id': 1,
                'action': 1,
                'kind': 'Before',
                'message': '"Proyecto I": La fecha del reporte de ejecución expira en 2 días.',
                'viewed': False
            }
        )

    def test_alert_deadline_report_at(self):

        response = self.client.get(path='/api/tasks/alerts/?post_date=2017-03-15')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.data,
            {
                'status': 'Alerts worker triggered successfully for date 2017-03-15'
            }
        )

        alert = Alert.objects.all().first()

        self.assertEqual(
            model_to_dict(alert),
            {
                'id': 1,
                'action': 1,
                'kind': 'Deadline',
                'message': '"Proyecto I": La fecha límite del reporte de avance es el día de hoy.',
                'viewed': False
            }
        )

    def test_alert_deadline_accomplish_at(self):

        response = self.client.get(path='/api/tasks/alerts/?post_date=2017-04-01')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.data,
            {
                'status': 'Alerts worker triggered successfully for date 2017-04-01'
            }
        )

        alert = Alert.objects.all().first()

        self.assertEqual(
            model_to_dict(alert),
            {
                'id': 1,
                'action': 1,
                'kind': 'Deadline',
                'message': '"Proyecto I": La fecha límite del reporte de ejecución es el día de hoy.',
                'viewed': False
            }
        )

    def test_alert_deadline_accomplish_at(self):

        response = self.client.get(path='/api/tasks/alerts/?post_date=2017-04-01')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.data,
            {
                'status': 'Alerts worker triggered successfully for date 2017-04-01'
            }
        )

        alert = Alert.objects.all().first()

        self.assertEqual(
            model_to_dict(alert),
            {
                'id': 1,
                'action': 1,
                'kind': 'Deadline',
                'message': '"Proyecto I": La fecha límite del reporte de ejecución es el día de hoy.',
                'viewed': False
            }
        )

    def test_alert_expiration_report_at(self):

        response = self.client.get(path='/api/tasks/alerts/?post_date=2017-03-16')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.data,
            {
                'status': 'Alerts worker triggered successfully for date 2017-03-16'
            }
        )

        # Proyecto I expiration
        alert = Alert.objects.filter(action__name="Proyecto I").first()

        self.assertEqual(
            model_to_dict(alert),
            {
                'id': 2,
                'action': 1,
                'kind': 'After',
                'message': '"Proyecto I": La fecha del reporte de avance ha expirado.',
                'viewed': False
            }
        )

        # Proyecto II deadline
        alert = Alert.objects.filter(action__name="Proyecto II").first()

        self.assertEqual(
            model_to_dict(alert),
            {
                'id': 1,
                'action': 2,
                'kind': 'Deadline',
                'message': '"Proyecto II": La fecha límite del reporte de avance es el día de hoy.',
                'viewed': False
            }
        )

    def test_alert_expiration_accomplish_at(self):

        response = self.client.get(path='/api/tasks/alerts/?post_date=2017-04-02')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.data,
            {
                'status': 'Alerts worker triggered successfully for date 2017-04-02'
            }
        )

        # Proyecto I expiration
        alert = Alert.objects.filter(action__name="Proyecto I").first()

        self.assertEqual(
            model_to_dict(alert),
            {
                'id': 2,
                'action': 1,
                'kind': 'After',
                'message': '"Proyecto I": La fecha del reporte de ejecución ha expirado.',
                'viewed': False
            }
        )

        # Proyecto II deadline
        alert = Alert.objects.filter(action__name="Proyecto II").first()

        self.assertEqual(
            model_to_dict(alert),
            {
                'id': 1,
                'action': 2,
                'kind': 'Deadline',
                'message': '"Proyecto II": La fecha límite del reporte de ejecución es el día de hoy.',
                'viewed': False
            }
        )

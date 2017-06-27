from .base import *
from _api.keys import development


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.10/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'r_*g$kn#f8g4ex@vp^%3!pu$gwo#bs%t3&k4g*-0csvjr-b*^6'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# Database
# https://docs.djangoproject.com/en/1.10/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'vagrantdb1',
        'USER': 'vagrant',
        'PASSWORD': 'vagrant',
        'HOST': 'localhost',
        'PORT': '',
        'CONN_MAX_AGE': 600,
    }
}

INSTALLED_APPS += [
    'django_extensions',
    'debug_toolbar',
    'corsheaders',
]

MIDDLEWARE += [
    # debug-toolbar
    'debug_toolbar.middleware.DebugToolbarMiddleware',

    # django-cors-headers
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
]

# ***** DEBUG-TOOLBAR SETTINGS ***** #
# This IP addresses ensure debug toolbar shows development environment
INTERNAL_IPS = ('127.0.0.1', '10.0.2.2')

# ***** DEBUG-CORS-HEADERS SETTINGS ***** #
# CORS_ORIGIN_WHITELIST = ()
CORS_ORIGIN_WHITELIST = (
    'localhost:8000',
    'localhost:8080',
    'localhost:9000',
    'localhost:9090',
)

# Email configuration
EMAIL_USE_TLS = True
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = 'medix@t4action.com'
EMAIL_HOST_PASSWORD = 'actionworflow'
EMAIL_PORT = 587

# ***** CELERY SETTINGS ***** #
# CELERY_RESULT_BACKEND = 'django-db'
# CELERY_RESULT_BACKEND = 'django-cache'

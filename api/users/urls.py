
from django.conf.urls import url, include

from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.routers import DefaultRouter

from users import views


# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'users', views.UserViewSet)


urlpatterns = [
    url(r'^token-auth/', obtain_auth_token),
    
    url(r'^', include(router.urls)),
    
    url(r'^myuser/$', views.MyUser.as_view()),
]

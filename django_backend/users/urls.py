from django.urls import path
from .views import list_users
from . import views

urlpatterns = [
    path('list/', list_users, name='list_users'),
    path('admin/', views.admin_login, name='admin-login'),
]
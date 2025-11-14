from django.urls import path, include
from .views import list_users
from django.contrib import admin

urlpatterns = [
    path('list/', list_users, name='list_users'),
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),
]
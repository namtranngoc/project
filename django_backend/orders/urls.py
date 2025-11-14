from django.urls import path
from .views import list_orders

urlpatterns = [
    path('list/', list_orders, name='list_orders'),
]

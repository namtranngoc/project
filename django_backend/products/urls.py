# project/django_backend/products/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet  # Import Class ProductViewSet

# Tạo router riêng cho app này
router = DefaultRouter()
router.register(r'', ProductViewSet, basename='product') # Đăng ký /products/

urlpatterns = [
    # Gắn router vào
    path('', include(router.urls)),
]
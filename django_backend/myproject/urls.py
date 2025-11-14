from django.contrib import admin
from django.urls import path, include
from orders.views import OrderAdminViewSet
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'orders/admin', OrderAdminViewSet, basename='admin-orders')

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),

    # Djoser authentication
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.jwt')),

    # API router
    path('api/', include(router.urls)),

    # App URLs
    path('products/', include('products.urls')),
    path('orders/', include('orders.urls')),
    path('users/', include('users.urls')),
]

# Media files in DEBUG
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

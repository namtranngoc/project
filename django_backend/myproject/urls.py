from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter 

# Import các ViewSet của bạn
from orders.views import OrderAdminViewSet
from products.views import ProductViewSet 

# Tạo một Router (bộ định tuyến)
router = DefaultRouter()
# Đăng ký ViewSet đơn hàng (API: /api/orders/admin/)
router.register(r'orders/admin', OrderAdminViewSet, basename='admin-orders')
# Đăng ký ViewSet sản phẩm (API: /api/products/)
router.register(r'products', ProductViewSet, basename='product') 

# Đây là tất cả các đường dẫn của bạn
urlpatterns = [
    path('admin/', admin.site.urls),
    
    # URL cho Đăng nhập/Đăng ký (Djoser)
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.jwt')), # Dùng 'Bearer' token
    
    # URL cho Đơn hàng và Sản phẩm (từ router ở trên)
    path('api/', include(router.urls)), 
]
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static

# Import các ViewSet (lớp xử lý) của bạn
from orders.views import OrderAdminViewSet
from products.views import ProductViewSet 

# 1. Tạo một Router (bộ định tuyến)
router = DefaultRouter()

# 2. Đăng ký các ViewSet vào Router
# Tạo link: /api/orders/admin/
router.register(r'orders/admin', OrderAdminViewSet, basename='admin-orders')
# Tạo link: /api/products/
router.register(r'products', ProductViewSet, basename='product') 

# 3. Tạo danh sách URL chính
urlpatterns = [
    # Link cho trang Admin gốc của Django
    path('admin/', admin.site.urls),
    
    # Link cho Đăng nhập/Đăng ký (Djoser)
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.jwt')), 
    
    # Link cho API (Orders và Products) đã đăng ký ở trên
    path('api/', include(router.urls)), 
]

# 4. Cấu hình để hiển thị ảnh (khi ở chế độ DEBUG=True)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
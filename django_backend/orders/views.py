from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser # Chỉ Admin mới được phép
from .models import Order
from .serializers import OrderSerializer

class OrderAdminViewSet(viewsets.ModelViewSet):
    # Admin có thể xem, tạo, sửa, xóa
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    # BẮT BUỘC: Chỉ user có is_staff=True mới được gọi API này
    permission_classes = [IsAdminUser]
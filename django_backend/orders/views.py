from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from .models import Order
from .serializers import OrderSerializer

# ViewSet này DÀNH CHO ADMIN (Quản lý tất cả đơn hàng)
class OrderAdminViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAdminUser] # Chỉ Admin

# --- THÊM CLASS MỚI NÀY VÀO ---
# ViewSet này DÀNH CHO USER (Chỉ quản lý đơn của mình)
class OrderUserViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated] # Bắt buộc đăng nhập

    # GET: Chỉ trả về đơn hàng CỦA TÔI
    def get_queryset(self):
        # Lọc các đơn hàng chỉ thuộc về user đang đăng nhập
        return Order.objects.filter(user=self.request.user)

    # POST: Khi tạo đơn, tự động gán user và status
    def perform_create(self, serializer):
        # Tự động gán user=người đang đăng nhập, và status='pending'
        serializer.save(user=self.request.user, status='pending')
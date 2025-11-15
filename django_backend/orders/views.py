from rest_framework import viewsets, status
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Order
from .serializers import OrderSerializer
from django.core.mail import send_mail 
from django.conf import settings 


# ViewSet này DÀNH CHO ADMIN (Quản lý tất cả đơn hàng)
class OrderAdminViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAdminUser] # Chỉ Admin

# ViewSet này DÀNH CHO USER (Chỉ quản lý đơn của mình)
class OrderUserViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    
    # 1. API HỦY ĐƠN (PATCH /orders/{id}/cancel/)
    @action(detail=True, methods=['patch']) 
    def cancel(self, request, pk=None):
        order = self.get_object() 
        
        # Kiểm tra trạng thái: chỉ cho huỷ nếu đang chờ xử lý
        if order.status == 'pending':
            order.status = 'cancelled'
            order.save()
            return Response({'status': 'Đã huỷ đơn hàng thành công.'}, status=status.HTTP_200_OK)
        
        # Nếu không phải trạng thái pending
        return Response({'detail': 'Chỉ có thể huỷ đơn hàng đang chờ xử lý.'}, status=status.HTTP_400_BAD_REQUEST)

    # 2. Lấy danh sách đơn hàng của riêng user này (GET /orders/)
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    # 3. Gán user và gửi mail khi tạo đơn hàng (POST /orders/)
    def perform_create(self, serializer):
        # Lưu đơn hàng và gán user
        order = serializer.save(user=self.request.user, status='pending')
        
        # --- LOGIC GỬI EMAIL (PHẦN NÀY LÀ MỤC ĐÍCH GÂY RA LỖI) ---
        subject = f'Xác nhận đơn hàng #{order.id} của Real Madrid Shop'
        user_email = self.request.user.email
        total_formatted = f"{order.total_amount:,.0f} VND"
        
        message = (
            f"Xin chào {self.request.user.first_name or self.request.user.username},\n\n"
            f"Đơn hàng của bạn đã được tiếp nhận thành công.\n"
            f"Mã đơn hàng: #{order.id}\n"
            f"Tổng thanh toán: {total_formatted}\n"
            f"Địa chỉ nhận hàng: {order.shipping_address}\n\n"
            f"Cảm ơn bạn đã mua hàng!\n"
            f"Real Madrid Shop"
        )
        
        try:
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL, 
                [user_email], 
                fail_silently=False,
            )
        except Exception as e:
            # Dù gửi email lỗi, vẫn không hủy đơn hàng
            print(f"ERROR: Failed to send email for Order #{order.id}. Error: {e}")
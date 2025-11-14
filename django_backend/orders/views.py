from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser # Chỉ Admin mới được phép
from .models import Order
from .serializers import OrderSerializer
from django.http import JsonResponse

class OrderAdminViewSet(viewsets.ModelViewSet):
    # Admin có thể xem, tạo, sửa, xóa
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    # BẮT BUỘC: Chỉ user có is_staff=True mới được gọi API này
    permission_classes = [IsAdminUser]




def list_orders(request):
    orders = Order.objects.select_related('user').all()
    data = []
    for o in orders:
        data.append({
            'id': o.id,
            'user': o.user.username,
            'created_at': o.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            'total_price': str(o.total_price),
            'status': o.status
        })
    return JsonResponse(data, safe=False)

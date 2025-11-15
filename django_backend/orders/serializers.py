from rest_framework import serializers
from .models import Order

class OrderSerializer(serializers.ModelSerializer):
    # Hiển thị tên user thay vì ID
    user_username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'user_username', 'order_date', 
            'total_amount', 'status', 'shipping_address', 
            'phone_number', 'cart_snapshot'
        ]
        
        # Khi User đặt hàng (POST), họ chỉ cần gửi 3 trường này
        # Server sẽ tự điền các trường còn lại (user, status, date)
        read_only_fields = ['id', 'user', 'user_username', 'order_date', 'status']
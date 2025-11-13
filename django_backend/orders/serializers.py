# django_backend/orders/serializers.py

from rest_framework import serializers
from .models import Order

class OrderSerializer(serializers.ModelSerializer):
    # Hiển thị tên user để Admin dễ đọc
    user_username = serializers.ReadOnlyField(source='user.username') 
    
    class Meta:
        model = Order
        fields = ['id', 'user', 'user_username', 'order_date', 'total_amount', 'status', 'is_completed']
        read_only_fields = ['user', 'order_date']
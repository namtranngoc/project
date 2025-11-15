from django.db import models
from users.models import User

class Order(models.Model):
    # Thông tin cơ bản
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    order_date = models.DateTimeField(auto_now_add=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    is_completed = models.BooleanField(default=False)
    
    # Trạng thái (đúng như bạn yêu cầu)
    STATUS_CHOICES = (
        ('pending', 'Đang chờ xử lý'),
        ('shipped', 'Đã vận chuyển'),
        ('delivered', 'Đã giao hàng'),
        ('cancelled', 'Đã hủy')
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    # Thông tin giao hàng (mới)
    shipping_address = models.CharField(max_length=255, default='')
    phone_number = models.CharField(max_length=20, default='')
    
    # Lưu lại giỏ hàng (dạng JSON, mới)
    cart_snapshot = models.JSONField(null=True, blank=True)

    class Meta:
        ordering = ['-order_date']
        verbose_name = "Đơn hàng"
        verbose_name_plural = "Đơn hàng"

    def __str__(self):
        return f"Order #{self.id} - {self.user.username}"
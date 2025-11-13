from django.db import models
from users.models import User # Giả sử User là người đặt hàng

class Order(models.Model):
    # Lấy thông tin user (người đặt hàng) từ app users
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    # Thông tin đơn hàng
    order_date = models.DateTimeField(auto_now_add=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    is_completed = models.BooleanField(default=False)
    
    # Trạng thái (Ví dụ)
    STATUS_CHOICES = (
        ('pending', 'Đang chờ xử lý'),
        ('shipped', 'Đã vận chuyển'),
        ('delivered', 'Đã giao hàng'),
        ('cancelled', 'Đã hủy')
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    class Meta:
        ordering = ['-order_date'] # Sắp xếp đơn hàng mới nhất lên đầu
        verbose_name = "Đơn hàng"
        verbose_name_plural = "Đơn hàng"

    def __str__(self):
        return f"Order #{self.id} - {self.user.username}"
    
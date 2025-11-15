from django.contrib import admin
from .models import Product

# Chúng ta tạo một lớp tùy chỉnh để điều khiển cách nó hiển thị
class ProductAdmin(admin.ModelAdmin):
    # Hiển thị các cột này trong danh sách
    list_display = ('id', 'name', 'price', 'stock')
    
    # Các trường được phép chỉnh sửa (thêm 'description' vào đây)
    fields = ('name', 'price', 'description', 'image_url', 'stock')
    
    # Thêm thanh tìm kiếm
    search_fields = ('name', 'description')

# Đăng ký Product với lớp tùy chỉnh ProductAdmin
admin.site.register(Product, ProductAdmin)
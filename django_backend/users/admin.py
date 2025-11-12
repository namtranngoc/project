# Register your models here.
from django.contrib import admin
from .models import User  # Import model 'User' của bạn

# Đăng ký model User với trang admin
admin.site.register(User)
print(User)
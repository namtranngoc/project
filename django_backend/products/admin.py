from django.contrib import admin
from .models import Product

# Dòng này sẽ bảo Django "Hãy hiển thị model Product trong trang admin"
admin.site.register(Product)
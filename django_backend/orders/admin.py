from django.contrib import admin
from .models import Order

# Dòng này bảo Django "Hãy hiển thị model Order trong trang admin"
admin.site.register(Order)
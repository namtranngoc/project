from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser, AllowAny
from .models import Product
from .serializers import ProductSerializer  # <--- Sửa: Phải import ProductSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    # Phân quyền: Ai cũng được XEM, chỉ Admin mới được SỬA/XÓA
    def get_permissions(self):
        if self.action == 'list' or self.action == 'retrieve':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]
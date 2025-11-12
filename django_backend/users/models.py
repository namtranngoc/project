from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    pass
    # Bạn có thể thêm các trường tùy chỉnh ở đây sau
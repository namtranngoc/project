from django.http import JsonResponse
from .models import User

def list_users(request):
    users = User.objects.all()
    data = []
    for u in users:
        data.append({
            'id': u.id,
            'username': u.username,
            'email': u.email,
            'is_staff': u.is_staff,
            'date_joined': u.date_joined.strftime("%Y-%m-%d %H:%M:%S")
        })
    return JsonResponse(data, safe=False)

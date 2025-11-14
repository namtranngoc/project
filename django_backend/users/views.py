from django.http import JsonResponse
from .models import User
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate

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


@csrf_exempt
def admin_login(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        user = authenticate(username=username, password=password)
        if user is not None and user.is_staff:
            return JsonResponse({"success": True, "message": "Login thành công"})
        return JsonResponse({"success": False, "message": "Sai username/password hoặc không phải admin"})
    return JsonResponse({"success": False, "message": "Method không hợp lệ"})

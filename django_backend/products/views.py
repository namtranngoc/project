from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import Product

@csrf_exempt
def create_product(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        description = request.POST.get('description')
        price = request.POST.get('price')
        image = request.FILES.get('image')

        if not all([name, price, image]):
            return JsonResponse({'error':'Thiếu thông tin'}, status=400)

        product = Product.objects.create(
            name=name,
            description=description,
            price=price,
            image=image
        )
        return JsonResponse({
            'id': product.id,
            'name': product.name,
            'price': str(product.price),
            'image': product.image.url
        })
    return JsonResponse({'error':'Method not allowed'}, status=405)

def list_products(request):
    products = Product.objects.all()
    data = [{'id': p.id, 'name': p.name, 'price': str(p.price), 'image': p.image.url} for p in products]
    return JsonResponse(data, safe=False)

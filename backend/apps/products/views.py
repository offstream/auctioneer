from rest_framework import viewsets

from .models import Product
from .serializers import ProductSerializer


class ProductViewset(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

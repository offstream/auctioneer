from django.utils import timezone
from rest_framework import viewsets, permissions

from .models import Product
from .serializers import ProductSerializer


# source: https://www.django-rest-framework.org/api-guide/permissions/#examples
class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute.
    """

    def has_object_permission(self, request, view, obj):
        return (
            # ALLOW SUPER USER TO ACCESS EVERYTHING
            request.user.is_superuser
            # Read permissions are allowed to any request,
            # so we'll always allow GET, HEAD or OPTIONS requests.
            or request.method in permissions.SAFE_METHODS
            # Instance must have an attribute named `owner`.
            or obj.owner == request.user
        )


class ProductViewset(viewsets.ModelViewSet):
    """PRODUCTS BE HERE"""

    permission_classes = [IsOwnerOrReadOnly]
    queryset = Product.objects.filter(expiry_date__gt=timezone.now())
    serializer_class = ProductSerializer

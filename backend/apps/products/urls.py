from django.urls import path, include
from rest_framework import routers

from .views import ProductViewset

router = routers.DefaultRouter()
router.register(r"", ProductViewset)

urlpatterns = [
    path("", include(router.urls)),
]

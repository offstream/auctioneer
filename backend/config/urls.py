from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from apps.common.views import RegisterUser, Seller, Bidder

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/products/", include("apps.products.urls")),
    path("api/register/", RegisterUser.as_view(), name="user_registration"),
    path("api/users/sellers/", Seller.as_view()),
    path("api/users/buyers/", Bidder.as_view()),
    # api/user/products
    # api/user/bids
    # DRF Browserable API Login View
    # path("api-auth/", include("rest_framework.urls")),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]


if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

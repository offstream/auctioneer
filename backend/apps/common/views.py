from django.contrib.auth import get_user_model
from rest_framework import generics, permissions

from .serializers import RegisterUserSerializer, SellerSerializer, BidderSerializer


class RegisterUser(generics.CreateAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = RegisterUserSerializer
    permission_classes = [permissions.AllowAny]


class Seller(generics.ListAPIView):
    queryset = get_user_model().objects.filter(groups__name="Sellers")
    serializer_class = SellerSerializer


class Bidder(generics.ListAPIView):
    queryset = get_user_model().objects.filter(groups__name="Buyers")
    serializer_class = BidderSerializer

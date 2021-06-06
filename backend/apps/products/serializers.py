from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

from .models import Product
from apps.common.serializers import SellerSerializer


class ProductSerializer(serializers.ModelSerializer):
    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())
    product_owner = SellerSerializer(read_only=True, source="owner")

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "owner",
            "description",
            "image",
            "min_price",
            "max_price",
            "expiry_date",
            "product_owner",
        ]
        extra_kwargs = {
            "min_price": {"required": True},
            "max_price": {"required": True},
            "expiry_date": {"required": True},
        }

    def get_obj_attr(self, attr, attrs, default=""):
        """
        Return the value of key ``attr`` in the dict ``attrs``; if that is
        not present, return the value of the attribute ``attr`` in
        ``self.instance``; otherwise return ``default``.
        """
        return attrs.get(attr, getattr(self.instance, attr, default))

    def validate(self, attrs):
        """
        Ensure that the min_amount is never greater than max_amount
        """
        min_price = self.get_obj_attr("min_price", attrs, 0)
        max_price = self.get_obj_attr("max_price", attrs, 0)
        if min_price > max_price:
            raise serializers.ValidationError(
                _("the minimum bid amount must be lower than the maximum bid amount")
            )
        return attrs

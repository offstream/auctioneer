from rest_framework import serializers, validators
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

ALLOWED_USER_GROUPS = (
    ("Buyers", "Buyer"),
    ("Sellers", "Seller"),
)


class RegisterUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[
            validators.UniqueValidator(queryset=get_user_model().objects.all())
        ],
    )
    group = serializers.ChoiceField(
        choices=ALLOWED_USER_GROUPS,
    )

    class Meta:
        model = get_user_model()
        fields = ["email", "username", "password", "group"]
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def create(self, validated_data):
        user = self.Meta.model(
            email=validated_data["email"], username=validated_data["username"]
        )
        user.set_password(validated_data["password"])
        user.save()

        group = Group.objects.get(name=validated_data["group"])
        user.groups.add(group)

        return user


class SellerSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ["email", "username"]


class BidderSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ["email", "username"]

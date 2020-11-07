from datetime import datetime, timedelta
from pathlib import Path

from django.contrib.auth import get_user_model
from django.db import models
from django.utils.text import slugify

from apps.common.models import Timestamps


def default_expirydate():
    return datetime.now() + timedelta(days=7)


def upload_location(instance, filename, **kwargs):
    return "product_images/{owner_id}/{timestamp}-{name}{ext}".format(
        owner_id=str(instance.owner.id),
        timestamp=datetime.utcnow().strftime("%s"),
        name=slugify(instance.name),
        ext=Path(filename).suffix,
    )


class Product(Timestamps, models.Model):
    name = models.CharField(max_length=150)
    description = models.TextField()
    image = models.ImageField(upload_to=upload_location, verbose_name="Photo")
    min_price = models.DecimalField(
        default=0, max_digits=8, decimal_places=2, verbose_name="Minimum Bid Amount"
    )
    max_price = models.DecimalField(
        default=0, max_digits=8, decimal_places=2, verbose_name="Maximum Bid Amount"
    )
    expiry_date = models.DateTimeField(
        default=default_expirydate, verbose_name="Bid Submission Expiry Date"
    )
    owner = models.ForeignKey(
        get_user_model(), related_name="products", on_delete=models.CASCADE
    )

    class Meta:
        verbose_name = "Product"
        verbose_name_plural = "Products"

    def __str__(self):
        return self.name

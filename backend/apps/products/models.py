from datetime import datetime, timedelta
from pathlib import Path

from django.contrib.auth import get_user_model
from django.db import models
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _

# from apps.common.decorators import modify_model_fields
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


# @modify_model_fields(created_at={"verbose_name": "Date Created"})
class Product(Timestamps, models.Model):
    name = models.CharField(_("name"), max_length=150)
    description = models.TextField(_("description"))
    image = models.ImageField(_("photo"), upload_to=upload_location)
    min_price = models.DecimalField(
        _("minimum bid amount"), default=0, max_digits=8, decimal_places=2
    )
    max_price = models.DecimalField(
        _("maximum bid amount"), default=0, max_digits=8, decimal_places=2
    )
    expiry_date = models.DateTimeField(
        _("bid closing date"), default=default_expirydate
    )
    owner = models.ForeignKey(
        get_user_model(), related_name="products", on_delete=models.CASCADE
    )

    class Meta:
        verbose_name = _("product")
        verbose_name_plural = _("products")

    def __str__(self):
        return self.name

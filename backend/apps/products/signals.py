from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver

from .models import Product


@receiver(post_delete, sender=Product)
def product_on_delete(sender, instance, **kwargs):
    instance.image.delete(False)


@receiver(pre_save, sender=Product)
def product_on_save(sender, instance, **kwargs):
    try:
        old_img = Product.objects.get(pk=instance.pk).image
    except Product.DoesNotExist:
        pass
    else:
        new_image = instance.image
        if not old_img == new_image:
            old_img.delete(False)

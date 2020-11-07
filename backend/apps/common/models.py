from django.db import models


class Timestamps(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date Created")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Date Updated")

    class Meta:
        abstract = True

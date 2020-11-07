from django.contrib import admin

from .models import Product


class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "owner", "created_at", "expiry_date")
    search_fields = ("name", "owner")


admin.site.register(Product, ProductAdmin)

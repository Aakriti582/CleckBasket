from django.contrib import admin
from .models import Category, Product


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'created_at')
    prepopulated_fields = {'slug': ('name',)}



@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'trader', 'category', 'price', 'stock', 'status', 'created_at')
    list_filter = ('status', 'category')
    search_fields = ('name', 'sku', 'trader__email')
    exclude = ('slug',)
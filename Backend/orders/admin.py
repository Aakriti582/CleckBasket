from django.contrib import admin
from .models import Cart, CartItem, CollectionSlot, Order, OrderItem


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'total_items', 'subtotal', 'updated_at')
    inlines = [CartItemInline]


@admin.register(CollectionSlot)
class CollectionSlotAdmin(admin.ModelAdmin):
    list_display = ('date', 'window', 'start_time', 'end_time', 'capacity', 'booked_count', 'spots_left')
    list_filter = ('window', 'date')
    ordering = ('date', 'start_time')


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product_name', 'price', 'quantity', 'subtotal')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'customer', 'status', 'total', 'collection_slot', 'created_at')
    list_filter = ('status', 'collection_slot__date')
    search_fields = ('order_number', 'customer__email')
    readonly_fields = ('order_number', 'subtotal', 'total', 'created_at')
    inlines = [OrderItemInline]
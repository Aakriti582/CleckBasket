from decimal import Decimal

from django.conf import settings
from django.db import models

from products.models import Product


class Cart(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='cart',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def subtotal(self):
        return sum((item.subtotal for item in self.items.all()), Decimal('0.00'))

    @property
    def total_items(self):
        return sum(item.quantity for item in self.items.all())

    def __str__(self):
        return f"{self.user.email}'s cart"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('cart', 'product')

    @property
    def subtotal(self):
        return self.product.price * self.quantity

    def __str__(self):
        return f'{self.quantity} x {self.product.name}'


class CollectionSlot(models.Model):
    class Window(models.TextChoices):
        MORNING = 'MORNING', 'Morning Collection'
        AFTERNOON = 'AFTERNOON', 'Afternoon Collection'
        EVENING = 'EVENING', 'Evening Collection'

    date = models.DateField()
    window = models.CharField(max_length=10, choices=Window.choices)
    start_time = models.TimeField()
    end_time = models.TimeField()
    capacity = models.PositiveIntegerField(default=20)

    class Meta:
        unique_together = ('date', 'window')
        ordering = ['date', 'start_time']

    @property
    def booked_count(self):
        return self.orders.exclude(status=Order.Status.CANCELLED).count()

    @property
    def spots_left(self):
        return max(0, self.capacity - self.booked_count)

    @property
    def is_full(self):
        return self.spots_left <= 0

    def __str__(self):
        return f'{self.date} — {self.get_window_display()}'


class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        CONFIRMED = 'CONFIRMED', 'Confirmed'
        COMPLETED = 'COMPLETED', 'Completed'
        CANCELLED = 'CANCELLED', 'Cancelled'
        REFUNDED = 'REFUNDED', 'Refunded'

    order_number = models.CharField(max_length=20, unique=True, editable=False)
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='orders',
    )
    collection_slot = models.ForeignKey(
        CollectionSlot,
        on_delete=models.PROTECT,
        related_name='orders',
    )
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    total = models.DecimalField(max_digits=10, decimal_places=2)
    pickup_outlet = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.order_number:
            import uuid
            self.order_number = f'CB-{uuid.uuid4().hex[:8].upper()}'
        super().save(*args, **kwargs)

    def __str__(self):
        return self.order_number


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    product_name = models.CharField(max_length=200)   # snapshot, survives product deletion
    price = models.DecimalField(max_digits=8, decimal_places=2)  # price at order time
    quantity = models.PositiveIntegerField()

    @property
    def subtotal(self):
        return self.price * self.quantity

    def __str__(self):
        return f'{self.quantity} x {self.product_name}'
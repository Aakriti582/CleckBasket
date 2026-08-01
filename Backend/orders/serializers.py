from decimal import Decimal

from django.db import transaction
from rest_framework import serializers

from products.models import Product
from .models import Cart, CartItem, CollectionSlot, Order, OrderItem


class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_slug = serializers.CharField(source='product.slug', read_only=True)
    product_image = serializers.ImageField(source='product.image', read_only=True)
    price = serializers.DecimalField(source='product.price', max_digits=8, decimal_places=2, read_only=True)
    unit = serializers.CharField(source='product.unit', read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = (
            'id', 'product', 'product_name', 'product_slug', 'product_image',
            'price', 'unit', 'quantity', 'subtotal',
        )
        read_only_fields = ('id',)


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total_items = serializers.IntegerField(read_only=True)

    class Meta:
        model = Cart
        fields = ('id', 'items', 'subtotal', 'total_items', 'updated_at')


class AddCartItemSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1, default=1)

    def validate_product_id(self, value):
        try:
            product = Product.objects.get(pk=value, status=Product.Status.ACTIVE)
        except Product.DoesNotExist:
            raise serializers.ValidationError('Product not found or unavailable.')
        self.product = product
        return value

    def validate(self, attrs):
        if attrs['quantity'] < self.product.min_order:
            raise serializers.ValidationError(
                f'Minimum order for this product is {self.product.min_order}.'
            )
        if attrs['quantity'] > self.product.max_order:
            raise serializers.ValidationError(
                f'Maximum order for this product is {self.product.max_order}.'
            )
        if attrs['quantity'] > self.product.stock:
            raise serializers.ValidationError('Not enough stock available.')
        return attrs


class UpdateCartItemSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(min_value=1)


class CollectionSlotSerializer(serializers.ModelSerializer):
    spots_left = serializers.IntegerField(read_only=True)
    is_full = serializers.BooleanField(read_only=True)

    class Meta:
        model = CollectionSlot
        fields = (
            'id', 'date', 'window', 'start_time', 'end_time',
            'capacity', 'spots_left', 'is_full',
        )


class OrderItemSerializer(serializers.ModelSerializer):
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ('id', 'product', 'product_name', 'price', 'quantity', 'subtotal')


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    collection_slot = CollectionSlotSerializer(read_only=True)

    class Meta:
        model = Order
        fields = (
            'id', 'order_number', 'status', 'subtotal', 'discount', 'total',
            'pickup_outlet', 'collection_slot', 'items', 'created_at',
        )
        read_only_fields = fields


class CheckoutSerializer(serializers.Serializer):
    collection_slot_id = serializers.IntegerField()
    pickup_outlet = serializers.CharField(max_length=100, required=False, allow_blank=True)
    coupon_code = serializers.CharField(max_length=50, required=False, allow_blank=True)

    def validate_collection_slot_id(self, value):
        try:
            slot = CollectionSlot.objects.get(pk=value)
        except CollectionSlot.DoesNotExist:
            raise serializers.ValidationError('Selected slot does not exist.')
        if slot.is_full:
            raise serializers.ValidationError('This slot is fully booked. Please choose another.')
        self.slot = slot
        return value

    @transaction.atomic
    def create(self, validated_data):
        user = self.context['request'].user
        cart = Cart.objects.select_related('user').prefetch_related('items__product').get(user=user)

        if not cart.items.exists():
            raise serializers.ValidationError({'cart': 'Your cart is empty.'})

        # Re-validate stock at checkout time — carts can go stale.
        for item in cart.items.all():
            if item.quantity > item.product.stock:
                raise serializers.ValidationError(
                    {'cart': f'{item.product.name} no longer has enough stock.'}
                )

        subtotal = cart.subtotal
        discount = Decimal('0.00')   # coupon logic can be added later
        total = subtotal - discount

        order = Order.objects.create(
            customer=user,
            collection_slot=self.slot,
            subtotal=subtotal,
            discount=discount,
            total=total,
            pickup_outlet=validated_data.get('pickup_outlet', ''),
        )

        order_items = [
            OrderItem(
                order=order,
                product=item.product,
                product_name=item.product.name,
                price=item.product.price,
                quantity=item.quantity,
            )
            for item in cart.items.all()
        ]
        OrderItem.objects.bulk_create(order_items)

        # Decrement stock
        for item in cart.items.all():
            Product.objects.filter(pk=item.product_id).update(
                stock=item.product.stock - item.quantity
            )

        cart.items.all().delete()

        return order
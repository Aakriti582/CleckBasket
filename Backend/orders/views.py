from rest_framework import generics, permissions, status, views
from rest_framework.response import Response

from .models import Cart, CartItem, CollectionSlot, Order
from .serializers import (
    CartSerializer,
    AddCartItemSerializer,
    UpdateCartItemSerializer,
    CollectionSlotSerializer,
    CheckoutSerializer,
    OrderSerializer,
)
from .permissions import IsCustomer


class CartView(generics.RetrieveAPIView):
    """GET /api/cart/"""
    serializer_class = CartSerializer
    permission_classes = [IsCustomer]

    def get_object(self):
        cart, _ = Cart.objects.get_or_create(user=self.request.user)
        return cart


class AddCartItemView(views.APIView):
    """POST /api/cart/items/  { product_id, quantity }"""
    permission_classes = [IsCustomer]

    def post(self, request):
        serializer = AddCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        cart, _ = Cart.objects.get_or_create(user=request.user)
        product = serializer.product
        quantity = serializer.validated_data['quantity']

        item, created = CartItem.objects.get_or_create(
            cart=cart, product=product, defaults={'quantity': quantity}
        )
        if not created:
            item.quantity += quantity
            item.save()

        return Response(CartSerializer(cart).data, status=status.HTTP_201_CREATED)


class CartItemDetailView(views.APIView):
    """PATCH /api/cart/items/<id>/  { quantity }
       DELETE /api/cart/items/<id>/"""
    permission_classes = [IsCustomer]

    def get_item(self, request, pk):
        return CartItem.objects.get(pk=pk, cart__user=request.user)

    def patch(self, request, pk):
        try:
            item = self.get_item(request, pk)
        except CartItem.DoesNotExist:
            return Response({'detail': 'Item not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = UpdateCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        quantity = serializer.validated_data['quantity']

        if quantity > item.product.stock:
            return Response(
                {'quantity': 'Not enough stock available.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        item.quantity = quantity
        item.save()
        return Response(CartSerializer(item.cart).data)

    def delete(self, request, pk):
        try:
            item = self.get_item(request, pk)
        except CartItem.DoesNotExist:
            return Response({'detail': 'Item not found.'}, status=status.HTTP_404_NOT_FOUND)
        cart = item.cart
        item.delete()
        return Response(CartSerializer(cart).data)


class CollectionSlotListView(generics.ListAPIView):
    """GET /api/collection-slots/?date=2026-08-01"""
    serializer_class = CollectionSlotSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = CollectionSlot.objects.all()
        date = self.request.query_params.get('date')
        if date:
            qs = qs.filter(date=date)
        return qs


class CheckoutView(views.APIView):
    """POST /api/checkout/  { collection_slot_id, pickup_outlet? }"""
    permission_classes = [IsCustomer]

    def post(self, request):
        serializer = CheckoutSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class OrderListView(generics.ListAPIView):
    """GET /api/orders/"""
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(customer=self.request.user)


class OrderDetailView(generics.RetrieveAPIView):
    """GET /api/orders/<id>/  — powers the invoice page"""
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'pk'

    def get_queryset(self):
        return Order.objects.filter(customer=self.request.user)
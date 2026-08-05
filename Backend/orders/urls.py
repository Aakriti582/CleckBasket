from django.urls import path
from .views import (
    CartItemDetailView,
    AddCartItemView,
    CartView,
    CollectionSlotListView,
    CheckoutView,
    OrderListView,
    OrderDetailView,
)

urlpatterns = [
    path('cart/', CartView.as_view(), name='cart'),
    path('cart/items/', AddCartItemView.as_view(), name='cart-add-item'),
    path('cart/items/<int:pk>/', CartItemDetailView.as_view(), name='cart-item-detail'),
    path('collection-slots/', CollectionSlotListView.as_view(), name='collection-slots'),
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    path('orders/', OrderListView.as_view(), name='order-list'),
    path('orders/<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
]
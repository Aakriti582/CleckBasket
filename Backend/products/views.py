
# Create your views here.
from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend

from .models import Category, Product
from .serializers import (
    CategorySerializer,
    ProductListSerializer,
    ProductDetailSerializer,
    ProductWriteSerializer,
)
from .permissions import IsTrader, IsOwnerTrader


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """Public browsing: /api/products/ and /api/products/<slug>/"""
    queryset = Product.objects.filter(status=Product.Status.ACTIVE).select_related('category', 'trader')
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__slug']
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at']

    def get_serializer_class(self):
        return (
            ProductDetailSerializer
            if self.action == 'retrieve'
            else ProductListSerializer
        )


class TraderProductViewSet(viewsets.ModelViewSet):
    """Trader portal: full CRUD on own products at /api/trader/products/"""
    serializer_class = ProductWriteSerializer
    permission_classes = [IsTrader, IsOwnerTrader]

    def get_queryset(self):
        return Product.objects.filter(trader=self.request.user)

    def perform_create(self, serializer):
        serializer.save(trader=self.request.user)

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
    pagination_class = None        # ← add this
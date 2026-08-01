from rest_framework import serializers
from .models import Category, Product


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'icon')


class ProductListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Product
        fields = (
            'id', 'name', 'slug', 'price', 'unit', 'image',
            'category', 'category_name', 'in_stock', 'created_at',
        )


class ProductDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    trader_name = serializers.CharField(source='trader.full_name', read_only=True)

    class Meta:
        model = Product
        fields = (
            'id', 'name', 'slug', 'sku', 'description', 'price', 'unit',
            'stock', 'in_stock', 'min_order', 'max_order', 'image',
            'category', 'trader', 'trader_name', 'status', 'created_at',
        )


class ProductWriteSerializer(serializers.ModelSerializer):
    """Used by traders to create/update their own products."""

    class Meta:
        model = Product
        fields = (
            'id', 'name', 'sku', 'description', 'price', 'unit',
            'stock', 'min_order', 'max_order', 'image', 'category', 'status',
        )

    def validate(self, attrs):
        min_o = attrs.get('min_order', getattr(self.instance, 'min_order', 1))
        max_o = attrs.get('max_order', getattr(self.instance, 'max_order', 50))
        if min_o > max_o:
            raise serializers.ValidationError(
                {'min_order': 'Minimum order cannot exceed maximum order.'}
            )
        return attrs
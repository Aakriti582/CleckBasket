from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ProductViewSet, TraderProductViewSet

router = DefaultRouter()
router.register('categories', CategoryViewSet, basename='category')
router.register('products', ProductViewSet, basename='product')
router.register('trader/products', TraderProductViewSet, basename='trader-product')

urlpatterns = router.urls

from django.urls import path
from .views import (
    CustomerRegisterView,
    TraderRegisterView,
    LoginView,
    RefreshView,
    LogoutView,
    MeView,
    CsrfCookieView,
    
)

urlpatterns = [
    path('register/customer/', CustomerRegisterView.as_view(), name='register-customer'),
    path('register/trader/', TraderRegisterView.as_view(), name='register-trader'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', RefreshView.as_view(), name='token-refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', MeView.as_view(), name='me'),
    path('csrf/', CsrfCookieView.as_view(), name='csrf')
]
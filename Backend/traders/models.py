from django.conf import settings
from django.db import models


class TraderProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='trader_profile',
    )
    company_name = models.CharField(max_length=255)
    company_registration_no = models.CharField(max_length=100, unique=True)
    shop_name = models.CharField(max_length=255, blank=True)
    shop_description = models.TextField(blank=True)
    business_address = models.CharField(max_length=255, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    is_verified = models.BooleanField(default=False)   # "Verified Seller" badge in your design
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.company_name
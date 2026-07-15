from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from traders.models import TraderProfile

User = get_user_model()


class CustomerRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('email', 'full_name', 'password', 'confirm_password')

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError(
                {'confirm_password': 'Passwords do not match.'}
            )
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        return User.objects.create_user(
            role=User.Role.CUSTOMER,
            **validated_data,
        )


class TraderRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)
    company_name = serializers.CharField(write_only=True, max_length=255)
    company_registration_no = serializers.CharField(write_only=True, max_length=100)

    class Meta:
        model = User
        fields = (
            'email', 'full_name', 'password', 'confirm_password',
            'company_name', 'company_registration_no',
        )

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError(
                {'confirm_password': 'Passwords do not match.'}
            )
        if TraderProfile.objects.filter(
            company_registration_no=attrs['company_registration_no']
        ).exists():
            raise serializers.ValidationError(
                {'company_registration_no': 'This registration number is already in use.'}
            )
        return attrs

    @transaction.atomic # if the profile insert fails, the user row rolls back too. No orphaned accounts.
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        company_name = validated_data.pop('company_name')
        company_registration_no = validated_data.pop('company_registration_no')

        user = User.objects.create_user(
            role=User.Role.TRADER,
            **validated_data,
        )
        TraderProfile.objects.create(
            user=user,
            company_name=company_name,
            company_registration_no=company_registration_no,
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'full_name', 'role', 'created_at')
        read_only_fields = fields


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Adds role + name into the token payload AND the login response body."""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['full_name'] = user.full_name
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user).data
        return data
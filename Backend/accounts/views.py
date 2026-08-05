from django.conf import settings
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.middleware.csrf import get_token


from .serializers import (
    CustomerRegisterSerializer,
    TraderRegisterSerializer,
    UserSerializer,
    CustomTokenObtainPairSerializer,
)


def set_auth_cookies(response, access, refresh):
    response.set_cookie(
        settings.AUTH_COOKIE_ACCESS,
        access,
        httponly=settings.AUTH_COOKIE_HTTPONLY,
        secure=settings.AUTH_COOKIE_SECURE,
        samesite=settings.AUTH_COOKIE_SAMESITE,
        max_age=30 * 60,
    )
    response.set_cookie(
        settings.AUTH_COOKIE_REFRESH,
        refresh,
        httponly=settings.AUTH_COOKIE_HTTPONLY,
        secure=settings.AUTH_COOKIE_SECURE,
        samesite=settings.AUTH_COOKIE_SAMESITE,
        max_age=7 * 24 * 60 * 60,
        path='/api/auth/',   # only sent back on auth endpoints, incl. refresh
    )


class CustomerRegisterView(generics.CreateAPIView):
    serializer_class = CustomerRegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {'message': 'Registration successful. Please log in.', 'user': UserSerializer(user).data},
            status=status.HTTP_201_CREATED,
        )


class TraderRegisterView(CustomerRegisterView):
    serializer_class = TraderRegisterSerializer


class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        response = Response({'user': data['user']}, status=status.HTTP_200_OK)
        set_auth_cookies(response, data['access'], data['refresh'])
        return response


class RefreshView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        raw_refresh = request.COOKIES.get(settings.AUTH_COOKIE_REFRESH)
        if raw_refresh is None:
            return Response({'detail': 'No refresh token.'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            refresh = RefreshToken(raw_refresh)
            new_access = str(refresh.access_token)
        except TokenError:
            return Response({'detail': 'Invalid refresh token.'}, status=status.HTTP_401_UNAUTHORIZED)

        response = Response({'detail': 'Refreshed.'})
        response.set_cookie(
            settings.AUTH_COOKIE_ACCESS,
            new_access,
            httponly=settings.AUTH_COOKIE_HTTPONLY,
            secure=settings.AUTH_COOKIE_SECURE,
            samesite=settings.AUTH_COOKIE_SAMESITE,
            max_age=30 * 60,
        )
        return response


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        raw_refresh = request.COOKIES.get(settings.AUTH_COOKIE_REFRESH)
        if raw_refresh:
            try:
                RefreshToken(raw_refresh).blacklist()
            except TokenError:
                pass

        response = Response({'detail': 'Logged out.'})
        response.delete_cookie(settings.AUTH_COOKIE_ACCESS)
        response.delete_cookie(settings.AUTH_COOKIE_REFRESH, path='/api/auth/')
        return response


class MeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class CsrfCookieView(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request):
        get_token(request)   # forces Set-Cookie: csrftoken=...
        return Response({'detail': 'CSRF cookie set.'})
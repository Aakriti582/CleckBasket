from django.core.mail import mail_admins
from rest_framework import generics, permissions, status
from rest_framework.response import Response

from .models import ContactMessage
from .serializers import ContactMessageSerializer


class ContactMessageCreateView(generics.CreateAPIView):
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()

        # Best-effort notification email; don't fail the request if email breaks.
        try:
            mail_admins(
                subject=f'New contact message: {instance.get_subject_display()}',
                message=(
                    f'From: {instance.full_name} <{instance.email}>\n\n'
                    f'{instance.message}'
                ),
                fail_silently=True,
            )
        except Exception:
            pass

        return Response(
            {'message': "Message sent — we'll get back to you soon."},
            status=status.HTTP_201_CREATED,
        )

from django.contrib import admin
from .models import ContactMessage


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'subject', 'is_resolved', 'created_at')
    list_filter = ('subject', 'is_resolved')
    search_fields = ('full_name', 'email', 'message')
    readonly_fields = ('full_name', 'email', 'subject', 'message', 'created_at')
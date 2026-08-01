from django.db import models


class ContactMessage(models.Model):
    class Subject(models.TextChoices):
        GENERAL = 'GENERAL', 'General Inquiry'
        ORDER_SUPPORT = 'ORDER_SUPPORT', 'Order Support'
        TRADER_PARTNERSHIP = 'TRADER_PARTNERSHIP', 'Trader Partnership'
        FEEDBACK = 'FEEDBACK', 'Feedback'

    full_name = models.CharField(max_length=150)
    email = models.EmailField()
    subject = models.CharField(max_length=20, choices=Subject.choices, default=Subject.GENERAL)
    message = models.TextField()
    is_resolved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.full_name} — {self.get_subject_display()}'
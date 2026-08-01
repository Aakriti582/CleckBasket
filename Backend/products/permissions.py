from rest_framework import permissions


class IsTrader(permissions.BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == 'TRADER'
        )


class IsOwnerTrader(permissions.BasePermission):
    """Traders can only modify their own products."""

    def has_object_permission(self, request, view, obj):
        return obj.trader_id == request.user.id
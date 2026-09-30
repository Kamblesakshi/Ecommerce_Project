from django.urls import path
from .views import (
    WishlistListView,
    WishlistCreateView,
    WishlistDeleteView,
)


urlpatterns = [
    path(
        '',
        WishlistListView.as_view(),
        name='wishlist-list'
    ),

    path(
        'add/',
        WishlistCreateView.as_view(),
        name='wishlist-add'
    ),

    path(
        '<int:pk>/',
        WishlistDeleteView.as_view(),
        name='wishlist-delete'
    ),
]
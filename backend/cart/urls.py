from django.urls import path
from .views import (
    CartListView,
    CartCreateView,
    CartUpdateView,
    CartDeleteView,
)

urlpatterns = [
    path('', CartListView.as_view(), name='cart-list'),
    path('add/', CartCreateView.as_view(), name='cart-add'),
    path('update/<int:pk>/', CartUpdateView.as_view(), name='cart-update'),
    path('remove/<int:pk>/', CartDeleteView.as_view(), name='cart-remove'),
]
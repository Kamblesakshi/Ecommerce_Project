from django.urls import path
from .views import (
    ProductListView,
    ProductDetailView,
    CategoryListView,
    ReviewCreateView,
)


urlpatterns = [
    path(
        '',
        ProductListView.as_view(),
        name='product-list'
    ),

    path(
        '<int:pk>/',
        ProductDetailView.as_view(),
        name='product-detail'
    ),

    path(
        'categories/',
        CategoryListView.as_view(),
        name='category-list'
    ),

    path(
        'reviews/',
        ReviewCreateView.as_view(),
        name='review-create'
    ),
]

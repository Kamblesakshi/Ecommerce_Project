from django.db.models import Q

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Product, Category, Review
from .serializers import (
    ProductSerializer,
    CategorySerializer,
    ReviewSerializer,
)


class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.all()

        search = self.request.GET.get("search")
        category = self.request.GET.get("category")
        min_price = self.request.GET.get("min_price")
        max_price = self.request.GET.get("max_price")

        # Search by product name or description
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search)
                | Q(description__icontains=search)
            )

        # Filter by category
        if category:
            queryset = queryset.filter(
                category_id=category
            )

        # Filter by minimum price
        if min_price:
            queryset = queryset.filter(
                price__gte=min_price
            )

        # Filter by maximum price
        if max_price:
            queryset = queryset.filter(
                price__lte=max_price
            )

        return queryset


class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class ProductCreateView(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ReviewCreateView(generics.CreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
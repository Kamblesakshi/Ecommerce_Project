from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Wishlist
from .serializers import WishlistSerializer


class WishlistListView(generics.ListAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(
            user=self.request.user
        )


class WishlistCreateView(generics.CreateAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        product_id = request.data.get("product")

        wishlist_item = Wishlist.objects.filter(
            user=request.user,
            product_id=product_id
        ).first()

        if wishlist_item:
            return Response(
                {
                    "message": "Product is already in your wishlist.",
                    "wishlist_id": wishlist_item.id
                },
                status=status.HTTP_200_OK
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )


class WishlistDeleteView(generics.DestroyAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(
            user=self.request.user
        )
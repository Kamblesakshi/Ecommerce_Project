from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Cart
from .serializers import CartSerializer


class CartListView(generics.ListAPIView):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(
            user=self.request.user
        )


class CartCreateView(generics.CreateAPIView):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        product_id = request.data.get("product")
        quantity = int(request.data.get("quantity", 1))

        if quantity < 1:
            return Response(
                {"error": "Quantity must be at least 1."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            cart_item = Cart.objects.get(
                user=request.user,
                product_id=product_id
            )

            cart_item.quantity += quantity
            cart_item.save()

            serializer = self.get_serializer(cart_item)

            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )

        except Cart.DoesNotExist:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(user=request.user)

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )


class CartUpdateView(generics.UpdateAPIView):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(
            user=self.request.user
        )


class CartDeleteView(generics.DestroyAPIView):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(
            user=self.request.user
        )
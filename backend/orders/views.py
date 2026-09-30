from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from cart.models import Cart
from .models import Order, OrderItem
from .serializers import OrderSerializer


class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(
            user=self.request.user
        )


class CheckoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        cart_items = Cart.objects.filter(
            user=request.user
        )

        if not cart_items.exists():
            return Response({
                "message": "Cart is empty"
            })

        total_price = 0

        for item in cart_items:
            total_price += (
                item.product.price * item.quantity
            )

        order = Order.objects.create(
            user=request.user,
            total_price=total_price
        )

        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price
            )

        cart_items.delete()

        return Response({
            "message": "Order placed successfully",
            "order_id": order.id
        })
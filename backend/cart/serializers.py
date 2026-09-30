from rest_framework import serializers
from .models import Cart


class CartSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(
        source="product.name",
        read_only=True
    )

    product_price = serializers.DecimalField(
        source="product.price",
        max_digits=10,
        decimal_places=2,
        read_only=True
    )

    product_image = serializers.URLField(
        source="product.image",
        read_only=True
    )

    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = [
            "id",
            "user",
            "product",
            "product_name",
            "product_price",
            "product_image",
            "quantity",
            "subtotal",
            "created_at",
        ]
        read_only_fields = [
            "user",
            "product_name",
            "product_price",
            "product_image",
            "subtotal",
            "created_at",
        ]

    def get_subtotal(self, obj):
        return obj.product.price * obj.quantity
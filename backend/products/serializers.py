from rest_framework import serializers
from .models import Product, Category, Review


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Review
        fields = [
            "id",
            "product",
            "user",
            "rating",
            "comment",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "user",
            "created_at",
        ]

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError(
                "Rating must be between 1 and 5."
            )

        return value


class ProductSerializer(serializers.ModelSerializer):
    reviews = ReviewSerializer(
        many=True,
        read_only=True
    )

    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = "__all__"

    def get_average_rating(self, obj):
        reviews = obj.reviews.all()

        if not reviews.exists():
            return 0

        total = sum(review.rating for review in reviews)

        return round(
            total / reviews.count(),
            1
        )
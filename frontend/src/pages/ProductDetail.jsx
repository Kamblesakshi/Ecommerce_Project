import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`products/${id}/`);

      console.log("PRODUCT DETAIL RESPONSE:", response.data);

      setProduct(response.data);
    } catch (error) {
      console.error(
        "PRODUCT DETAIL ERROR:",
        error.response?.data
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const response = await api.post("cart/add/", {
        product: product.id,
        quantity: 1,
      });

      console.log("CART RESPONSE:", response.data);

      alert("Product added to cart!");
    } catch (error) {
      console.error(
        "ADD TO CART ERROR:",
        error.response?.data
      );

      alert("Failed to add product.");
    }
  };

  const handleAddToWishlist = async () => {
    try {
      const response = await api.post("wishlist/add/", {
        product: product.id,
      });

      console.log("WISHLIST RESPONSE:", response.data);

      if (response.status === 200) {
        alert("Product is already in your Wishlist!");
      } else {
        alert("Product added to Wishlist ❤️");
      }
    } catch (error) {
      console.error(
        "ADD TO WISHLIST ERROR:",
        error.response?.data
      );

      alert("Failed to add product to Wishlist.");
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      alert("Please enter a review comment.");
      return;
    }

    try {
      setSubmittingReview(true);

      const response = await api.post("products/reviews/", {
        product: product.id,
        rating: Number(rating),
        comment: comment.trim(),
      });

      console.log("REVIEW RESPONSE:", response.data);

      alert("Review submitted successfully!");

      setComment("");
      setRating(5);

      // Fetch the product again so the new review
      // and updated average rating appear immediately.
      await fetchProduct();
    } catch (error) {
      console.error(
        "REVIEW ERROR:",
        error.response?.data
      );

      if (error.response?.status === 401) {
        alert("Please login to submit a review.");
      } else if (error.response?.data) {
        alert("Failed to submit review.");
      } else {
        alert("Unable to connect to the server.");
      }
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h3>Loading product...</h3>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mt-5 text-center">
        <h3>Product not found.</h3>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="card shadow-sm">
        <div className="card-body p-4">

          {/* Product Section */}
          <div className="row align-items-center">

            {/* Product Image */}
            <div className="col-md-5 text-center mb-4 mb-md-0">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="img-fluid rounded"
                  style={{
                    width: "350px",
                    height: "350px",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <div
                  className="border rounded d-flex align-items-center justify-content-center mx-auto"
                  style={{
                    width: "350px",
                    height: "350px",
                  }}
                >
                  No Image Available
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="col-md-7">

              <h1 className="mb-3">
                {product.name}
              </h1>

              <p className="text-muted">
                {product.description}
              </p>

              <h3 className="mb-3">
                ₹{Number(product.price).toFixed(2)}
              </h3>

              <p className="mb-2">
                <strong>Stock:</strong> {product.stock}
              </p>

              <h4 className="mt-3 mb-4">
                ⭐{" "}
                {product.average_rating > 0
                  ? Number(product.average_rating).toFixed(1)
                  : "No rating"}
              </h4>

              {/* Product Buttons */}
              <div className="d-flex flex-wrap gap-2">
                <button
                  className="btn btn-primary"
                  onClick={handleAddToCart}
                >
                  Add To Cart
                </button>

                <button
                  className="btn btn-outline-danger"
                  onClick={handleAddToWishlist}
                >
                  ❤️ Add To Wishlist
                </button>
              </div>

            </div>
          </div>

          {/* Review Form */}
          <div className="mt-5">
            <h3 className="mb-4">
              Write a Review
            </h3>

            <div className="card bg-light">
              <div className="card-body">

                <form onSubmit={handleSubmitReview}>

                  {/* Rating */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      Rating
                    </label>

                    <select
                      className="form-select"
                      value={rating}
                      onChange={(e) =>
                        setRating(e.target.value)
                      }
                    >
                      <option value="5">⭐⭐⭐⭐⭐ 5</option>
                      <option value="4">⭐⭐⭐⭐ 4</option>
                      <option value="3">⭐⭐⭐ 3</option>
                      <option value="2">⭐⭐ 2</option>
                      <option value="1">⭐ 1</option>
                    </select>
                  </div>

                  {/* Comment */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      Your Review
                    </label>

                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="Write your review..."
                      value={comment}
                      onChange={(e) =>
                        setComment(e.target.value)
                      }
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={submittingReview}
                  >
                    {submittingReview
                      ? "Submitting..."
                      : "Submit Review"}
                  </button>

                </form>

              </div>
            </div>
          </div>

          {/* Existing Reviews */}
          <div className="mt-5">
            <h3 className="mb-4">
              Reviews
            </h3>

            {product.reviews &&
            product.reviews.length > 0 ? (
              product.reviews.map((review) => (
                <div
                  key={review.id}
                  className="card p-3 mb-3"
                >
                  <div className="d-flex justify-content-between">

                    <h5 className="mb-2">
                      ⭐ {review.rating}
                    </h5>

                    {review.user && (
                      <small className="text-muted">
                        By {review.user}
                      </small>
                    )}

                  </div>

                  <p className="mb-0">
                    {review.comment}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-muted">
                No reviews available.
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
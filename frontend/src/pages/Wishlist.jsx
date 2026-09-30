import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const navigate = useNavigate();

  const fetchWishlist = async () => {
    try {
      const response = await api.get("wishlist/");

      console.log("WISHLIST RESPONSE:", response.data);

      setWishlistItems(
        response.data.results || response.data || []
      );
    } catch (error) {
      console.log(
        "WISHLIST ERROR:",
        error.response?.data
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeFromWishlist = async (wishlistId) => {
    try {
      setActionId(wishlistId);

      await api.delete(`wishlist/${wishlistId}/`);

      await fetchWishlist();
    } catch (error) {
      console.log(
        "REMOVE WISHLIST ERROR:",
        error.response?.data
      );

      alert("Failed to remove product from wishlist.");
    } finally {
      setActionId(null);
    }
  };

  const addToCart = async (productId) => {
    try {
      setActionId(productId);

      await api.post("cart/add/", {
        product: productId,
        quantity: 1,
      });

      alert("Product added to cart!");
    } catch (error) {
      console.log(
        "ADD TO CART ERROR:",
        error.response?.data
      );

      alert("Failed to add product to cart.");
    } finally {
      setActionId(null);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div
          className="spinner-border text-primary mb-3"
          role="status"
        >
          <span className="visually-hidden">
            Loading...
          </span>
        </div>

        <h5>Loading your wishlist...</h5>
      </div>
    );
  }

  return (
    <div className="container py-5 mb-5">

      {/* Page Header */}
      <div className="text-center mb-5">
        <h1 className="display-6 fw-bold mb-2">
          My Wishlist ❤️
        </h1>

        <p className="text-muted">
          Save your favorite products and shop them anytime.
        </p>
      </div>

      {/* Empty Wishlist */}
      {wishlistItems.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center p-5">

            <div className="display-1 mb-3">
              ❤️
            </div>

            <h3 className="fw-bold mb-2">
              Your Wishlist is Empty
            </h3>

            <p className="text-muted mb-4">
              Add products you love to your wishlist.
            </p>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate("/products")}
            >
              Browse Products
            </button>

          </div>
        </div>
      ) : (
        <>
          {/* Wishlist Count */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-semibold mb-0">
              Saved Products
            </h4>

            <span className="badge bg-danger rounded-pill px-3 py-2">
              {wishlistItems.length}{" "}
              {wishlistItems.length === 1
                ? "item"
                : "items"}
            </span>
          </div>

          {/* Wishlist Products */}
          <div className="row g-4">

            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="col-sm-6 col-lg-4"
              >
                <div className="card h-100 border-0 shadow-sm overflow-hidden">

                  {/* Image */}
                  <div
                    className="bg-light d-flex align-items-center justify-content-center"
                    style={{
                      height: "250px",
                    }}
                  >
                    {item.product_image ? (
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="img-fluid"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          padding: "20px",
                        }}
                      />
                    ) : (
                      <div className="text-center text-muted">
                        <div className="fs-1 mb-2">
                          🖼️
                        </div>

                        <span>
                          No Image Available
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Information */}
                  <div className="card-body d-flex flex-column p-4">

                    <h4 className="fw-semibold mb-2">
                      {item.product_name}
                    </h4>

                    <h5 className="fw-bold text-primary mb-4">
                      ₹
                      {Number(
                        item.product_price
                      ).toFixed(2)}
                    </h5>

                    <div className="d-grid gap-2 mt-auto">

                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={() =>
                          addToCart(item.product)
                        }
                        disabled={
                          actionId === item.product
                        }
                      >
                        {actionId === item.product
                          ? "Adding..."
                          : "🛒 Add to Cart"}
                      </button>

                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() =>
                          removeFromWishlist(item.id)
                        }
                        disabled={
                          actionId === item.id
                        }
                      >
                        {actionId === item.id
                          ? "Removing..."
                          : "🗑 Remove"}
                      </button>

                    </div>

                  </div>
                </div>
              </div>
            ))}

          </div>
        </>
      )}

    </div>
  );
}

export default Wishlist;
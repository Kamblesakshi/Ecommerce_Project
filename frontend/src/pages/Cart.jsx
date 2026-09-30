import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const response = await api.get("cart/");

      console.log("CART RESPONSE:", response.data);

      setCartItems(response.data.results || []);
    } catch (error) {
      console.log(
        "CART ERROR:",
        error.response?.data
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) {
      return;
    }

    try {
      setUpdatingId(cartId);

      await api.patch(`cart/update/${cartId}/`, {
        quantity: newQuantity,
      });

      await fetchCart();
    } catch (error) {
      console.log(
        "UPDATE ERROR:",
        error.response?.data
      );

      alert("Failed to update quantity.");
    } finally {
      setUpdatingId(null);
    }
  };

  const increaseQuantity = (item) => {
    updateQuantity(
      item.id,
      Number(item.quantity) + 1
    );
  };

  const decreaseQuantity = (item) => {
    if (Number(item.quantity) > 1) {
      updateQuantity(
        item.id,
        Number(item.quantity) - 1
      );
    }
  };

  const removeItem = async (cartId) => {
    try {
      setUpdatingId(cartId);

      await api.delete(`cart/remove/${cartId}/`);

      await fetchCart();
    } catch (error) {
      console.log(
        "REMOVE ERROR:",
        error.response?.data
      );

      alert("Failed to remove product.");
    } finally {
      setUpdatingId(null);
    }
  };

  const total = cartItems.reduce((sum, item) => {
    return sum + Number(item.subtotal || 0);
  }, 0);

  const totalItems = cartItems.reduce((sum, item) => {
    return sum + Number(item.quantity || 0);
  }, 0);

  const proceedToCheckout = () => {
    navigate("/checkout");
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

        <h5>Loading your cart...</h5>
      </div>
    );
  }

  return (
    <div className="container py-5 mb-5">

      {/* Page Header */}
      <div className="text-center mb-5">
        <h1 className="display-6 fw-bold mb-2">
          Shopping Cart
        </h1>

        <p className="text-muted">
          Review your items before checkout.
        </p>
      </div>

      {/* Empty Cart */}
      {cartItems.length === 0 ? (
        <div className="card border-0 shadow-sm text-center p-5">
          <div className="display-1 mb-3">
            🛒
          </div>

          <h3 className="mb-2">
            Your cart is empty
          </h3>

          <p className="text-muted mb-4">
            Add some products to your cart and come back here.
          </p>

          <button
            className="btn btn-primary"
            onClick={() => navigate("/products")}
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="row g-4">

          {/* Cart Items */}
          <div className="col-lg-8">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">
                Cart Items
              </h4>

              <span className="badge bg-primary rounded-pill px-3 py-2">
                {totalItems} items
              </span>
            </div>

            {cartItems.map((item) => (
              <div
                key={item.id}
                className="card border-0 shadow-sm mb-3"
              >
                <div className="card-body p-4">

                  <div className="row align-items-center g-4">

                    {/* Product Image */}
                    <div className="col-12 col-sm-3 text-center">
                      <div
                        className="bg-light rounded d-flex align-items-center justify-content-center mx-auto"
                        style={{
                          width: "130px",
                          height: "130px",
                        }}
                      >
                        {item.product_image ? (
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="img-fluid rounded"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                              padding: "10px",
                            }}
                          />
                        ) : (
                          <span className="text-muted">
                            No Image
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="col-12 col-sm-5">
                      <h5 className="fw-semibold mb-2">
                        {item.product_name}
                      </h5>

                      <p className="text-muted mb-2">
                        Price: ₹
                        {Number(
                          item.product_price
                        ).toFixed(2)}
                      </p>

                      <small className="text-muted">
                        Product ID: {item.product}
                      </small>
                    </div>

                    {/* Quantity + Subtotal */}
                    <div className="col-12 col-sm-4">

                      <div className="mb-3">
                        <small className="text-muted d-block mb-2">
                          Quantity
                        </small>

                        <div className="d-flex align-items-center gap-2">
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() =>
                              decreaseQuantity(item)
                            }
                            disabled={
                              Number(item.quantity) <= 1 ||
                              updatingId === item.id
                            }
                          >
                            −
                          </button>

                          <span
                            className="fw-bold px-2"
                            style={{
                              minWidth: "35px",
                              textAlign: "center",
                            }}
                          >
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() =>
                              increaseQuantity(item)
                            }
                            disabled={
                              updatingId === item.id
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="mb-3">
                        <small className="text-muted d-block">
                          Subtotal
                        </small>

                        <h5 className="fw-bold mb-0">
                          ₹
                          {Number(
                            item.subtotal || 0
                          ).toFixed(2)}
                        </h5>
                      </div>

                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() =>
                          removeItem(item.id)
                        }
                        disabled={
                          updatingId === item.id
                        }
                      >
                        🗑 Remove
                      </button>

                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">

                <h4 className="fw-bold mb-4">
                  Order Summary
                </h4>

                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">
                    Items
                  </span>

                  <span>
                    {totalItems}
                  </span>
                </div>

                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">
                    Subtotal
                  </span>

                  <span>
                    ₹{total.toFixed(2)}
                  </span>
                </div>

                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">
                    Delivery
                  </span>

                  <span className="text-success fw-semibold">
                    Free
                  </span>
                </div>

                <hr />

                <div className="d-flex justify-content-between mb-4">
                  <h5 className="fw-bold mb-0">
                    Total
                  </h5>

                  <h5 className="fw-bold mb-0">
                    ₹{total.toFixed(2)}
                  </h5>
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-lg w-100"
                  onClick={proceedToCheckout}
                >
                  Proceed to Checkout
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary w-100 mt-2"
                  onClick={() => navigate("/products")}
                >
                  Continue Shopping
                </button>

              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default Cart;
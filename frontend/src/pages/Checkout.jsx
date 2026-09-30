import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const response = await api.get("cart/");

      console.log("CHECKOUT CART:", response.data);

      setCartItems(response.data.results || []);
    } catch (error) {
      console.log(
        "CHECKOUT CART ERROR:",
        error.response?.data
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const total = cartItems.reduce((sum, item) => {
    return sum + Number(item.subtotal || 0);
  }, 0);

  const totalItems = cartItems.reduce((sum, item) => {
    return sum + Number(item.quantity || 0);
  }, 0);

  const placeOrder = async () => {
    try {
      setPlacingOrder(true);

      const response = await api.post("orders/checkout/");

      console.log("ORDER RESPONSE:", response.data);

      setOrderId(response.data.order_id);
      setOrderSuccess(true);
      setCartItems([]);
    } catch (error) {
      console.log(
        "ORDER ERROR:",
        error.response?.data
      );

      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Failed to place order.");
      }
    } finally {
      setPlacingOrder(false);
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

        <h5>Loading checkout...</h5>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-7">
            <div className="card border-0 shadow-sm text-center">
              <div className="card-body p-5">

                <div className="display-1 mb-3">
                  ✅
                </div>

                <h1 className="text-success fw-bold mb-3">
                  Order Placed Successfully!
                </h1>

                <p className="text-muted mb-2">
                  Thank you for your purchase.
                </p>

                <p className="mb-4">
                  Your Order ID is{" "}
                  <strong>#{orderId}</strong>
                </p>

                <div className="d-flex justify-content-center gap-2 flex-wrap">
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate("/orders")}
                  >
                    View My Orders
                  </button>

                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/products")}
                  >
                    Continue Shopping
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container py-5">
        <div className="card border-0 shadow-sm text-center">
          <div className="card-body p-5">

            <div className="display-1 mb-3">
              🛒
            </div>

            <h3 className="fw-bold">
              Your cart is empty
            </h3>

            <p className="text-muted mb-4">
              Add products to your cart before checkout.
            </p>

            <button
              className="btn btn-primary"
              onClick={() => navigate("/products")}
            >
              Browse Products
            </button>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 mb-5">

      {/* Page Heading */}
      <div className="text-center mb-5">
        <h1 className="display-6 fw-bold mb-2">
          Checkout
        </h1>

        <p className="text-muted">
          Review your order before placing it.
        </p>
      </div>

      <div className="row g-4">

        {/* Order Details */}
        <div className="col-lg-8">

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold mb-0">
                  Order Details
                </h4>

                <span className="badge bg-primary rounded-pill px-3 py-2">
                  {totalItems} items
                </span>
              </div>

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="border-bottom pb-3 mb-3"
                >
                  <div className="row align-items-center g-3">

                    {/* Image */}
                    <div className="col-12 col-sm-2 text-center">
                      <div
                        className="bg-light rounded d-flex align-items-center justify-content-center mx-auto"
                        style={{
                          width: "90px",
                          height: "90px",
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
                              padding: "8px",
                            }}
                          />
                        ) : (
                          <span className="text-muted small">
                            No Image
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Product */}
                    <div className="col-12 col-sm-5">
                      <h6 className="fw-semibold mb-1">
                        {item.product_name}
                      </h6>

                      <small className="text-muted">
                        Price: ₹
                        {Number(
                          item.product_price
                        ).toFixed(2)}
                      </small>
                    </div>

                    {/* Quantity */}
                    <div className="col-6 col-sm-2 text-center">
                      <small className="text-muted d-block">
                        Quantity
                      </small>

                      <span className="fw-semibold">
                        {item.quantity}
                      </span>
                    </div>

                    {/* Subtotal */}
                    <div className="col-6 col-sm-3 text-end">
                      <small className="text-muted d-block">
                        Subtotal
                      </small>

                      <strong>
                        ₹
                        {Number(
                          item.subtotal || 0
                        ).toFixed(2)}
                      </strong>
                    </div>

                  </div>
                </div>
              ))}

            </div>
          </div>

          {/* Delivery Information */}
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">

              <h4 className="fw-bold mb-3">
                Delivery Information
              </h4>

              <div className="alert alert-light border mb-0">
                <strong>Delivery:</strong> Free
                <br />
                <small className="text-muted">
                  Delivery details can be added in a future version.
                </small>
              </div>

            </div>
          </div>

        </div>

        {/* Payment Summary */}
        <div className="col-lg-4">

          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">

              <h4 className="fw-bold mb-4">
                Payment Summary
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
                className="btn btn-success btn-lg w-100"
                onClick={placeOrder}
                disabled={placingOrder}
              >
                {placingOrder
                  ? "Placing Order..."
                  : "Place Order"}
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary w-100 mt-2"
                onClick={() => navigate("/cart")}
                disabled={placingOrder}
              >
                Back to Cart
              </button>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Checkout;
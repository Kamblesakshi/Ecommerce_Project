import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const response = await api.get("orders/");

      console.log("ORDERS RESPONSE:", response.data);

      setOrders(response.data.results || response.data || []);
    } catch (error) {
      console.log(
        "ORDERS ERROR:",
        error.response?.data
      );

      if (error.response?.status === 401) {
        setErrorMessage(
          "Please login to view your orders."
        );
      } else {
        setErrorMessage(
          "Failed to load orders."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-warning text-dark";

      case "Processing":
        return "bg-info text-dark";

      case "Shipped":
        return "bg-primary";

      case "Delivered":
        return "bg-success";

      default:
        return "bg-secondary";
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

        <h5>Loading your orders...</h5>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">

            <div className="card border-0 shadow-sm">
              <div className="card-body p-5">

                <div className="display-5 mb-3">
                  🔐
                </div>

                <div className="alert alert-danger">
                  {errorMessage}
                </div>

                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/login")}
                >
                  Go to Login
                </button>

              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 mb-5">

      {/* Page Header */}
      <div className="text-center mb-5">
        <h1 className="display-6 fw-bold mb-2">
          My Orders
        </h1>

        <p className="text-muted">
          View and track your previous orders.
        </p>
      </div>

      {orders.length === 0 ? (
        /* Empty Orders */
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center p-5">

            <div className="display-1 mb-3">
              📦
            </div>

            <h3 className="fw-bold mb-2">
              No Orders Found
            </h3>

            <p className="text-muted mb-4">
              You have not placed any orders yet.
            </p>

            <button
              className="btn btn-primary"
              onClick={() => navigate("/products")}
            >
              Start Shopping
            </button>

          </div>
        </div>
      ) : (
        <>

          {/* Orders List */}
          <div className="row">
            {orders.map((order) => (
              <div
                key={order.id}
                className="col-12 mb-4"
              >
                <div className="card border-0 shadow-sm">

                  <div className="card-body p-4">

                    {/* Order Header */}
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">

                      <div>
                        <h4 className="fw-bold mb-1">
                          Order #{order.id}
                        </h4>

                        <p className="text-muted mb-0">
                          Placed on{" "}
                          {new Date(
                            order.created_at
                          ).toLocaleString()}
                        </p>
                      </div>

                      <span
                        className={`badge rounded-pill px-3 py-2 ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>

                    </div>

                    <hr className="my-4" />

                    {/* Order Items */}
                    <div className="mb-4">

                      <h5 className="fw-bold mb-3">
                        Order Items
                      </h5>

                      {order.items &&
                      order.items.length > 0 ? (
                        order.items.map((item) => (
                          <div
                            key={item.id}
                            className="border rounded p-3 mb-2"
                          >

                            <div className="row align-items-center g-3">

                              {/* Product */}
                              <div className="col-md-6">
                                <h6 className="fw-semibold mb-1">
                                  {item.product_name}
                                </h6>

                                <small className="text-muted">
                                  Product ID: {item.product}
                                </small>
                              </div>

                              {/* Quantity */}
                              <div className="col-md-3">
                                <span className="text-muted">
                                  Quantity:
                                </span>{" "}
                                <strong>
                                  {item.quantity}
                                </strong>
                              </div>

                              {/* Price */}
                              <div className="col-md-3 text-md-end">
                                <strong>
                                  ₹
                                  {Number(
                                    item.price
                                  ).toFixed(2)}
                                </strong>
                              </div>

                            </div>

                          </div>
                        ))
                      ) : (
                        <p className="text-muted">
                          No item details available.
                        </p>
                      )}

                    </div>

                    {/* Order Total */}
                    <div className="border-top pt-3">
                      <div className="d-flex justify-content-between align-items-center">

                        <span className="fw-semibold">
                          Order Total
                        </span>

                        <span className="fs-5 fw-bold">
                          ₹
                          {Number(
                            order.total_price
                          ).toFixed(2)}
                        </span>

                      </div>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Continue Shopping */}
          <div className="text-center mt-2">
            <button
              className="btn btn-outline-primary"
              onClick={() => navigate("/products")}
            >
              Continue Shopping
            </button>
          </div>

        </>
      )}

    </div>
  );
}

export default Orders;
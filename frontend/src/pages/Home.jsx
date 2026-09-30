import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-5 bg-light">
        <div className="container py-5 text-center">

          <h1 className="display-4 fw-bold mb-3">
            Welcome to E-Commerce Store
          </h1>

          <p className="lead text-muted mb-4">
            Discover great products at the best prices.
          </p>

          <Link
            to="/products"
            className="btn btn-primary btn-lg px-4 py-2"
          >
            Shop Now
          </Link>

        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">

          <h2 className="text-center mb-5">
            Why Shop With Us?
          </h2>

          <div className="row g-4">

            {/* Feature 1 */}
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body text-center p-4">

                  <div
                    className="fs-1 mb-3"
                    role="img"
                    aria-label="shopping cart"
                  >
                    🛒
                  </div>

                  <h4>Easy Shopping</h4>

                  <p className="text-muted mb-0">
                    Browse products, add them to your cart,
                    and manage your shopping easily.
                  </p>

                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body text-center p-4">

                  <div
                    className="fs-1 mb-3"
                    role="img"
                    aria-label="delivery truck"
                  >
                    🚚
                  </div>

                  <h4>Simple Checkout</h4>

                  <p className="text-muted mb-0">
                    Review your order and place it through
                    a simple checkout process.
                  </p>

                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body text-center p-4">

                  <div
                    className="fs-1 mb-3"
                    role="img"
                    aria-label="secure"
                  >
                    🔒
                  </div>

                  <h4>Secure Account</h4>

                  <p className="text-muted mb-0">
                    Your account and protected shopping features
                    use secure authentication.
                  </p>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-5 bg-light">
        <div className="container text-center">

          <h2 className="mb-3">
            Ready to Start Shopping?
          </h2>

          <p className="text-muted mb-4">
            Explore our products and find something you like.
          </p>

          <Link
            to="/products"
            className="btn btn-success btn-lg px-4"
          >
            Explore Products
          </Link>

        </div>
      </section>
    </div>
  );
}

export default Home;
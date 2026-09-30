import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = Boolean(localStorage.getItem("access"));

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    alert("Logged out successfully!");

    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">

        {/* Brand */}
        <Link
          className="navbar-brand fw-bold fs-4"
          to="/"
        >
          E-Commerce
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMenu"
          aria-controls="navbarMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation */}
        <div
          className="collapse navbar-collapse"
          id="navbarMenu"
        >
          <div className="navbar-nav ms-auto align-items-lg-center gap-lg-2">

            {/* Home */}
            <Link
              className={`nav-link ${
                isActive("/") ? "active fw-bold" : ""
              }`}
              to="/"
            >
              Home
            </Link>

            {/* Products */}
            <Link
              className={`nav-link ${
                isActive("/products")
                  ? "active fw-bold"
                  : ""
              }`}
              to="/products"
            >
              Products
            </Link>

            {!isLoggedIn ? (
              <>
                {/* Login */}
                <Link
                  className={`nav-link ${
                    isActive("/login")
                      ? "active fw-bold"
                      : ""
                  }`}
                  to="/login"
                >
                  Login
                </Link>

                {/* Register */}
                <Link
                  className={`nav-link ${
                    isActive("/register")
                      ? "active fw-bold"
                      : ""
                  }`}
                  to="/register"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                {/* Cart */}
                <Link
                  className={`nav-link ${
                    isActive("/cart")
                      ? "active fw-bold"
                      : ""
                  }`}
                  to="/cart"
                >
                  🛒 Cart
                </Link>

                {/* Orders */}
                <Link
                  className={`nav-link ${
                    isActive("/orders")
                      ? "active fw-bold"
                      : ""
                  }`}
                  to="/orders"
                >
                  📦 My Orders
                </Link>

                {/* Wishlist */}
                <Link
                  className={`nav-link ${
                    isActive("/wishlist")
                      ? "active fw-bold"
                      : ""
                  }`}
                  to="/wishlist"
                >
                  ❤️ Wishlist
                </Link>

                {/* Profile */}
                <Link
                  className={`nav-link ${
                    isActive("/profile")
                      ? "active fw-bold"
                      : ""
                  }`}
                  to="/profile"
                >
                  👤 Profile
                </Link>

                {/* Logout */}
                <button
                  className="btn btn-outline-light btn-sm ms-lg-2 mt-2 mt-lg-0"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
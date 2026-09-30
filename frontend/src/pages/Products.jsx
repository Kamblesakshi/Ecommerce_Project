import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("products/categories/");

        console.log("CATEGORY RESPONSE:", response.data);

        setCategories(
          response.data.results || response.data || []
        );
      } catch (error) {
        console.log(
          "CATEGORY ERROR:",
          error.response?.data
        );
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const params = {};

        if (search) {
          params.search = search;
        }

        if (selectedCategory) {
          params.category = selectedCategory;
        }

        const response = await api.get("products/", {
          params,
        });

        console.log("PRODUCT RESPONSE:", response.data);

        setProducts(response.data.results || []);
      } catch (error) {
        console.log(
          "PRODUCT ERROR:",
          error.response?.data
        );

        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, selectedCategory]);

  // Search
  const handleSearch = (e) => {
    e.preventDefault();

    setSearch(searchInput.trim());
  };

  // Clear filters
  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setSelectedCategory("");
  };

  // Add to Cart
  const addToCart = async (productId) => {
    try {
      const response = await api.post("cart/add/", {
        product: productId,
        quantity: 1,
      });

      console.log("CART RESPONSE:", response.data);

      alert("Product Added to Cart!");
    } catch (error) {
      console.log(
        "ADD TO CART ERROR:",
        error.response?.data
      );

      alert("Failed to Add Product!");
    }
  };

  // Add to Wishlist
  const addToWishlist = async (productId) => {
    try {
      const response = await api.post("wishlist/add/", {
        product: productId,
      });

      console.log("WISHLIST RESPONSE:", response.data);

      if (response.status === 200) {
        alert("Product is already in your Wishlist!");
      } else {
        alert("Product Added to Wishlist ❤️");
      }
    } catch (error) {
      console.log(
        "ADD TO WISHLIST ERROR:",
        error.response?.data
      );

      alert("Failed to Add Product to Wishlist!");
    }
  };

  return (
    <div className="container py-5">

      {/* Page Heading */}
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold mb-2">
          Products
        </h1>

        <p className="text-muted">
          Discover products you'll love.
        </p>
      </div>

      {/* Search & Filter Section */}
      <div className="card shadow-sm border-0 mb-5">
        <div className="card-body p-4">

          <form
            onSubmit={handleSearch}
            className="row g-3 align-items-end"
          >

            {/* Search */}
            <div className="col-lg-6">
              <label className="form-label fw-semibold">
                Search Products
              </label>

              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Search by product name or description"
                value={searchInput}
                onChange={(e) =>
                  setSearchInput(e.target.value)
                }
              />
            </div>

            {/* Category */}
            <div className="col-lg-4">
              <label className="form-label fw-semibold">
                Category
              </label>

              <select
                className="form-select form-select-lg"
                value={selectedCategory}
                onChange={(e) =>
                  setSelectedCategory(e.target.value)
                }
                disabled={categoryLoading}
              >
                <option value="">
                  All Categories
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <div className="col-lg-2">
              <button
                type="submit"
                className="btn btn-primary btn-lg w-100"
              >
                🔍 Search
              </button>
            </div>

          </form>

          {/* Active Filters */}
          {(search || selectedCategory) && (
            <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
              <small className="text-muted">
                Filters are active
              </small>

              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center py-5">
          <div
            className="spinner-border text-primary mb-3"
            role="status"
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>

          <h5>Loading products...</h5>
        </div>
      ) : products.length === 0 ? (
        /* No Products */
        <div className="text-center py-5">
          <div className="fs-1 mb-3">
            🔍
          </div>

          <h4>No products found</h4>

          <p className="text-muted mb-4">
            Try a different search or category.
          </p>

          <button
            className="btn btn-outline-primary"
            onClick={clearFilters}
          >
            View All Products
          </button>
        </div>
      ) : (
        /* Product Grid */
        <div className="row g-4">

          {products.map((product) => (
            <div
              key={product.id}
              className="col-sm-6 col-lg-4"
            >
              <div className="card h-100 border-0 shadow-sm overflow-hidden">

                {/* Product Image */}
                <div
                  className="bg-light d-flex align-items-center justify-content-center"
                  style={{
                    height: "250px",
                  }}
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-image"
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
                    {product.name}
                  </h4>

                  <p className="text-muted flex-grow-1">
                    {product.description}
                  </p>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0">
                      ₹{Number(product.price).toFixed(2)}
                    </h5>

                    <small className="text-muted">
                      Stock: {product.stock}
                    </small>
                  </div>

                  {/* Buttons */}
                  <div className="d-grid gap-2">

                    <Link
                      to={`/products/${product.id}`}
                      className="btn btn-primary"
                    >
                      View Details
                    </Link>

                    <button
                      className="btn btn-success"
                      onClick={() =>
                        addToCart(product.id)
                      }
                    >
                      🛒 Add to Cart
                    </button>

                    <button
                      className="btn btn-outline-danger"
                      onClick={() =>
                        addToWishlist(product.id)
                      }
                    >
                      ❤️ Add to Wishlist
                    </button>

                  </div>

                </div>
              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default Products;
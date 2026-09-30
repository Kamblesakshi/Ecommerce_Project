import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const response = await api.get("accounts/profile/");

      console.log("PROFILE RESPONSE:", response.data);

      setProfile(response.data);
    } catch (error) {
      console.log(
        "PROFILE ERROR:",
        error.response?.data
      );

      if (error.response?.status === 401) {
        setErrorMessage(
          "Please login to view your profile."
        );
      } else {
        setErrorMessage(
          "Failed to load profile."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    alert("Logged out successfully!");

    navigate("/login");
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

        <h5>Loading your profile...</h5>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center p-5">

                <div className="display-4 mb-3">
                  🔐
                </div>

                <h4 className="fw-bold mb-3">
                  Profile Unavailable
                </h4>

                <div className="alert alert-danger">
                  {errorMessage}
                </div>

                <button
                  type="button"
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

  const firstLetter =
    profile?.username
      ? profile.username
          .charAt(0)
          .toUpperCase()
      : "U";

  return (
    <div className="container py-5 mb-5">

      {/* Page Header */}
      <div className="text-center mb-5">
        <h1 className="display-6 fw-bold mb-2">
          My Profile
        </h1>

        <p className="text-muted">
          Manage your account and access your orders.
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-6">

          <div className="card border-0 shadow-sm overflow-hidden">

            {/* Profile Header */}
            <div className="bg-primary text-white text-center p-4">

              <div
                className="rounded-circle bg-white text-primary d-flex align-items-center justify-content-center mx-auto mb-3 fw-bold"
                style={{
                  width: "100px",
                  height: "100px",
                  fontSize: "38px",
                }}
              >
                {firstLetter}
              </div>

              <h3 className="fw-bold mb-1 text-white">
                {profile?.username}
              </h3>

              <p className="mb-0 text-white-50">
                E-Commerce Customer
              </p>

            </div>

            {/* Profile Information */}
            <div className="card-body p-4 p-md-5">

              <div className="mb-4">
                <label className="form-label text-muted small fw-semibold">
                  Username
                </label>

                <div className="border rounded p-3 bg-light">
                  <span className="fw-semibold">
                    {profile?.username}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label text-muted small fw-semibold">
                  Email Address
                </label>

                <div className="border rounded p-3 bg-light">
                  <span className="fw-semibold">
                    {profile?.email ||
                      "No email available"}
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <h5 className="fw-bold mb-3">
                Quick Actions
              </h5>

              <div className="row g-3">

                <div className="col-sm-6">
                  <button
                    type="button"
                    className="btn btn-primary w-100 py-2"
                    onClick={() =>
                      navigate("/orders")
                    }
                  >
                    📦 My Orders
                  </button>
                </div>

                <div className="col-sm-6">
                  <button
                    type="button"
                    className="btn btn-outline-primary w-100 py-2"
                    onClick={() =>
                      navigate("/wishlist")
                    }
                  >
                    ❤️ My Wishlist
                  </button>
                </div>

                <div className="col-12">
                  <button
                    type="button"
                    className="btn btn-danger w-100 py-2"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;
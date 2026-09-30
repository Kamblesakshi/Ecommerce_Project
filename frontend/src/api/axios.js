import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

// Add access token to requests
api.interceptors.request.use(
  (config) => {
    const publicUrls = [
      "accounts/login/",
      "accounts/register/",
      "accounts/refresh/",
    ];

    if (publicUrls.includes(config.url)) {
      return config;
    }

    const token = localStorage.getItem("access");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// Handle expired access token
api.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest = error.config;

    // Don't retry these requests
    const excludedUrls = [
      "accounts/login/",
      "accounts/register/",
      "accounts/refresh/",
    ];

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      excludedUrls.includes(originalRequest.url) ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const refreshToken = localStorage.getItem("refresh");

    if (!refreshToken) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      window.location.href = "/login";

      return Promise.reject(error);
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/accounts/refresh/",
        {
          refresh: refreshToken,
        }
      );

      const newAccessToken = response.data.access;

      localStorage.setItem("access", newAccessToken);

      originalRequest.headers =
        originalRequest.headers || {};

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return api(originalRequest);

    } catch (refreshError) {
      console.log(
        "REFRESH TOKEN ERROR:",
        refreshError.response?.data
      );

      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      window.location.href = "/login";

      return Promise.reject(refreshError);
    }
  }
);

export default api;
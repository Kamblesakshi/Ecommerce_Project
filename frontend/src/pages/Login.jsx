import { useState } from "react";
import api from "../api/axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setErrorMessage("");

    const cleanUsername = username.trim();

    if (!cleanUsername || !password) {
      setErrorMessage("Please enter username and password.");
      return;
    }

    console.log("Sending Login Request...");
    console.log("USERNAME:", cleanUsername);

    try {
      const response = await api.post("accounts/login/", {
        username: cleanUsername,
        password: password,
      });

      console.log("LOGIN RESPONSE:", response.data);

      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      alert("Login Successful!");

      // Go to Products page after successful login
      window.location.href = "/products";
    } catch (error) {
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);
      console.log("FULL ERROR:", error);

      if (error.response?.status === 401) {
        setErrorMessage("Invalid username or password.");
      } else if (!error.response) {
        setErrorMessage(
          "Cannot connect to Django server. Please make sure the backend is running."
        );
      } else {
        setErrorMessage("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Login</h1>

      <form onSubmit={handleLogin} className="w-50 mx-auto">
        <input
          type="text"
          placeholder="Username"
          className="form-control mb-3"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="form-control mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {errorMessage && (
          <div className="alert alert-danger">
            {errorMessage}
          </div>
        )}

        <button type="submit" className="btn btn-success w-100">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
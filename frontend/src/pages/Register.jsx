import { useState } from "react";
import api from "../api/axios";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("accounts/register/", {
        username,
        email,
        password,
      });

      console.log(response.data);
      alert("Registration Successful!");
    } catch (error) {
      console.error(error.response?.data);
      alert("Registration Failed!");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Register</h1>

      <form onSubmit={handleRegister} className="w-50 mx-auto">
        <input
          type="text"
          placeholder="Username"
          className="form-control mb-3"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="form-control mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="form-control mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="btn btn-primary w-100">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
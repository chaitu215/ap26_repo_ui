import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Card, CardContent, Typography, CircularProgress } from "@mui/material";

export default function Login() {
  const [user, setUser] = useState({ email: "", password: "" });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      console.log("Attempting to login...");

      // Login request
      const res = await axios.post("http://localhost:5000/api/auth/login", user);
      console.log("Login successful:", res.data);

      const { token } = res.data;
      if (!token) {
        throw new Error("Token not received from login response");
      }

      // Store token
      localStorage.setItem("token", token);

      // Check if token exists before calling profile API
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        throw new Error("Token not found in localStorage");
      }

      console.log("Token exists. Fetching user profile...");

      // Fetch user profile
      const profileRes = await axios.get("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `${storedToken}` },
      });

      const userRole = profileRes.data.role;
      console.log("User Role:", userRole);

      if (!userRole) throw new Error("Role not found in profile response");

      // Redirect based on role
      console.log('userRole === "admin"' , userRole === "admin")
      if (userRole === "admin") {
        console.log('in true')
        navigate("/admin");
      } else if (userRole === "manager") {
        navigate("/manager");
      } else {
        navigate("/profile");
      }
    } catch (error) {
      console.error("Login Error:", error);

      if (error.response) {
        console.error("Response Data:", error.response.data);
        console.error("Response Status:", error.response.status);
      }

      setMessage(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 400, mx: "auto", mt: 5, p: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Login</Typography>
        {message && <Typography color="error">{message}</Typography>}
        <form onSubmit={handleLogin}>
          <TextField fullWidth margin="normal" label="Email" name="email" type="email" onChange={handleChange} required />
          <TextField fullWidth margin="normal" label="Password" name="password" type="password" onChange={handleChange} required />
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Login"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
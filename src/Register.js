import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Card, CardContent, Typography } from "@mui/material";

export default function Register() {
  const [user, setUser] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/register", user);
      setMessage("Registration successful! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>Register</Typography>
        {message && <Typography color="error">{message}</Typography>}
        <form onSubmit={handleRegister}>
          <TextField fullWidth margin="normal" label="Username" name="username" onChange={handleChange} required />
          <TextField fullWidth margin="normal" label="Email" name="email" type="email" onChange={handleChange} required />
          <TextField fullWidth margin="normal" label="Password" name="password" type="password" onChange={handleChange} required />
          <Button type="submit" variant="contained" color="primary" fullWidth>Register</Button>
        </form>
      </CardContent>
    </Card>
  );
}
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Card, CardContent, Typography, CircularProgress, MenuItem, Select, FormControl, InputLabel } from "@mui/material";

export default function Register() {
  const [user, setUser] = useState({ username: "", email: "", password: "", role: "" });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await axios.post("http://localhost:5000/api/auth/register", user);
      setMessage("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 400, mx: "auto", mt: 5, p: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Register</Typography>
        {message && <Typography color={message.includes("successful") ? "success" : "error"}>{message}</Typography>}
        <form onSubmit={handleRegister}>
          <TextField fullWidth margin="normal" label="Username" name="username" onChange={handleChange} required />
          <TextField fullWidth margin="normal" label="Email" name="email" type="email" onChange={handleChange} required />
          <TextField fullWidth margin="normal" label="Password" name="password" type="password" onChange={handleChange} required />

          {/* Role Dropdown (Fixed) */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              name="role"
              value={user.role}
              onChange={handleChange}
              MenuProps={{
                disableScrollLock: true, // Fixes dropdown issue
              }}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </Select>
          </FormControl>

          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Register"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
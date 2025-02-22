import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, TextField, Button, CircularProgress } from "@mui/material";

export default function Profile() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login"); // Redirect if not logged in
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `${token}` },
        });

        setUser(res.data);
        setEditData({ username: res.data.username, password: "" }); // Prefill username
      } catch (error) {
        console.error("Error fetching profile:", error);
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put("http://localhost:5000/api/user/profile", editData, {
        headers: { Authorization: `${token}` },
      });

      setMessage("Profile updated successfully!");
      setUser((prev) => ({ ...prev, username: editData.username }));
    } catch (error) {
      setMessage(error.response?.data?.message || "Update failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Card sx={{ maxWidth: 500, mx: "auto", mt: 5, p: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Profile</Typography>

        {loading ? <CircularProgress /> : (
          <>
            <Typography variant="body1"><strong>Email:</strong> {user.email}</Typography>
            <Typography variant="body1"><strong>Username:</strong> {user.username}</Typography>
            <Typography variant="body1"><strong>Role:</strong> {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Typography>

            <Typography variant="h6" sx={{ mt: 3 }}>Edit Profile</Typography>
            {message && <Typography color="success">{message}</Typography>}
            
            <form onSubmit={handleUpdate}>
              <TextField fullWidth margin="normal" label="Username" name="username" value={editData.username} onChange={handleChange} required />
              <TextField fullWidth margin="normal" label="New Password" name="password" type="password" onChange={handleChange} />
              <Button type="submit" variant="contained" color="primary" fullWidth>Update Profile</Button>
            </form>

            <Button variant="contained" color="error" fullWidth sx={{ mt: 2 }} onClick={handleLogout}>Logout</Button>
          </>
        )}
      </CardContent>
    </Card>
  );

}

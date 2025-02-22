import React, { useEffect, useState, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import 
  { AppBar, Toolbar, Button, Typography, Box, CircularProgress } 
    from "@mui/material";

// Lazy-loaded components
const Register = lazy(() => import("./Register"));
const Login = lazy(() => import("./Login"));
const Profile = lazy(() => import("./Profile"));
const AdminPanel = lazy(() => import("./AdminPanel"));
const ManagerPanel = lazy(() => import("./ManagerPanel"));

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          JWT Authentication & Authorization
        </Typography>

        {!user ? (
          <>
            <Button color="inherit" component={Link} to="/register">Register</Button>
            <Button color="inherit" component={Link} to="/login">Login</Button>
          </>
        ) : (
          <>
            {user.role !== "manager" && <Button color="inherit" component={Link} to="/profile">Profile</Button>}
            {user.role === "admin" && <Button color="inherit" component={Link} to="/admin">Admin Panel</Button>}
            {(user.role === "admin" || user.role === "manager") && <Button color="inherit" component={Link} to="/manager">Manager Panel</Button>}
            <Button color="error" variant="contained" onClick={handleLogout}>Logout</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Protected Route Component
function ProtectedRoute({ element, allowedRoles }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      try {
        const res = await fetch("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error:", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  if (user === null) return <CircularProgress sx={{ display: "block", mx: "auto", my: 4 }} />;

  return allowedRoles.includes(user.role) ? element : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Router>
      <Navbar />
      <Box sx={{ maxWidth: 500, mx: "auto", mt: 4, p: 3, boxShadow: 3, borderRadius: 2, backgroundColor: "#f9f9f9" }}>
        <Suspense fallback={<CircularProgress sx={{ display: "block", mx: "auto", my: 4 }} />}>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<ProtectedRoute element={<Profile />} allowedRoles={["user", "admin"]} />} />
            <Route path="/admin" element={<ProtectedRoute element={<AdminPanel />} allowedRoles={["admin"]} />} />
            <Route path="/manager" element={<ProtectedRoute element={<ManagerPanel />} allowedRoles={["admin", "manager"]} />} />
          </Routes>
        </Suspense>
      </Box>
    </Router>
  );
}
import React, { useEffect, useState } from "react";
import { Container, Paper, Typography, CircularProgress, List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ManagerPanel() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/user/manager", {
          headers: { Authorization: `${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setReports(data.reports); // Assuming API returns `{ reports: [...] }`
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [navigate]);

  return (
    <Container>
      <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Manager Panel
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 3 }}>
          View Reports & Analytics
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : (
          <List>
            {reports.map((report, index) => (
              <ListItem key={index}>
                <ListItemText primary={report.title} secondary={`Date: ${report.date}`} />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
}

// src/pages/Auth/LoginPage.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Box, Alert, Avatar } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useAuth } from "../../contexts/AuthContext";
import { useAppContext } from "../../contexts/AppContext"; // For notifications

const LoginPage = () => {
  const { loginWithGoogle, currentUser, loading: authLoading } = useAuth();
  const { showNotification } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
      // AuthContext will handle navigation on successful redirect from Google/Appwrite
    } catch (error) {
      console.error("Login Page: Google Sign-In failed", error);
      showNotification("Google Sign-In failed. Please try again.", "error");
    }
  };

  if (authLoading && !currentUser) {
    // Show loading only if not already logged in and redirecting
    return (
      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Typography>Loading authentication...</Typography>
      </Box>
    );
  }
  if (currentUser) {
    // If user becomes available while on this page, redirect
    return null; // Or a redirecting message
  }

  return (
    <>
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5" gutterBottom>
        Sign In
      </Typography>
      <Typography
        component="p"
        variant="body2"
        color="textSecondary"
        align="center"
        sx={{ mb: 3 }}
      >
        Access your projects and tasks by signing in with Google.
      </Typography>

      {/* Placeholder for error messages from Appwrite redirect, if any */}
      {/* Example: {location.state?.error && <Alert severity="error" sx={{mb:2}}>{location.state.error}</Alert>} */}

      <Button
        type="button"
        fullWidth
        variant="contained"
        color="primary"
        startIcon={<GoogleIcon />}
        onClick={handleGoogleSignIn}
        disabled={authLoading}
        sx={{ mt: 3, mb: 2, py: 1.5, fontSize: "1rem" }}
      >
        {authLoading ? "Processing..." : "Sign in with Google"}
      </Button>
    </>
  );
};

export default LoginPage;

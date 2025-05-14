// src/layouts/AuthLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import { Container, Box, Paper, CssBaseline } from "@mui/material";
import Notification from "../components/common/Notification"; // Import Notification

const AuthLayout = () => {
  return (
    <>
      <CssBaseline />
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Paper
            elevation={6}
            sx={{
              p: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              borderRadius: 3,
            }}
          >
            <Outlet />
          </Paper>
        </Box>
      </Container>
      <Notification /> {/* Add Notification component here */}
    </>
  );
};

export default AuthLayout;

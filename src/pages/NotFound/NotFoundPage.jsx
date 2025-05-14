// src/pages/NotFound/NotFoundPage.jsx
import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const NotFoundPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        p: 3,
        backgroundColor: (theme) => theme.palette.background.default,
      }}
    >
      <Container maxWidth="md">
        <ErrorOutlineIcon sx={{ fontSize: 80, color: "primary.main", mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          404: Page Not Found
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Oops! The page you are looking for does not exist. It might have been
          moved or deleted.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={RouterLink}
          to="/dashboard"
          sx={{ mt: 3, py: 1.5, px: 4 }}
        >
          Go to Dashboard
        </Button>
      </Container>
    </Box>
  );
};

export default NotFoundPage;

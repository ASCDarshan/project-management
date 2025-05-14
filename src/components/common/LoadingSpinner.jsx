// src/components/common/LoadingSpinner.jsx
import React from "react";
import { CircularProgress, Box } from "@mui/material";

const LoadingSpinner = ({ fullScreen, size = 40 }) => {
  if (fullScreen) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100%",
          position: "fixed",
          top: 0,
          left: 0,
          backgroundColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(0,0,0,0.7)"
              : "rgba(255,255,255,0.7)",
          zIndex: (theme) => theme.zIndex.drawer + 2, // Above everything
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <CircularProgress size={size} />
    </Box>
  );
};

export default LoadingSpinner;

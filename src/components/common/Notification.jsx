// src/components/common/Notification.jsx
import React from "react";
import { Snackbar, Alert } from "@mui/material";
import { useAppContext } from "../../contexts/AppContext";

const Notification = () => {
  const { notification, hideNotification } = useAppContext();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    hideNotification();
  };

  return (
    <Snackbar
      open={notification.open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={handleClose}
        severity={notification.severity || "info"}
        sx={{ width: "100%" }}
        variant="filled"
      >
        {notification.message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;

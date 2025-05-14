// src/contexts/AppContext.js
import React, { createContext, useState, useContext, useMemo } from "react";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState(() => {
    const savedMode = localStorage.getItem("themeMode");
    return savedMode ? savedMode : "light"; // Default to light
  });
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info",
  }); // success, error, warning, info
  const [globalLoading, setGlobalLoading] = useState(false);

  const toggleThemeMode = () => {
    setThemeMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light";
      localStorage.setItem("themeMode", newMode);
      document.body.classList.toggle("dark-mode", newMode === "dark");
      return newMode;
    });
  };

  // Initialize body class on mount
  useState(() => {
    document.body.classList.toggle("dark-mode", themeMode === "dark");
  }, [themeMode]);

  const showNotification = (message, severity = "info") => {
    setNotification({ open: true, message, severity });
  };

  const hideNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const value = useMemo(
    () => ({
      themeMode,
      toggleThemeMode,
      notification,
      showNotification,
      hideNotification,
      globalLoading,
      setGlobalLoading,
    }),
    [themeMode, notification, globalLoading]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

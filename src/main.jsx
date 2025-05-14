// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import App from "./App.jsx";
import { AppProvider, useAppContext } from "./contexts/AppContext";
import { AuthProvider } from "./contexts/AuthContext";
import { lightTheme, darkTheme } from "./theme/theme";
import "./index.css";

// Small component to access AppContext for theme selection
const ThemedApp = () => {
  const { themeMode } = useAppContext();
  const theme = themeMode === "light" ? lightTheme : darkTheme;
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />{" "}
      {/* Normalizes styles and applies background from theme */}
      <App />
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        {" "}
        {/* AppContext provides themeMode and toggleThemeMode */}
        <AuthProvider>
          {" "}
          {/* AuthContext provides user session */}
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <ThemedApp /> {/* ThemedApp consumes themeMode from AppContext */}
          </LocalizationProvider>
        </AuthProvider>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);

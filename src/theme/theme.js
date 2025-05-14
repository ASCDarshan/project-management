// src/theme/theme.js
import { createTheme } from "@mui/material/styles";

const commonTypography = {
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  h1: { fontWeight: 700, fontSize: "2.5rem" },
  h2: { fontWeight: 700, fontSize: "2rem" },
  h3: { fontWeight: 600, fontSize: "1.75rem" },
  h4: { fontWeight: 600, fontSize: "1.5rem" },
  h5: { fontWeight: 500, fontSize: "1.25rem" },
  h6: { fontWeight: 500, fontSize: "1.1rem" },
  button: { textTransform: "none", fontWeight: 600 },
};

const commonComponents = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 12,
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: "0px 4px 20px rgba(0,0,0,0.05)", // Softer shadow
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: "none", // Flat design for appbar
        borderBottom: "1px solid", // Add a subtle border
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        borderRight: "none", // Clean look for drawer
      },
    },
  },
  MuiTextField: {
    defaultProps: {
      variant: "outlined",
      size: "small",
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: {
        borderRadius: "8px !important", // Ensure consistent border radius
      },
    },
  },
};

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#007AFF", // A vibrant blue
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#FF3B30", // A clear red for secondary actions or warnings
      contrastText: "#ffffff",
    },
    background: {
      default: "#F4F6F8", // Slightly off-white for a softer look
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1A2027", // Dark grey for primary text
      secondary: "#4A5568", // Lighter grey for secondary text
    },
    divider: "#E2E8F0", // Light grey for dividers
  },
  typography: commonTypography,
  components: {
    ...commonComponents,
    MuiAppBar: {
      styleOverrides: {
        root: {
          ...commonComponents.MuiAppBar.styleOverrides.root,
          backgroundColor: "#FFFFFF",
          color: "#1A2027",
          borderColor: "#E2E8F0",
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#0A84FF", // Slightly brighter blue for dark mode
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#FF453A", // Slightly brighter red for dark mode
      contrastText: "#ffffff",
    },
    background: {
      default: "#121212", // Standard dark background
      paper: "#1E1E1E", // Slightly lighter dark for paper elements
    },
    text: {
      primary: "#E5E5E5", // Light grey for primary text
      secondary: "#A0A0A0", // Darker grey for secondary text
    },
    divider: "#3A3A3C", // Dark mode divider
  },
  typography: commonTypography,
  components: {
    ...commonComponents,
    MuiAppBar: {
      styleOverrides: {
        root: {
          ...commonComponents.MuiAppBar.styleOverrides.root,
          backgroundColor: "#1E1E1E",
          color: "#E5E5E5",
          borderColor: "#3A3A3C",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          ...commonComponents.MuiCard.styleOverrides.root,
          boxShadow: "0px 4px 20px rgba(0,0,0,0.2)", // Darker shadow for dark mode
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
});

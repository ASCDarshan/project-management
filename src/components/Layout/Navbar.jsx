// src/components/Layout/Navbar.jsx
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Switch,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import AccountCircle from "@mui/icons-material/AccountCircle"; // Default avatar
import { useAuth } from "../../contexts/AuthContext";
import { useAppContext } from "../../contexts/AppContext";
import { avatars } from "../../services/appwriteConfig"; // For initials avatar

const Navbar = ({ drawerWidth, handleDrawerToggle }) => {
  const { currentUser, logout } = useAuth();
  const { themeMode, toggleThemeMode } = useAppContext();
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
  };

  const userInitials = currentUser?.name
    ? currentUser.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";
  const avatarUrl =
    currentUser?.prefs?.avatarUrl ||
    (currentUser?.name ? avatars.getInitials(currentUser.name).href : null);

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        // backgroundColor: (theme) => theme.palette.background.paper, // Ensure it uses theme
        // color: (theme) => theme.palette.text.primary, // Ensure text color matches theme
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          ProjectPro
        </Typography>

        <Tooltip
          title={
            themeMode === "dark"
              ? "Switch to Light Mode"
              : "Switch to Dark Mode"
          }
        >
          <Switch
            checked={themeMode === "dark"}
            onChange={toggleThemeMode}
            icon={<Brightness7Icon />}
            checkedIcon={<Brightness4Icon />}
            color="primary"
          />
        </Tooltip>

        {currentUser && (
          <Box sx={{ flexGrow: 0, ml: 2 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {avatarUrl ? (
                  <Avatar alt={currentUser.name || "User"} src={avatarUrl} />
                ) : (
                  <Avatar>{userInitials}</Avatar>
                )}
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={handleCloseUserMenu} disabled>
                {" "}
                {/* Replace with Link to profile page */}
                <Typography textAlign="center">Profile</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

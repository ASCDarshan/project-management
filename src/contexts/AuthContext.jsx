/* eslint-disable no-unused-vars */
// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import { account } from "../services/appwriteConfig";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const user = await account.get();
      setCurrentUser(user);
    } catch (error) {
      setCurrentUser(null);
      // console.error('AuthContext: Failed to fetch user', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      await account.createOAuth2Session(
        "google",
        `${window.location.origin}/`, // Success URL
        `${window.location.origin}/login` // Failure URL
      );
      // Appwrite handles redirect, user will be fetched on useEffect after redirect
    } catch (error) {
      console.error("Failed to login with Google:", error);
      // Handle error (e.g., show notification via AppContext)
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await account.deleteSession("current");
      setCurrentUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  // Potentially fetch user's role if stored separately (e.g., in a 'users_profile' collection)
  // For now, we assume Appwrite Teams will handle role-based access on the backend.
  // A simple isAdmin check could be based on email or a custom claim if you set that up.
  const isAdmin = () => {
    // This is a placeholder. Real admin logic would involve Appwrite teams or a custom user role attribute.
    // For instance, if you have a predefined list of admin emails:
    // const adminEmails = ['admin@example.com'];
    // return currentUser && adminEmails.includes(currentUser.email);
    // Or check if user belongs to an "Admins" team in Appwrite.
    return (
      currentUser && currentUser.labels && currentUser.labels.includes("admin")
    ); // If you set user labels in Appwrite
  };

  const value = {
    currentUser,
    loading,
    loginWithGoogle,
    logout,
    fetchUser, // expose fetchUser if needed for re-fetching
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

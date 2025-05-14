/* eslint-disable no-unused-vars */
// src/services/authService.js
import { account, avatars, ID } from "./appwriteConfig";

// Note: loginWithGoogle and logout are primarily handled in AuthContext
// to have direct access to setLoading and setCurrentUser.
// This service can hold auxiliary auth functions or be expanded.

export const authService = {
  async loginWithGoogle() {
    try {
      // The success/failure URLs should ideally be configurable or constants
      const successUrl = `${window.location.origin}/`;
      const failureUrl = `${window.location.origin}/login`;
      await account.createOAuth2Session("google", successUrl, failureUrl);
      // Appwrite handles the redirect. User session will be picked up by AuthContext.
    } catch (error) {
      console.error("Google Login Error:", error);
      throw error; // Re-throw to be caught by UI component
    }
  },

  async logout() {
    try {
      await account.deleteSession("current");
    } catch (error) {
      console.error("Logout Error:", error);
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      return await account.get();
    } catch (error) {
      // If no session, Appwrite throws an error. This is expected for unauthenticated users.
      // console.warn('Get Current User Error (expected if not logged in):', error.message);
      return null;
    }
  },

  async updateUserPrefs(prefs) {
    try {
      return await account.updatePrefs(prefs);
    } catch (error) {
      console.error("Update User Prefs Error:", error);
      throw error;
    }
  },

  getUserInitialsAvatar(name) {
    if (!name) return null;
    try {
      return avatars.getInitials(name).href; // Returns the URL string
    } catch (error) {
      console.error("Error getting initials avatar:", error);
      return null;
    }
  },

  // Example for creating a user if you need email/password (not used for Google Sign-In directly)
  async createUser(email, password, name) {
    try {
      return await account.create(ID.unique(), email, password, name);
    } catch (error) {
      console.error("Create User Error:", error);
      throw error;
    }
  },

  // Example for session creation with email/password
  async createEmailSession(email, password) {
    try {
      return await account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.error("Create Email Session Error:", error);
      throw error;
    }
  },
};

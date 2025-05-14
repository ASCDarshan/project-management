// src/routes/AppRoutes.js
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

import LoginPage from "../pages/Auth/LoginPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import ProjectListPage from "../pages/Project/ProjectListPage";
import ProjectCreatePage from "../pages/Project/ProjectCreatePage";
import ProjectDetailsPage from "../pages/Project/ProjectDetailsPage";
// Import other pages as you create them
// import TeamListPage from '../pages/Team/TeamListPage';
// import UserProfilePage from '../pages/User/UserProfilePage';
import NotFoundPage from "../pages/NotFound/NotFoundPage";
import LoadingSpinner from "../components/common/LoadingSpinner";

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />; // Or a more sophisticated layout-integrated loader
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Routes within AuthLayout (e.g., Login, Forgot Password) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Protected Routes within MainLayout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />

        <Route path="projects">
          <Route index element={<ProjectListPage />} />
          <Route path="new" element={<ProjectCreatePage />} />
          <Route path="edit/:projectId" element={<ProjectCreatePage />} />
          <Route path=":projectId" element={<ProjectDetailsPage />} />
          {/* Example: /projects/:projectId/edit */}
        </Route>

        {/* Add other main features routes here */}
        {/* <Route path="teams" element={<TeamListPage />} /> */}
        {/* <Route path="profile" element={<UserProfilePage />} /> */}
        {/* <Route path="settings" element={<SettingsPage />} /> */}
      </Route>

      {/* Not Found Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;

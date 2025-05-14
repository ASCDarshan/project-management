// src/pages/Project/ProjectCreatePage.jsx (Can also function as ProjectEditPage)
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  Box,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import ProjectForm from "../../components/Project/ProjectForm";
import { projectService } from "../../services/projectService";
import { useAuth } from "../../contexts/AuthContext";
import { useAppContext } from "../../contexts/AppContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const ProjectCreatePage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams(); // For editing existing project
  const { currentUser } = useAuth();
  const { showNotification, setGlobalLoading } = useAppContext();

  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false); // For fetching initial data for edit

  const isEditMode = Boolean(projectId);

  useEffect(() => {
    if (isEditMode) {
      const fetchProject = async () => {
        setIsFetching(true);
        setGlobalLoading(true);
        try {
          const project = await projectService.getProject(projectId);
          // RBAC: Check if current user is owner or admin before allowing edit
          // if (project.ownerId !== currentUser.$id && !isAdmin()) {
          //   showNotification("You don't have permission to edit this project.", "error");
          //   navigate("/projects");
          //   return;
          // }
          setInitialData(project);
        } catch (error) {
          showNotification(
            `Failed to load project details: ${error.message}`,
            "error"
          );
          navigate("/projects");
        } finally {
          setIsFetching(false);
          setGlobalLoading(false);
        }
      };
      fetchProject();
    }
  }, [
    projectId,
    isEditMode,
    navigate,
    showNotification,
    setGlobalLoading,
    currentUser,
  ]);

  const handleSubmit = async (projectData) => {
    if (!currentUser) {
      showNotification(
        "You must be logged in to perform this action.",
        "error"
      );
      return;
    }
    setIsLoading(true);
    setGlobalLoading(true);

    try {
      let response;
      if (isEditMode) {
        response = await projectService.updateProject(projectId, projectData);
        showNotification("Project updated successfully!", "success");
      } else {
        const dataWithOwner = { ...projectData, ownerId: currentUser.$id };
        response = await projectService.createProject(dataWithOwner);
        showNotification("Project created successfully!", "success");
      }
      navigate(`/projects/${response.$id}`); // Navigate to project details page
    } catch (error) {
      showNotification(`Operation failed: ${error.message}`, "error");
    } finally {
      setIsLoading(false);
      setGlobalLoading(false);
    }
  };

  // If in edit mode and data is being fetched, show loader
  if (isEditMode && isFetching) {
    return <LoadingSpinner fullScreen />;
  }
  // If in edit mode and no initial data (e.g., project not found or error), don't render form
  if (isEditMode && !initialData && !isFetching) {
    return (
      <Container>
        <Typography variant="h5" color="error">
          Project not found or unable to load.
        </Typography>
        <Button
          component={RouterLink}
          to="/projects"
          variant="outlined"
          sx={{ mt: 2 }}
        >
          Back to Projects
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{ my: 2 }}
      >
        <MuiLink
          component={RouterLink}
          underline="hover"
          color="inherit"
          to="/dashboard"
        >
          Dashboard
        </MuiLink>
        <MuiLink
          component={RouterLink}
          underline="hover"
          color="inherit"
          to="/projects"
        >
          Projects
        </MuiLink>
        <Typography color="text.primary">
          {isEditMode ? "Edit Project" : "New Project"}
        </Typography>
      </Breadcrumbs>

      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, mt: 2 }}>
        <ProjectForm
          onSubmit={handleSubmit}
          initialData={initialData}
          isLoading={isLoading}
          submitButtonText={isEditMode ? "Save Changes" : "Create Project"}
        />
      </Paper>
    </Container>
  );
};

export default ProjectCreatePage;

// src/pages/Project/ProjectDetailsPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Container,
  Button,
  Grid,
  Chip,
  Breadcrumbs,
  Link as MuiLink,
  Card,
  CardContent,
  CardHeader,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import GroupIcon from "@mui/icons-material/Group";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn"; // For Tasks
import FlagIcon from "@mui/icons-material/Flag"; // For Milestones
import SettingsIcon from "@mui/icons-material/Settings";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import { projectService } from "../../services/projectService";
import { useAuth } from "../../contexts/AuthContext";
import { useAppContext } from "../../contexts/AppContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";
// Placeholder components for tabs - these will be built out later
// import ProjectTasks from '../../components/Project/ProjectTasks';
// import ProjectMilestones from '../../components/Project/ProjectMilestones';
// import ProjectTeamMembers from '../../components/Project/ProjectTeamMembers';
// import ProjectSettings from '../../components/Project/ProjectSettings'; // For editing details form within details page

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`project-tabpanel-${index}`}
      aria-labelledby={`project-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>{children}</Box>
      )}
    </div>
  );
};

const ProjectDetailsPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useAuth();
  const { showNotification, setGlobalLoading } = useAppContext();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);

  const fetchProjectDetails = useCallback(async () => {
    setLoading(true);
    // setGlobalLoading(true);
    try {
      const data = await projectService.getProject(projectId);
      setProject(data);
    } catch (error) {
      showNotification(`Failed to load project: ${error.message}`, "error");
      navigate("/projects"); // Or a specific error page
    } finally {
      setLoading(false);
      // setGlobalLoading(false);
    }
  }, [projectId, showNotification, navigate]);

  useEffect(() => {
    fetchProjectDetails();
  }, [fetchProjectDetails]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const canModify =
    project &&
    currentUser &&
    (isAdmin() || project.ownerId === currentUser.$id);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!project) {
    return (
      <Container>
        <Typography variant="h5" color="error" sx={{ mt: 3 }}>
          Project not found.
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

  const ProjectOverview = ({ projectData }) => (
    <Card variant="outlined">
      <CardHeader title="Project Overview" />
      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Project Name:
            </Typography>
            <Typography variant="body1">{projectData.name}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Status:
            </Typography>
            <Chip
              label={projectData.status}
              size="small"
              color={
                projectData.status === "active"
                  ? "success"
                  : projectData.status === "completed"
                  ? "info"
                  : projectData.status === "on-hold"
                  ? "warning"
                  : "default"
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">
              Description:
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
              {projectData.description || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Start Date:
            </Typography>
            <Typography variant="body1">
              {new Date(projectData.startDate).toLocaleDateString()}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              End Date:
            </Typography>
            <Typography variant="body1">
              {new Date(projectData.endDate).toLocaleDateString()}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Owner ID:
            </Typography>
            <Typography variant="body1">{projectData.ownerId}</Typography>
            {/* TODO: Fetch and display owner name */}
          </Grid>
          {/* Add more fields as needed: team members count, task progress, etc. */}
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg">
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
        <Typography
          color="text.primary"
          sx={{
            maxWidth: "200px", // Adjust as needed
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {project.name}
        </Typography>
      </Breadcrumbs>

      <Paper
        elevation={0}
        sx={{
          border: (theme) => `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            p: { xs: 2, md: 3 },
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            noWrap
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "calc(100% - 150px)",
            }}
          >
            {project.name}
          </Typography>
          {canModify && (
            <Box>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<EditIcon />}
                component={RouterLink}
                to={`/projects/edit/${project.$id}`}
                sx={{ mr: 1 }}
              >
                Edit
              </Button>
              {/* Add Delete button here with confirmation dialog if needed */}
            </Box>
          )}
        </Box>

        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="Project details tabs"
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab
            label="Overview"
            icon={<SettingsIcon />}
            iconPosition="start"
            id="project-tab-0"
            aria-controls="project-tabpanel-0"
          />
          <Tab
            label="Tasks"
            icon={<AssignmentTurnedInIcon />}
            iconPosition="start"
            id="project-tab-1"
            aria-controls="project-tabpanel-1"
          />
          <Tab
            label="Milestones"
            icon={<FlagIcon />}
            iconPosition="start"
            id="project-tab-2"
            aria-controls="project-tabpanel-2"
          />
          <Tab
            label="Team"
            icon={<GroupIcon />}
            iconPosition="start"
            id="project-tab-3"
            aria-controls="project-tabpanel-3"
          />
          {/* <Tab label="Settings" id="project-tab-4" aria-controls="project-tabpanel-4" /> */}
        </Tabs>

        <TabPanel value={currentTab} index={0}>
          <ProjectOverview projectData={project} />
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
          <ProjectTasks projectId={project.$id} />
          <Typography>
            Task management for this project will appear here. (Kanban/List
            view)
          </Typography>
        </TabPanel>
        <TabPanel value={currentTab} index={2}>
          {/* <ProjectMilestones projectId={project.$id} /> */}
          <Typography>
            Milestone tracking for this project will appear here.
          </Typography>
        </TabPanel>
        <TabPanel value={currentTab} index={3}>
          {/* <ProjectTeamMembers projectId={project.$id} projectOwnerId={project.ownerId} /> */}
          <Typography>
            Team member management for this project will appear here.
          </Typography>
        </TabPanel>
        {/* <TabPanel value={currentTab} index={4}>
          <ProjectSettings projectData={project} onUpdate={fetchProjectDetails} />
        </TabPanel> */}
      </Paper>
    </Container>
  );
};

export default ProjectDetailsPage;

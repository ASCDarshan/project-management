// src/pages/Dashboard/DashboardPage.jsx
import React, { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  Paper,
  Box,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Chip,
  Button,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FlagIcon from "@mui/icons-material/Flag"; // For Milestones
import BarChartIcon from "@mui/icons-material/BarChart";
import AddIcon from "@mui/icons-material/Add";
import { Link as RouterLink } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import { useAppContext } from "../../contexts/AppContext";
import { projectService } from "../../services/projectService";
import { taskService } from "../../services/taskService"; // We'll create this next
import LoadingSpinner from "../../components/common/LoadingSpinner";

const DashboardPage = () => {
  const { currentUser, isAdmin } = useAuth();
  const { showNotification, setGlobalLoading } = useAppContext(); // Use global loading for initial fetch
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [milestones, setMilestones] = useState([]); // Placeholder for milestones
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;
      setGlobalLoading(true); // Use global loading indicator
      setLoading(true);
      try {
        const projectData = await projectService.listProjects(
          currentUser.$id,
          isAdmin()
        );
        setProjects(projectData.documents.slice(0, 5)); // Show recent 5 projects

        // Fetch tasks (This service and function needs to be created)
        // For simplicity, let's assume taskService.listUserTasks exists
        // and fetches tasks assigned to the current user or all tasks for admin.
        // const taskData = await taskService.listUserTasks(currentUser.$id, isAdmin(), { limit: 5, status: 'upcoming' });
        // setTasks(taskData.documents);

        // Fetch milestones (similar placeholder)
        // const milestoneData = await milestoneService.listUpcomingMilestones({ limit: 3 });
        // setMilestones(milestoneData.documents);

        showNotification("Dashboard data loaded!", "success");
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        showNotification(
          `Failed to load dashboard data: ${error.message}`,
          "error"
        );
      } finally {
        setLoading(false);
        setGlobalLoading(false);
      }
    };

    fetchData();
  }, [currentUser, isAdmin, showNotification, setGlobalLoading]);

  if (loading && !projects.length) {
    // Show spinner only on initial full load
    return <LoadingSpinner />;
  }

  const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ display: "flex", alignItems: "center", p: 2, height: "100%" }}>
      <Avatar
        sx={{ bgcolor: color || "primary.main", mr: 2, width: 56, height: 56 }}
      >
        {icon}
      </Avatar>
      <Box>
        <Typography variant="h6" component="div">
          {value}
        </Typography>
        <Typography color="text.secondary">{title}</Typography>
      </Box>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: "bold" }}>
        Welcome back, {currentUser?.name || "User"}!
      </Typography>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Projects"
            value={projects.length}
            icon={<FolderIcon />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Tasks"
            value={tasks.filter((t) => t.status !== "done").length}
            icon={<AssignmentIcon />}
            color="secondary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Upcoming Milestones"
            value={milestones.length}
            icon={<FlagIcon />}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            component={RouterLink}
            to="/projects/new"
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ height: "100%", width: "100%", fontSize: "1.1rem" }}
            color="primary"
          >
            New Project
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Projects */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardHeader
              title="Recent Projects"
              action={
                <Button component={RouterLink} to="/projects">
                  View All
                </Button>
              }
            />
            <CardContent>
              {loading && !projects.length ? (
                <LoadingSpinner />
              ) : projects.length > 0 ? (
                <List>
                  {projects.map((project, index) => (
                    <React.Fragment key={project.$id}>
                      <ListItem
                        button
                        component={RouterLink}
                        to={`/projects/${project.$id}`}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: "primary.light" }}>
                            <FolderIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={project.name}
                          secondary={`Status: ${project.status} | Due: ${
                            project.endDate
                              ? new Date(project.endDate).toLocaleDateString()
                              : "N/A"
                          }`}
                        />
                        <Chip
                          label={project.status}
                          size="small"
                          color={
                            project.status === "active" ? "success" : "default"
                          }
                        />
                      </ListItem>
                      {index < projects.length - 1 && (
                        <Divider variant="inset" component="li" />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary">
                  No recent projects found.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Tasks (Placeholder until Task module is built) */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardHeader
              title="My Upcoming Tasks"
              action={
                <Button component={RouterLink} to="/projects">
                  View Tasks
                </Button>
              } // Link to a general task view or project
            />
            <CardContent>
              {loading && !tasks.length ? (
                <LoadingSpinner />
              ) : tasks.length > 0 ? (
                <List>
                  {tasks.slice(0, 5).map((task, index) => (
                    <React.Fragment key={task.$id}>
                      <ListItem
                        button
                        // component={RouterLink} to={`/projects/${task.projectId}/tasks/${task.$id}`} // Needs task detail route
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: "secondary.light" }}>
                            <AssignmentIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={task.title}
                          secondary={`Due: ${
                            task.dueDate
                              ? new Date(task.dueDate).toLocaleDateString()
                              : "N/A"
                          } | Priority: ${task.priority}`}
                        />
                        <Chip label={task.status} size="small" />
                      </ListItem>
                      {index < tasks.length - 1 && (
                        <Divider variant="inset" component="li" />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary">
                  No upcoming tasks assigned to you.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* More sections can be added: Milestone Progress, Team Activity etc. */}
      </Grid>
    </Box>
  );
};

export default DashboardPage;

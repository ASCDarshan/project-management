// src/components/Project/ProjectTasks.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import TaskForm from "../Task/TaskForm";
import TaskItem from "../Task/TaskItem"; // Simple list item for now
// import TaskBoard from '../Task/TaskBoard'; // For Kanban view later
import { taskService } from "../../services/taskService";
import { useAuth } from "../../contexts/AuthContext";
import { useAppContext } from "../../contexts/AppContext";
// We might need project members and milestones for the TaskForm dropdowns
// import { projectService } from '../../services/projectService'; // (or userService for members)
// import { milestoneService } from '../../services/milestoneService';

const taskStatuses = ["all", "todo", "inprogress", "review", "done", "blocked"];

const ProjectTasks = ({ projectId }) => {
  const { currentUser } = useAuth();
  const { showNotification, setGlobalLoading } = useAppContext();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // Task object to edit

  const [filterStatus, setFilterStatus] = useState("all");
  // const [filterAssignee, setFilterAssignee] = useState('all'); // Add later
  // const [viewMode, setViewMode] = useState('list'); // 'list' or 'board'

  const [projectMembers, setProjectMembers] = useState([]); // For assignee dropdown
  const [projectMilestones, setProjectMilestones] = useState([]); // For milestone dropdown

  const [deleteTaskConfirmOpen, setDeleteTaskConfirmOpen] = useState(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState(null);

  // TODO: Fetch project members and milestones for dropdowns in TaskForm
  // This is a simplified placeholder. You'd typically fetch these once when ProjectTasks mounts
  // or get them from the parent ProjectDetailsPage if already loaded there.
  useEffect(() => {
    const fetchSupportingData = async () => {
      // Placeholder: In a real app, fetch project members (users associated with this project)
      // and project milestones.
      // e.g., setProjectMembers(await userService.getUsersForProject(projectId));
      // e.g., setProjectMilestones(await milestoneService.getMilestonesForProject(projectId));
      // For now, using empty arrays.
    };
    if (projectId) {
      fetchSupportingData();
    }
  }, [projectId]);

  const fetchTasks = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const filters = {};
      if (filterStatus !== "all") {
        filters.status = filterStatus;
      }
      // Add other filters like assignee here

      const data = await taskService.listTasksByProject(projectId, filters);
      setTasks(data.documents);
    } catch (error) {
      showNotification(`Failed to load tasks: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  }, [projectId, filterStatus, showNotification]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleOpenForm = (task = null) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const handleSubmitTask = async (taskData, taskIdToUpdate) => {
    setGlobalLoading(true);
    try {
      if (taskIdToUpdate) {
        // Editing task
        await taskService.updateTask(taskIdToUpdate, taskData);
        showNotification("Task updated successfully!", "success");
      } else {
        // Creating new task
        const dataWithCreator = { ...taskData, creatorId: currentUser.$id };
        await taskService.createTask(dataWithCreator);
        showNotification("Task created successfully!", "success");
      }
      fetchTasks(); // Refresh task list
      handleCloseForm();
    } catch (error) {
      showNotification(`Task operation failed: ${error.message}`, "error");
    } finally {
      setGlobalLoading(false);
    }
  };

  const confirmDeleteTask = (taskId) => {
    setTaskToDeleteId(taskId);
    setDeleteTaskConfirmOpen(true);
  };

  const handleDeleteTask = async () => {
    if (!taskToDeleteId) return;
    setGlobalLoading(true);
    try {
      await taskService.deleteTask(taskToDeleteId);
      showNotification("Task deleted successfully", "success");
      fetchTasks(); // Refresh list
    } catch (error) {
      showNotification(`Error deleting task: ${error.message}`, "error");
    } finally {
      setGlobalLoading(false);
      setDeleteTaskConfirmOpen(false);
      setTaskToDeleteId(null);
    }
  };

  // Simple List View for now
  const renderTaskList = () => (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      {tasks.map((task) => (
        <Grid item xs={12} sm={6} md={4} key={task.$id}>
          <TaskItem
            task={task}
            onEdit={handleOpenForm}
            onDelete={confirmDeleteTask}
            projectMembers={projectMembers}
          />
        </Grid>
      ))}
    </Grid>
  );

  // Placeholder for Kanban Board
  // const renderTaskBoard = () => (
  //   <TaskBoard tasks={tasks} projectId={projectId} onTaskUpdate={fetchTasks} projectMembers={projectMembers} />
  // );

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h5">Tasks</Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="task-status-filter-label">
              Filter by Status
            </InputLabel>
            <Select
              labelId="task-status-filter-label"
              value={filterStatus}
              label="Filter by Status"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              {taskStatuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Toggle for List/Board view can go here */}
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenForm()}
          >
            Add Task
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
          <CircularProgress />
        </Box>
      ) : tasks.length === 0 ? (
        <Typography sx={{ mt: 2, textAlign: "center" }} color="text.secondary">
          No tasks found for the current filter. Try creating one!
        </Typography>
      ) : (
        // viewMode === 'list' ? renderTaskList() : renderTaskBoard()
        renderTaskList() // Default to list view
      )}

      {isFormOpen && (
        <TaskForm
          open={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleSubmitTask}
          taskData={editingTask}
          projectId={projectId}
          projectMembers={projectMembers} // Pass these down
          projectMilestones={projectMilestones} // Pass these down
        />
      )}

      {/* Delete Confirmation Dialog for Tasks */}
      <Dialog
        open={deleteTaskConfirmOpen}
        onClose={() => setDeleteTaskConfirmOpen(false)}
      >
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this task? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTaskConfirmOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleDeleteTask} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectTasks;

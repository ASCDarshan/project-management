// src/components/Task/TaskForm.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CloseIcon from "@mui/icons-material/Close";
// import Autocomplete from '@mui/material/Autocomplete';
// import { userService } from '../../services/userService'; // To fetch users for assignee field
// import { milestoneService } from '../../services/milestoneService'; // To fetch milestones for linking

const priorities = ["low", "medium", "high", "urgent"];
const statuses = ["todo", "inprogress", "review", "done", "blocked"];

const TaskForm = ({
  open,
  onClose,
  onSubmit,
  taskData,
  projectId,
  projectMembers = [],
  projectMilestones = [],
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("todo");
  const [milestoneId, setMilestoneId] = useState("");
  // const [allProjectMembers, setAllProjectMembers] = useState([]); // If fetching separately
  // const [allProjectMilestones, setAllProjectMilestones] = useState([]); // If fetching separately

  useEffect(() => {
    if (taskData) {
      // Editing existing task
      setTitle(taskData.title || "");
      setDescription(taskData.description || "");
      setAssigneeId(taskData.assigneeId || "");
      setDueDate(taskData.dueDate ? new Date(taskData.dueDate) : null);
      setPriority(taskData.priority || "medium");
      setStatus(taskData.status || "todo");
      setMilestoneId(taskData.milestoneId || "");
    } else {
      // Creating new task
      setTitle("");
      setDescription("");
      setAssigneeId("");
      setDueDate(null);
      setPriority("medium");
      setStatus("todo");
      setMilestoneId("");
    }
  }, [taskData, open]); // Reset form when 'open' or 'taskData' changes

  // Example: Fetch project members and milestones if not passed as props
  // useEffect(() => {
  //   if (open && projectId) {
  //     const fetchData = async () => {
  //       try {
  //         // const members = await userService.listProjectMembers(projectId); // Needs implementation
  //         // setAllProjectMembers(members.documents);
  //         // const milestones = await milestoneService.listMilestonesByProject(projectId); // Needs implementation
  //         // setAllProjectMilestones(milestones.documents);
  //       } catch (error) {
  //         console.error("Failed to fetch members/milestones for task form", error);
  //       }
  //     };
  //     fetchData();
  //   }
  // }, [open, projectId]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title) {
      alert("Task title is required."); // Replace with proper notification
      return;
    }
    const data = {
      title,
      description,
      assigneeId: assigneeId || null, // Ensure null if empty for Appwrite
      dueDate: dueDate ? dueDate.toISOString() : null,
      priority,
      status,
      projectId, // Always link to current project
      milestoneId: milestoneId || null, // Ensure null if empty
    };
    onSubmit(data, taskData ? taskData.$id : null); // Pass ID if editing
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ component: "form", onSubmit: handleSubmit }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {taskData ? "Edit Task" : "Create New Task"}
        <IconButton aria-label="close" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="assignee-label">Assignee (Optional)</InputLabel>
              <Select
                labelId="assignee-label"
                label="Assignee (Optional)"
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
              >
                <MenuItem value="">
                  <em>Unassigned</em>
                </MenuItem>
                {projectMembers.map(
                  (
                    member // Assuming projectMembers is an array of user objects
                  ) => (
                    <MenuItem key={member.$id} value={member.$id}>
                      {member.name || member.email}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
            {/* TODO: Replace with Autocomplete for better UX if many members */}
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Due Date (Optional)"
              value={dueDate}
              onChange={setDueDate}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel id="priority-label">Priority</InputLabel>
              <Select
                labelId="priority-label"
                label="Priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                {priorities.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {statuses.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="milestone-label">
                Link to Milestone (Optional)
              </InputLabel>
              <Select
                labelId="milestone-label"
                label="Link to Milestone (Optional)"
                value={milestoneId}
                onChange={(e) => setMilestoneId(e.target.value)}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {projectMilestones.map(
                  (
                    milestone // Assuming projectMilestones is an array of milestone objects
                  ) => (
                    <MenuItem key={milestone.$id} value={milestone.$id}>
                      {milestone.name}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: "16px 24px" }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained">
          {taskData ? "Save Changes" : "Create Task"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskForm;

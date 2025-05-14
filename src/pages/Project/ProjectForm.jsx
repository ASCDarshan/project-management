// src/components/Project/ProjectForm.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Grid,
  Typography,
  MenuItem,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// For user selection, you might need an Autocomplete if you have many users
// import Autocomplete from '@mui/material/Autocomplete';
// import { userService } from '../../services/userService'; // To fetch users for assignment

const ProjectForm = ({
  onSubmit,
  initialData = null,
  isLoading,
  submitButtonText = "Create Project",
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [status, setStatus] = useState("active");
  // const [assignedMembers, setAssignedMembers] = useState([]); // For Appwrite Team memberships or memberIds array
  // const [allUsers, setAllUsers] = useState([]); // For Autocomplete

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
      setStartDate(
        initialData.startDate ? new Date(initialData.startDate) : null
      );
      setEndDate(initialData.endDate ? new Date(initialData.endDate) : null);
      setStatus(initialData.status || "active");
      // setAssignedMembers(initialData.memberIds || []); // If using memberIds
    }
  }, [initialData]);

  // Example: Fetch users for assignment (if you have a userService and user collection)
  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       const usersData = await userService.listUsers(); // Assuming this function exists
  //       setAllUsers(usersData.documents);
  //     } catch (error) {
  //       console.error("Failed to fetch users for assignment", error);
  //     }
  //   };
  //   fetchUsers();
  // }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name || !startDate || !endDate) {
      alert("Name, Start Date, and End Date are required."); // Replace with proper notification
      return;
    }
    if (endDate < startDate) {
      alert("End Date cannot be before Start Date."); // Replace with proper notification
      return;
    }

    const projectData = {
      name,
      description,
      startDate: startDate ? startDate.toISOString() : null,
      endDate: endDate ? endDate.toISOString() : null,
      status,
      // memberIds: assignedMembers.map(user => user.$id || user), // if using memberIds and users are objects
    };
    onSubmit(projectData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <Typography variant="h6" gutterBottom>
        {initialData ? "Edit Project Details" : "Create New Project"}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="name"
            label="Project Name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="description"
            label="Description"
            name="description"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DatePicker
            label="Start Date *"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            slotProps={{ textField: { fullWidth: true, required: true } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DatePicker
            label="End Date *"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            slotProps={{ textField: { fullWidth: true, required: true } }}
            minDate={startDate} // Prevent end date before start date
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            required
            fullWidth
            id="status"
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {["active", "on-hold", "completed", "cancelled"].map((option) => (
              <MenuItem key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* User Assignment Example (using Autocomplete - requires `allUsers` state and `userService`)
        <Grid item xs={12}>
          <Autocomplete
            multiple
            id="assignedMembers"
            options={allUsers} // Populate this with user objects from Appwrite
            getOptionLabel={(option) => option.name || option.email} // Adjust based on your user data
            value={allUsers.filter(user => assignedMembers.includes(user.$id))}
            onChange={(event, newValue) => {
              setAssignedMembers(newValue.map(user => user.$id));
            }}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                label="Assign Members"
                placeholder="Select members"
              />
            )}
          />
        </Grid>
        */}
      </Grid>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2, py: 1.5 }}
        disabled={isLoading}
      >
        {isLoading
          ? "Submitting..."
          : submitButtonText ||
            (initialData ? "Save Changes" : "Create Project")}
      </Button>
    </Box>
  );
};

export default ProjectForm;

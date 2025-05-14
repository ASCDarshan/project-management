// src/pages/Project/ProjectListPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Menu,
  MenuItem,
  TextField,
  Grid,
  InputAdornment,
  LinearProgress, // For DataGrid loading
} from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarExport,
} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";

import { projectService } from "../../services/projectService";
import { useAuth } from "../../contexts/AuthContext";
import { useAppContext } from "../../contexts/AppContext";


const ProjectListPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser, isAdmin } = useAuth();
  const { showNotification, setGlobalLoading } = useAppContext();
  const navigate = useNavigate();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentProjectActionsId, setCurrentProjectActionsId] = useState(null);

  const [searchText, setSearchText] = useState("");

  const fetchProjects = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    // setGlobalLoading(true); // Optional: use global loading for list refreshes
    try {
      const data = await projectService.listProjects(
        currentUser.$id,
        isAdmin()
      );
      setProjects(data.documents);
    } catch (error) {
      showNotification(`Failed to load projects: ${error.message}`, "error");
    } finally {
      setLoading(false);
      // setGlobalLoading(false);
    }
  }, [currentUser, isAdmin, showNotification]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDelete = async () => {
    if (!selectedProjectId) return;
    setGlobalLoading(true);
    try {
      await projectService.deleteProject(selectedProjectId);
      showNotification("Project deleted successfully", "success");
      fetchProjects(); // Refresh list
    } catch (error) {
      showNotification(`Error deleting project: ${error.message}`, "error");
    } finally {
      setGlobalLoading(false);
      setDeleteDialogOpen(false);
      setSelectedProjectId(null);
    }
  };

  const openDeleteDialog = (id) => {
    setSelectedProjectId(id);
    setDeleteDialogOpen(true);
    handleCloseActionsMenu();
  };

  const handleOpenActionsMenu = (event, projectId) => {
    setAnchorEl(event.currentTarget);
    setCurrentProjectActionsId(projectId);
  };

  const handleCloseActionsMenu = () => {
    setAnchorEl(null);
    setCurrentProjectActionsId(null);
  };

  const handleEdit = (id) => {
    // Navigate to an edit page or open an edit modal
    // For now, let's assume ProjectCreatePage can handle editing if an ID is passed
    navigate(`/projects/${id}/edit`); // You'd need to create this route/page or adjust ProjectCreatePage
    handleCloseActionsMenu();
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchText.toLowerCase()) ||
      (project.description &&
        project.description.toLowerCase().includes(searchText.toLowerCase()))
  );

  const columns = [
    {
      field: "name",
      headerName: "Project Name",
      flex: 2,
      renderCell: (params) => (
        <Typography
          variant="subtitle2"
          component={RouterLink}
          to={`/projects/${params.row.$id}`}
          sx={{
            textDecoration: "none",
            color: "inherit",
            "&:hover": { color: "primary.main" },
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => {
        let color = "default";
        if (params.value === "active") color = "success";
        else if (params.value === "completed") color = "info";
        else if (params.value === "on-hold") color = "warning";
        return <Chip label={params.value} color={color} size="small" />;
      },
    },
    {
      field: "startDate",
      headerName: "Start Date",
      flex: 1,
      type: "date",
      valueGetter: (value) => (value ? new Date(value) : null),
    },
    {
      field: "endDate",
      headerName: "End Date",
      flex: 1,
      type: "date",
      valueGetter: (value) => (value ? new Date(value) : null),
    },
    {
      field: "ownerId",
      headerName: "Owner",
      flex: 1,
      valueGetter: (value, row) => row.owner?.name || value, // Assuming owner object might be populated later
      // For now, it's just an ID. You'd need to fetch user details.
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        // RBAC: Conditionally show Edit/Delete based on ownership or admin role
        const canModify = isAdmin() || params.row.ownerId === currentUser?.$id;
        return (
          <Box>
            <Tooltip title="View Details">
              <IconButton
                onClick={() => navigate(`/projects/${params.row.$id}`)}
                color="primary"
                size="small"
              >
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
            {canModify && (
              <>
                <Tooltip title="Edit">
                  <IconButton
                    onClick={() => navigate(`/projects/edit/${params.row.$id}`)} // Make sure this route exists for edit form
                    color="secondary"
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    onClick={() => openDeleteDialog(params.row.$id)}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
            {/* Alternative: More Actions Menu */}
            {/* <IconButton
                    aria-label="more actions"
                    onClick={(event) => handleOpenActionsMenu(event, params.row.$id)}
                    size="small"
                >
                    <MoreVertIcon />
                </IconButton> */}
          </Box>
        );
      },
    },
  ];

  // DataGrid requires an 'id' field. Appwrite uses '$id'.
  const rows = filteredProjects.map((p) => ({ ...p, id: p.$id }));

  function CustomToolbar() {
    return (
      <GridToolbarContainer sx={{ p: 1, justifyContent: "space-between" }}>
        <Box>
          <GridToolbarFilterButton />
          <GridToolbarExport />
        </Box>
        <TextField
          variant="standard"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search projects…"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </GridToolbarContainer>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          Projects
        </Typography>
        {/* RBAC: Show "Create" button only to users who can create projects (e.g., admins or all logged-in users) */}
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={RouterLink}
          to="/projects/new"
        >
          Create Project
        </Button>
      </Box>

      <Box sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          loading={loading}
          slots={{
            toolbar: CustomToolbar,
            loadingOverlay: LinearProgress,
          }}
          // density="compact" // For a more compact view
          // checkboxSelection // If you need bulk actions
          disableRowSelectionOnClick
          getRowId={(row) => row.$id} // Important for Appwrite
        />
      </Box>

      {/* Actions Menu (if using MoreVertIcon approach) */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl) && Boolean(currentProjectActionsId)}
        onClose={handleCloseActionsMenu}
      >
        <MenuItem
          onClick={() => navigate(`/projects/${currentProjectActionsId}`)}
        >
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          View Details
        </MenuItem>
        {/* RBAC for Edit/Delete in menu */}
        {(isAdmin() ||
          projects.find((p) => p.$id === currentProjectActionsId)?.ownerId ===
            currentUser?.$id) && [
          <MenuItem
            key="edit"
            onClick={() => handleEdit(currentProjectActionsId)}
          >
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            Edit
          </MenuItem>,
          <MenuItem
            key="delete"
            onClick={() => openDeleteDialog(currentProjectActionsId)}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            Delete
          </MenuItem>,
        ]}
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Project</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this project? This action cannot be
            undone. All associated tasks and milestones might also be affected.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ProjectListPage;

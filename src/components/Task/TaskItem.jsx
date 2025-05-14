// src/components/Task/TaskItem.jsx
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Avatar,
  Tooltip,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person"; // For assignee
import { avatars } from "../../services/appwriteConfig"; // For assignee initials
import { formatDistanceToNow } from "date-fns";

const TaskItem = ({ task, onEdit, onDelete, projectMembers = [] }) => {
  const assignee = projectMembers.find(
    (member) => member.$id === task.assigneeId
  );
  const assigneeName = assignee?.name || assignee?.email || "Unassigned";
  const assigneeInitials = assignee?.name
    ? avatars.getInitials(assignee.name).href
    : null;

  let priorityColor = "default";
  if (task.priority === "high") priorityColor = "warning";
  if (task.priority === "urgent") priorityColor = "error";

  let statusColor = "default";
  if (task.status === "todo") statusColor = "info";
  if (task.status === "inprogress") statusColor = "secondary";
  if (task.status === "done") statusColor = "success";

  return (
    <Card sx={{ mb: 2, "&:hover": { boxShadow: 6 } }} elevation={3}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: "pointer" }}
            onClick={() => onEdit(task)}
          >
            {task.title}
          </Typography>
          <Box>
            <Tooltip title="Edit Task">
              <IconButton
                size="small"
                onClick={() => onEdit(task)}
                color="primary"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Task">
              <IconButton
                size="small"
                onClick={() => onDelete(task.$id)}
                color="error"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        {task.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, whiteSpace: "pre-wrap" }}
          >
            {task.description.substring(0, 100)}
            {task.description.length > 100 ? "..." : ""}
          </Typography>
        )}
        <Box
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Chip
              label={task.status}
              size="small"
              color={statusColor}
              variant="outlined"
            />
            <Chip
              label={`Priority: ${task.priority}`}
              size="small"
              color={priorityColor}
              variant="outlined"
            />
          </Box>
          {task.dueDate && (
            <Typography variant="caption" color="text.secondary">
              Due: {new Date(task.dueDate).toLocaleDateString()} (
              {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
              )
            </Typography>
          )}
        </Box>
        <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
          {assigneeInitials ? (
            <Tooltip title={`Assigned to: ${assigneeName}`}>
              <Avatar
                src={assigneeInitials}
                sx={{ width: 28, height: 28, fontSize: "0.8rem", mr: 1 }}
              />
            </Tooltip>
          ) : (
            <Tooltip title={`Assigned to: ${assigneeName}`}>
              <Avatar
                sx={{ width: 28, height: 28, bgcolor: "grey.400", mr: 1 }}
              >
                <PersonIcon fontSize="small" />
              </Avatar>
            </Tooltip>
          )}
          <Typography variant="caption">{assigneeName}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskItem;

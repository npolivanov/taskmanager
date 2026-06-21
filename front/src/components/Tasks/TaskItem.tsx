import { Paper, Box, Typography, Chip, IconButton } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { type Task, statusLabels, statusColors } from "./types";

interface TaskItemProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}

export const TaskItem = ({ task, onEdit, onDelete }: TaskItemProps) => {
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6">{task.title}</Typography>
          {task.description && (
            <Typography variant="body2" color="textSecondary">
              {task.description}
            </Typography>
          )}
          <Chip
            label={statusLabels[task.status]}
            color={statusColors[task.status]}
            size="small"
            sx={{ mt: 1 }}
          />
        </Box>
        <Box>
          <IconButton onClick={onEdit} color="primary">
            <EditIcon />
          </IconButton>
          <IconButton onClick={onDelete} color="error">
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

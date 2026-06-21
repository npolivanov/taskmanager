import {
  Box,
  CircularProgress,
  Alert,
  Paper,
  Typography,
  List,
} from "@mui/material";
import { TaskItem } from "./TaskItem";
import type { Task, TaskStatus } from "./types";

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  error: Error | null;
  filterStatus: TaskStatus | "";
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export const TaskList = ({
  tasks,
  isLoading,
  error,
  filterStatus,
  onEdit,
  onDelete,
}: TaskListProps) => {
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error.message}
      </Alert>
    );
  }

  if (tasks.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="body1" color="textSecondary">
          {filterStatus
            ? "Нет задач с выбранным статусом"
            : "Задач пока нет. Создайте первую!"}
        </Typography>
      </Paper>
    );
  }

  return (
    <List>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={() => onEdit(task)}
          onDelete={() => onDelete(task)}
        />
      ))}
    </List>
  );
};

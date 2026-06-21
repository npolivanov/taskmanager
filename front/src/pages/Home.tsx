import { useState } from "react";
import {
  Container,
  Paper,
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from "../hooks/useTasks";
import { TaskList } from "../components/Tasks/TaskList";
import { TaskFormDialog } from "../components/Tasks/TaskFormDialog";
import { TaskDeleteDialog } from "../components/Tasks/TaskDeleteDialog";
import type {
  Task,
  TaskStatus,
  CreateTaskRequest,
  UpdateTaskRequest,
} from "../components/Tasks/types";

export const Home = () => {
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "">("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const {
    data: tasks = [],
    isLoading,
    error,
  } = useTasks(filterStatus || undefined);
  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask();
  const deleteMutation = useDeleteTask();

  const handleCreate = (data: CreateTaskRequest | UpdateTaskRequest) => {
    createMutation.mutate(data as CreateTaskRequest, {
      onSuccess: () => setIsCreateDialogOpen(false),
    });
  };

  const handleUpdate = (data: UpdateTaskRequest) => {
    if (editingTask) {
      updateMutation.mutate(
        { id: editingTask.id, data },
        {
          onSuccess: () => setEditingTask(null),
        },
      );
    }
  };

  const handleDelete = () => {
    if (deletingTask) {
      deleteMutation.mutate(deletingTask.id, {
        onSuccess: () => setDeletingTask(null),
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const user = localStorage.getItem("user");
  const userData = user ? JSON.parse(user) : null;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Шапка */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            Мои задачи
          </Typography>
          {userData && (
            <Typography variant="body2" color="textSecondary">
              Пользователь: {userData.login}
            </Typography>
          )}
        </Box>
        <Button variant="outlined" color="secondary" onClick={handleLogout}>
          Выйти
        </Button>
      </Box>

      {/* Панель управления */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Фильтр по статусу</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value as TaskStatus | "")
              }
              label="Фильтр по статусу"
            >
              <MenuItem value="">Все</MenuItem>
              <MenuItem value="created">Создана</MenuItem>
              <MenuItem value="in_progress">В процессе</MenuItem>
              <MenuItem value="done">Готова</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsCreateDialogOpen(true)}
          >
            Создать задачу
          </Button>
        </Box>
      </Paper>

      {/* Список задач */}
      <TaskList
        tasks={tasks}
        isLoading={isLoading}
        error={error}
        filterStatus={filterStatus}
        onEdit={setEditingTask}
        onDelete={setDeletingTask}
      />

      {/* Диалог создания */}
      <TaskFormDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
        isEdit={false}
      />

      {/* Диалог редактирования */}
      {editingTask && (
        <TaskFormDialog
          open={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSubmit={handleUpdate}
          initialData={editingTask}
          isLoading={updateMutation.isPending}
          isEdit={true}
        />
      )}

      {/* Диалог удаления */}
      {deletingTask && (
        <TaskDeleteDialog
          open={!!deletingTask}
          onClose={() => setDeletingTask(null)}
          onConfirm={handleDelete}
          isLoading={deleteMutation.isPending}
          taskTitle={deletingTask.title}
        />
      )}
    </Container>
  );
};

export default Home;

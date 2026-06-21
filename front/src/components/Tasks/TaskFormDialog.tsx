import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  CircularProgress,
} from "@mui/material";
import type {
  Task,
  TaskStatus,
  CreateTaskRequest,
  UpdateTaskRequest,
} from "./types";

interface TaskFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskRequest | UpdateTaskRequest) => void;
  initialData?: Task;
  isLoading: boolean;
  isEdit?: boolean;
}

export const TaskFormDialog = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading,
  isEdit = false,
}: TaskFormDialogProps) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [status, setStatus] = useState<TaskStatus>(
    initialData?.status || "created",
  );

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit({ title, description: description || undefined, status });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEdit ? "Редактировать задачу" : "Создать задачу"}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Название"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            disabled={isLoading}
          />
          <TextField
            label="Описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
            disabled={isLoading}
          />
          <FormControl fullWidth>
            <InputLabel>Статус</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              label="Статус"
              disabled={isLoading}
            >
              <MenuItem value="created">Создана</MenuItem>
              <MenuItem value="in_progress">В процессе</MenuItem>
              <MenuItem value="done">Готова</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Отмена
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading || !title.trim()}
        >
          {isLoading ? (
            <CircularProgress size={24} />
          ) : isEdit ? (
            "Сохранить"
          ) : (
            "Создать"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

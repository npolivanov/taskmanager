import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";

interface TaskDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  taskTitle: string;
}

export const TaskDeleteDialog = ({
  open,
  onClose,
  onConfirm,
  isLoading,
  taskTitle,
}: TaskDeleteDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Подтверждение удаления</DialogTitle>
      <DialogContent>
        <Typography>
          Вы уверены, что хотите удалить задачу "{taskTitle}"?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Отмена
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : "Удалить"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export type TaskStatus = "created" | "in_progress" | "done";

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: TaskStatus;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
}

export interface ErrorResponse {
  error: string;
}

export const statusLabels: Record<TaskStatus, string> = {
  created: "Создана",
  in_progress: "В процессе",
  done: "Готова",
};

export const statusColors: Record<
  TaskStatus,
  "default" | "warning" | "success" | "info"
> = {
  created: "default",
  in_progress: "warning",
  done: "success",
};

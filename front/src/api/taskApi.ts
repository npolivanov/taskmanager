import type {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskStatus,
} from "../components/Tasks/types";

const API_BASE_URL = "http://localhost:8080";

export const taskApi = {
  getTasks: async (status?: TaskStatus): Promise<Task[]> => {
    const url = status
      ? `${API_BASE_URL}/api/tasks?status=${status}`
      : `${API_BASE_URL}/api/tasks`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Ошибка загрузки задач");
    return response.json();
  },

  createTask: async (data: CreateTaskRequest): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Ошибка создания задачи");
    }
    return response.json();
  },

  updateTask: async ({
    id,
    data,
  }: {
    id: number;
    data: UpdateTaskRequest;
  }): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Ошибка обновления задачи");
    }
    return response.json();
  },

  deleteTask: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Ошибка удаления задачи");
    }
  },
};

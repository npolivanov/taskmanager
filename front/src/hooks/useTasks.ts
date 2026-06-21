import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi } from "../api/taskApi";
import type { TaskStatus } from "../components/Tasks/types";

export const useTasks = (status?: TaskStatus) => {
  return useQuery({
    queryKey: ["tasks", status],
    queryFn: () => taskApi.getTasks(status),
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: taskApi.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: taskApi.updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: taskApi.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

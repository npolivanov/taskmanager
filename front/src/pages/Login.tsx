import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";

interface LoginRequest {
  login: string;
  password: string;
}

interface LoginResponse {
  id: number;
  login: string;
  password: string;
  role: string;
}

const API_BASE_URL = "http://localhost:8080";

const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Ошибка входа");
  }

  return data;
};

export const Login = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ login, password });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Вход в систему
          </Typography>

          {mutation.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {mutation.error instanceof Error
                ? mutation.error.message
                : "Ошибка входа"}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Логин"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              margin="normal"
              disabled={mutation.isPending}
              required
            />

            <TextField
              fullWidth
              label="Пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              disabled={mutation.isPending}
              required
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={mutation.isPending}
              sx={{ mt: 3 }}
            >
              {mutation.isPending ? <CircularProgress size={24} /> : "Войти"}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

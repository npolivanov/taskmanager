package models

import "time"

type User struct {
    ID       uint   `json:"id" gorm:"primaryKey"`
    Login    string `json:"login" gorm:"unique;not null"`
    Password string `json:"password" gorm:"not null"`
    Role     string `json:"role" gorm:"not null"`
}

type Task struct {
    ID         uint      `json:"id" gorm:"primaryKey"`
    Title      string    `json:"title" gorm:"not null"`
    Status     string    `json:"status" gorm:"default:created"`
    ExecutorID *uint     `json:"executor_id"`
    Executor   *User     `json:"executor,omitempty" gorm:"foreignKey:ExecutorID"`
    CreatedAt  time.Time `json:"created_at"`
    UpdatedAt  time.Time `json:"updated_at"`
}

// Структуры для запросов/ответов
type LoginRequest struct {
    Login    string `json:"login" binding:"required"`
    Password string `json:"password" binding:"required"`
}

type CreateTaskRequest struct {
    Title      string `json:"title" binding:"required"`
    ExecutorID *uint  `json:"executor_id"`
}

type UpdateTaskRequest struct {
    Title      string `json:"title"`
    Status     string `json:"status"`
    ExecutorID *uint  `json:"executor_id"`
}

type ErrorResponse struct {
    Error string `json:"error"`
}
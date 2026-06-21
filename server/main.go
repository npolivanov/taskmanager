package main

import (
	"taskmanager/database"
	"taskmanager/handlers"
	"time"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	_ "taskmanager/docs" // Импорт сгенерированных доков Swagger

	"github.com/gin-contrib/cors"
)

// @title Task Manager API
// @version 1.0
// @description API для управления задачами с ролевой системой
// @host localhost:8080
// @BasePath /api
func main() {
    // Подключаемся к базе
    database.Connect()

    r := gin.Default()

        r.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:5173", "http://localhost:3000"},
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true,
        MaxAge:           12 * time.Hour,
    }))

    // Swagger документация http://localhost:8080/swagger/index.html#/
    r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

    // API endpoints
    api := r.Group("/api")
    {
        api.POST("/login", handlers.Login)
        api.GET("/tasks", handlers.GetTasks)
        api.GET("/tasks/:id", handlers.GetTask)
        api.POST("/tasks", handlers.CreateTask)
        api.PUT("/tasks/:id", handlers.UpdateTask)
        api.DELETE("/tasks/:id", handlers.DeleteTask)
    }

    r.Run(":8080")
}
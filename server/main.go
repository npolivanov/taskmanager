package main

import (
	"taskmanager/database"
	"taskmanager/handlers"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	_ "taskmanager/docs" // Импорт сгенерированных доков Swagger
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
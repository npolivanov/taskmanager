package handlers

import (
	"net/http"
	"taskmanager/database"
	"taskmanager/models"

	"github.com/gin-gonic/gin"
)

// @Summary Вход в систему
// @Description Аутентификация пользователя по логину и паролю
// @Tags auth
// @Accept json
// @Produce json
// @Param request body models.LoginRequest true "Логин и пароль"
// @Success 200 {object} models.User
// @Failure 401 {object} models.ErrorResponse
// @Router /api/login [post]
func Login(c *gin.Context) {
    var req models.LoginRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Неверный формат данных"})
        return
    }

    var user models.User
    result := database.DB.Where("login = ? AND password = ?", req.Login, req.Password).First(&user)
    if result.Error != nil {
        c.JSON(http.StatusUnauthorized, models.ErrorResponse{Error: "Неверный логин или пароль"})
        return
    }

    // Не возвращаем пароль в ответе
    user.Password = ""
    c.JSON(http.StatusOK, user)
}

// @Summary Получить список задач
// @Description Возвращает все задачи с возможностью фильтрации по статусу
// @Tags tasks
// @Produce json
// @Param status query string false "Статус задачи (created/in_progress/done)"
// @Success 200 {array} models.Task
// @Router /api/tasks [get]
func GetTasks(c *gin.Context) {
    var tasks []models.Task
    query := database.DB.Preload("Executor")

    // Фильтрация по статусу
    if status := c.Query("status"); status != "" {
        query = query.Where("status = ?", status)
    }

    query.Find(&tasks)
    c.JSON(http.StatusOK, tasks)
}

// @Summary Получить задачу по ID
// @Description Возвращает задачу по её идентификатору
// @Tags tasks
// @Produce json
// @Param id path int true "ID задачи"
// @Success 200 {object} models.Task
// @Failure 404 {object} models.ErrorResponse
// @Router /api/tasks/{id} [get]
func GetTask(c *gin.Context) {
    id := c.Param("id")
    
    var task models.Task
    result := database.DB.Preload("Executor").First(&task, id)
    if result.Error != nil {
        c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "Задача не найдена"})
        return
    }

    c.JSON(http.StatusOK, task)
}

// @Summary Создать задачу
// @Description Создание новой задачи
// @Tags tasks
// @Accept json
// @Produce json
// @Param request body models.CreateTaskRequest true "Данные задачи"
// @Success 201 {object} models.Task
// @Failure 400 {object} models.ErrorResponse
// @Router /api/tasks [post]
func CreateTask(c *gin.Context) {
    var req models.CreateTaskRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Неверный формат данных"})
        return
    }

    task := models.Task{
        Title:      req.Title,
        Status:     "created",
        ExecutorID: req.ExecutorID,
    }

    if err := database.DB.Create(&task).Error; err != nil {
        c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Ошибка при создании задачи"})
        return
    }

    // Подгружаем связанные данные
    database.DB.Preload("Executor").First(&task, task.ID)
    
    c.JSON(http.StatusCreated, task)
}

// @Summary Обновить задачу
// @Description Обновление существующей задачи
// @Tags tasks
// @Accept json
// @Produce json
// @Param id path int true "ID задачи"
// @Param request body models.UpdateTaskRequest true "Данные для обновления"
// @Success 200 {object} models.Task
// @Failure 404 {object} models.ErrorResponse
// @Router /api/tasks/{id} [put]
func UpdateTask(c *gin.Context) {
    id := c.Param("id")
    
    var task models.Task
    if err := database.DB.First(&task, id).Error; err != nil {
        c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "Задача не найдена"})
        return
    }

    var req models.UpdateTaskRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Неверный формат данных"})
        return
    }

    // Валидация статуса
    validStatuses := map[string]bool{"created": true, "in_progress": true, "done": true}
    if req.Status != "" && !validStatuses[req.Status] {
        c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Неверный статус. Допустимые: created, in_progress, done"})
        return
    }

    updates := map[string]interface{}{}
    if req.Title != "" {
        updates["title"] = req.Title
    }
    if req.Status != "" {
        updates["status"] = req.Status
    }
    if req.ExecutorID != nil {
        updates["executor_id"] = req.ExecutorID
    }

    database.DB.Model(&task).Updates(updates)
    database.DB.Preload("Executor").First(&task, id)

    c.JSON(http.StatusOK, task)
}

// @Summary Удалить задачу
// @Description Удаление задачи по ID
// @Tags tasks
// @Param id path int true "ID задачи"
// @Success 204 "No Content"
// @Failure 404 {object} models.ErrorResponse
// @Router /api/tasks/{id} [delete]
func DeleteTask(c *gin.Context) {
    id := c.Param("id")
    
    if err := database.DB.Delete(&models.Task{}, id).Error; err != nil {
        c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "Задача не найдена"})
        return
    }

    c.Status(http.StatusNoContent)
}
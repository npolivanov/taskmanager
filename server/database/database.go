package database

import (
	"log"
	"taskmanager/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
    dsn := "host=localhost user=taskmanager password=qwerty dbname=taskdb port=5432 sslmode=disable"
    
    var err error
    DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        log.Fatal("Failed to connect to database:", err)
    }

    // Auto migrate
    err = DB.AutoMigrate(&models.User{}, &models.Task{})
    if err != nil {
        log.Fatal("Failed to migrate database:", err)
    }

    log.Println("Database connected successfully!")
}
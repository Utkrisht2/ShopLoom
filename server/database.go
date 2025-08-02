// backend/database.go
package main

import (
	"github.com/glebarez/sqlite" // <--- Use the new CGO-FREE driver
	"gorm.io/gorm"
	"log"
)

var DB *gorm.DB

func ConnectDatabase() {
	// No other changes are needed here. The function call is identical.
	database, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database!", err)
	}

	err = database.AutoMigrate(&User{}, &Item{}, &Cart{}, &Order{})
	if err != nil {
		log.Fatal("Failed to migrate database!", err)
	}

	DB = database
}

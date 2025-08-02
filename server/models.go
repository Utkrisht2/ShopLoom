// backend/models.go
package main

import (
	"time"
)

// We are using uint for IDs. GORM uses it by default.

type User struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Username  string    `gorm:"unique;not null" json:"username"`
	Password  string    `gorm:"not null" json:"-"` // Hide password in JSON responses
	Token     string    `gorm:"unique" json:"-"`   // Hide token in user list
	CartID    *uint     `json:"cart_id,omitempty"` // Nullable foreign key
	CreatedAt time.Time `json:"created_at"`
}

type Item struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `gorm:"not null" json:"name"`
	Status    string    `json:"status"` // e.g., "available"
	CreatedAt time.Time `json:"created_at"`
}

type Cart struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `gorm:"not null" json:"user_id"`
	User      User      `gorm:"foreignKey:UserID" json:"-"` // Belongs to User
	Items     []*Item   `gorm:"many2many:cart_items;" json:"items"`
	Status    string    `json:"status"` // e.g., "active", "ordered"
	CreatedAt time.Time `json:"created_at"`
}

type Order struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	CartID    uint      `gorm:"unique;not null" json:"cart_id"` // An order is created from one cart
	UserID    uint      `gorm:"not null" json:"user_id"`
	User      User      `gorm:"foreignKey:UserID" json:"-"`
	CreatedAt time.Time `json:"created_at"`
}
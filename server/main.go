// backend/main.go
package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

// CORSMiddleware allows requests from our React frontend
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}
}

func main() {
	// Initialize database
	ConnectDatabase()

	// Initialize Gin router
	r := gin.Default()
	r.Use(CORSMiddleware())

	// Public routes
	r.POST("/users", CreateUser)
	r.POST("/users/login", Login)
	r.POST("/items", CreateItem)
	r.GET("/items", ListItems)

	// Admin/debug routes (can be restricted further)
	r.GET("/users", ListUsers)
	r.GET("/carts", ListCarts)
	r.GET("/orders", ListOrders)

	// Protected routes (require token)
	authorized := r.Group("/")
	authorized.Use(AuthMiddleware())
	{
		authorized.POST("/carts", AddToCart)
		authorized.GET("/my-cart", GetUserCart) // For showing current user's cart
		authorized.POST("/orders", CreateOrder)
		authorized.GET("/my-orders", GetUserOrders) // For showing user's order history
	}

	// Health check
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "pong"})
	})

	// Run the server
	r.Run(":8080") // listen and serve on 0.0.0.0:8080
}
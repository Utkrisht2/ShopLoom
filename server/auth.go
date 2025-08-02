// backend/auth.go
package main

import (
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"net/http"
	"strings"
)

// A shared secret key for signing the JWT token
var jwtKey = []byte("my_secret_key")

// Claims struct to be encoded to a JWT
type Claims struct {
	UserID uint `json:"user_id"`
	jwt.RegisteredClaims
}

// AuthMiddleware checks for a valid token in the Authorization header
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token format"})
			c.Abort()
			return
		}

		var user User
		// Find user by this token
		if err := DB.Where("token = ?", tokenString).First(&user).Error; err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		// Set user ID in context for downstream handlers
		c.Set("userId", user.ID)
		c.Next()
	}
}
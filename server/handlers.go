// backend/handlers.go
package main

import (
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
	"net/http"
	"time"
)

// Helper to hash password
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

// Helper to check password
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

// POST /users
func CreateUser(c *gin.Context) {
	var input struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hashedPassword, err := HashPassword(input.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	user := User{Username: input.Username, Password: hashedPassword}
	if result := DB.Create(&user); result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username already exists"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User created successfully", "user": user})
}

// GET /users
func ListUsers(c *gin.Context) {
	var users []User
	DB.Find(&users)
	c.JSON(http.StatusOK, gin.H{"data": users})
}

// POST /users/login
func Login(c *gin.Context) {
	var input struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user User
	if err := DB.Where("username = ?", input.Username).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
		return
	}

	if !CheckPasswordHash(input.Password, user.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
		return
	}

	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		UserID: user.ID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create token"})
		return
	}

	// Update user with the new single-session token
	DB.Model(&user).Update("token", tokenString)

	c.JSON(http.StatusOK, gin.H{"token": tokenString})
}

// POST /items
func CreateItem(c *gin.Context) {
	var input Item
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	DB.Create(&input)
	c.JSON(http.StatusCreated, gin.H{"data": input})
}

// GET /items
func ListItems(c *gin.Context) {
	var items []Item
	DB.Find(&items)
	c.JSON(http.StatusOK, gin.H{"data": items})
}

// POST /carts
func AddToCart(c *gin.Context) {
	userID, _ := c.Get("userId")

	var input struct {
		ItemIDs []uint `json:"item_ids" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user User
	DB.First(&user, userID)

	var cart Cart
	// Check if user has an active cart, if not create one
	if user.CartID == nil {
		cart = Cart{UserID: user.ID, Status: "active"}
		DB.Create(&cart)
		DB.Model(&user).Update("CartID", cart.ID)
	} else {
		DB.Preload("Items").First(&cart, *user.CartID)
	}

	var items []Item
	if err := DB.Find(&items, input.ItemIDs).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "One or more items not found"})
		return
	}

	// Add items to the cart
	DB.Model(&cart).Association("Items").Append(&items)

	// Preload items to show them in the response
	DB.Preload("Items").First(&cart, cart.ID)
	c.JSON(http.StatusOK, gin.H{"message": "Items added to cart", "cart": cart})
}

// GET /carts (for a specific user, identified by token)
func GetUserCart(c *gin.Context) {
	userID, _ := c.Get("userId")

	var user User
	DB.First(&user, userID)

	if user.CartID == nil {
		c.JSON(http.StatusOK, gin.H{"message": "User does not have an active cart", "cart": nil})
		return
	}

	var cart Cart
	DB.Preload("Items").First(&cart, *user.CartID)
	c.JSON(http.StatusOK, gin.H{"data": cart})
}

// GET /carts (lists all carts for admin purposes)
func ListCarts(c *gin.Context) {
	var carts []Cart
	DB.Preload("Items").Find(&carts)
	c.JSON(http.StatusOK, gin.H{"data": carts})
}

// POST /orders
func CreateOrder(c *gin.Context) {
	userID, _ := c.Get("userId")

	var user User
	DB.First(&user, userID)

	if user.CartID == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User has no active cart to order"})
		return
	}

	cartID := *user.CartID

	// Create order from the cart
	order := Order{CartID: cartID, UserID: user.ID}
	if result := DB.Create(&order); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order"})
		return
	}

	// Update cart status to "ordered" and clear it from the user's active cart
	DB.Model(&Cart{}).Where("id = ?", cartID).Update("status", "ordered")
	DB.Model(&user).Update("CartID", nil)

	c.JSON(http.StatusCreated, gin.H{"message": "Order created successfully", "order": order})
}

// GET /orders (for a specific user)
func GetUserOrders(c *gin.Context) {
	userID, _ := c.Get("userId")
	var orders []Order
	DB.Where("user_id = ?", userID).Find(&orders)
	c.JSON(http.StatusOK, gin.H{"data": orders})
}

// GET /orders (lists all orders for admin purposes)
func ListOrders(c *gin.Context) {
	var orders []Order
	DB.Find(&orders)
	c.JSON(http.StatusOK, gin.H{"data": orders})
}

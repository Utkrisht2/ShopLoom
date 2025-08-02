# Shopping Cart E-commerce Application

A full-stack e-commerce shopping cart application built with React frontend and Go backend, featuring user authentication, product management, cart functionality, and order history.

## 🚀 Features

- **User Authentication**: Secure login and registration system with JWT tokens
- **Product Catalog**: Browse and view available products with dynamic images
- **Shopping Cart**: Add items to cart, view cart contents, and manage quantities
- **Order Management**: Place orders and view order history
- **Protected Routes**: Client-side route protection for authenticated users
- **Responsive Design**: Mobile-friendly UI built with Tailwind CSS
- **RESTful API**: Well-structured backend API with proper error handling

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API requests
- **Tailwind CSS** - Utility-first CSS framework
- **React Icons** - Beautiful icon library
- **Date-fns** - Date utility library
- **Vite** - Fast build tool and development server

### Backend
- **Go 1.24.5** - Backend programming language
- **Gin** - HTTP web framework for Go
- **GORM** - Go ORM library for database operations
- **SQLite** - Lightweight database
- **JWT** - JSON Web Tokens for authentication
- **CORS** - Cross-origin resource sharing support

## 📁 Project Structure

```
shoppingCart/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   │   ├── Header.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/          # Page components
│   │   │   ├── CartPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── OrderHistoryPage.jsx
│   │   │   ├── ShopPage.jsx
│   │   │   └── SignupPage.jsx
│   │   ├── services/       # API service layer
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/             # Static assets
│   ├── package.json
│   └── vite.config.js
└── server/                 # Go backend
    ├── main.go            # Server entry point
    ├── handlers.go        # HTTP request handlers
    ├── models.go          # Database models
    ├── auth.go            # Authentication middleware
    ├── database.go        # Database connection
    ├── go.mod
    ├── go.sum
    └── test.db           # SQLite database file
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- Go (v1.24.5 or higher)
- Git

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install Go dependencies:
   ```bash
   go mod tidy
   ```

3. Run the server:
   ```bash
   go run .
   ```

The backend API will be available at `http://localhost:8080`

## 📚 API Endpoints

### Public Endpoints
- `POST /users` - Create new user account
- `POST /users/login` - User login
- `POST /items` - Create new product (admin)
- `GET /items` - Get all products
- `GET /ping` - Health check

### Protected Endpoints (Require Authentication)
- `POST /carts` - Add items to cart
- `GET /my-cart` - Get current user's cart
- `POST /orders` - Create order from cart
- `GET /my-orders` - Get user's order history

### Admin/Debug Endpoints
- `GET /users` - List all users
- `GET /carts` - List all carts
- `GET /orders` - List all orders

## 🗄️ Database Schema

### Users
- `id` (Primary Key)
- `username` (Unique)
- `password` (Hashed)
- `token` (JWT Token)
- `cart_id` (Foreign Key)
- `created_at`

### Items
- `id` (Primary Key)
- `name`
- `status`
- `created_at`

### Carts
- `id` (Primary Key)
- `user_id` (Foreign Key)
- `status` (active/ordered)
- `items` (Many-to-Many relationship)
- `created_at`

### Orders
- `id` (Primary Key)
- `cart_id` (Foreign Key)
- `user_id` (Foreign Key)
- `created_at`

## 🎯 Usage

1. **Registration**: Create a new account on the signup page
2. **Login**: Sign in with your credentials
3. **Browse Products**: View available products on the shop page
4. **Add to Cart**: Click "Add to Cart" on any product
5. **View Cart**: Navigate to the cart page to see selected items
6. **Place Order**: Create an order from your cart items
7. **Order History**: View your past orders on the orders page

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:
- Tokens are generated on successful login
- Tokens are stored in localStorage on the client
- Protected routes require valid tokens
- Middleware validates tokens on the server

## 🎨 Styling

The frontend uses Tailwind CSS for styling:
- Responsive design that works on all devices
- Modern, clean UI components
- Dark/light theme support
- Custom color palette for branding

## 🚦 Development Scripts

### Frontend (client/)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend (server/)
- `go run .` - Start development server
- `go build` - Build executable
- `go mod tidy` - Clean up dependencies

## 🔍 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the backend CORS middleware is properly configured
2. **Database Issues**: Check if the SQLite database file exists and has proper permissions
3. **Token Expiration**: Clear localStorage and log in again if authentication fails
4. **Port Conflicts**: Make sure ports 5173 (frontend) and 8080 (backend) are available

### Development Tips

- Use browser developer tools to debug API calls
- Check console for JavaScript errors
- Monitor Go server logs for backend issues
- Verify database state using SQLite browser tools

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Created by **Utkrisht Kumar Singh**

## 🔮 Future Enhancements

- [ ] Add product images upload functionality
- [ ] Implement product categories and filters
- [ ] Add product pricing and payment integration
- [ ] Implement inventory management
- [ ] Add user profile management
- [ ] Implement admin dashboard
- [ ] Add product reviews and ratings
- [ ] Implement search functionality
- [ ] Add email notifications
- [ ] Deploy to cloud platforms

## 📞 Support

If you encounter any issues or have questions, please:
1. Check the troubleshooting section
2. Search existing issues
3. Create a new issue with detailed information

---

**Happy Shopping! 🛒**

# Todo API Application

A RESTful API for managing todos with user authentication, built with Node.js, Express, and MongoDB.

## Features

- ✅ User authentication with JWT tokens
- ✅ Todo CRUD operations
- ✅ Role-based access control (Admin/User)
- ✅ Refresh token mechanism
- ✅ Password hashing with bcrypt
- ✅ API documentation with Swagger
- ✅ Web view for todos with Pug templates
- ✅ Input validation and error handling

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Template Engine**: Pug
- **API Documentation**: Swagger UI
- **Validation**: Mongoose built-in validators

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd <your-repo-name>
```

2. Install dependencies:
```bash
npm install express mongoose bcryptjs jsonwebtoken dotenv cors swagger-ui-express ejs method-override
```

3. Create a `.env` file in the root directory:
```env
JWT_SECRET=myJsonwebTokenSecret
JWT_REFRESH_TOKEN_SECRET=myJsonwebTokenRefreshSecret
```

4. Make sure MongoDB is running on your local machine at `mongodb://localhost:27017`

5. Start the application:
```bash
node index.js
```

The server will start on `http://localhost:3330`

## API Endpoints

### Authentication
- `POST /users/login` - User login
- `POST /users/refreshToken` - Refresh access token

### Users
- `GET /users` - Get all users (returns firstName only)
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user (also deletes associated todos)

### Todos
- `GET /todos` - Get all todos with user details (requires authentication)
- `GET /todos/:id` - Get todo by ID (requires authentication)
- `POST /todos` - Create new todo (requires authentication, user/admin role)
- `PATCH /todos/:id` - Update todo (requires authentication, admin role only)
- `DELETE /todos/:id` - Delete todo (requires authentication, admin role only)
- `GET /todos/view/api` - View todos in web interface (no auth required)

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Token Details
- **Access Token**: Expires in 2 hours
- **Refresh Token**: Expires in 2 days
- Refresh tokens are stored in the user document

### User Roles
- **User**: Can create and view todos
- **Admin**: Can create, view, update, and delete todos

## Data Models

### User Schema
```javascript
{
  username: String (unique, min 3 chars, required),
  email: String (required),
  password: String (required, auto-hashed),
  firstName: String (3-15 chars, required),
  lastName: String (3-15 chars, required),
  dob: Date (optional),
  role: String (enum: ['user', 'admin'], default: 'user'),
  refreshToken: String,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Todo Schema
```javascript
{
  title: String (3-20 chars, required),
  status: String (enum: ['to-do', 'in progress', 'done'], default: 'to-do'),
  userId: ObjectId (required, references User),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## API Documentation

Once the server is running, access the Swagger documentation at:
```
http://localhost:3330/api-docs
```

## Web Interface

View all todos in a beautiful web interface at:
```
http://localhost:3330/todos/view/api
```

Features:
- Responsive design with custom styling
- Todo statistics (count by status)
- User information display
- Status indicators with emojis

## Example Usage

### 1. Create a User
```bash
curl -X POST http://localhost:3330/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3330/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Response:
```json
{
  "message": "Success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Create a Todo
```bash
curl -X POST http://localhost:3330/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "title": "Learn Node.js",
    "status": "to-do",
    "userId": "<user-id>"
  }'
```

### 4. Refresh Token
```bash
curl -X POST http://localhost:3330/users/refreshToken \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "<your-refresh-token>"
  }'
```

## Project Structure

```
├── Controllers/
│   ├── todos.controller.js    # Todo CRUD operations
│   └── users.controller.js    # User CRUD operations & auth
├── Models/
│   ├── todos.models.js        # Todo schema
│   └── users.models.js        # User schema
├── Routes/
│   ├── todos.routes.js        # Todo routes
│   └── users.routes.js        # User routes
├── Middleware/
│   └── auth.js                # Authentication & authorization
├── Static/
│   ├── style.css              # CSS styles for web interface
│   ├── index.html             # Static HTML page
│   └── text.txt               # Additional static file
├── View/
│   └── todos.pug              # Pug template for todos display
├── .env                       # Environment variables
├── index.js                   # Main application file
├── swagger.json               # API documentation (if exists)
└── README.md                  # This file
```

## Middleware & Security

### Authentication Middleware
- Validates JWT tokens
- Supports both "Bearer token" and direct token formats
- Extracts user role for authorization

### Authorization
- `restrictTo()` middleware for role-based access
- Supports multiple role restrictions
- Returns 404 for unauthorized access

### Security Features
- Password hashing with bcrypt (salt rounds: 10)
- JWT token-based authentication
- Role-based authorization
- Input validation with Mongoose
- CORS enabled for cross-origin requests
- Password field excluded from user queries

## Database

**Database Name**: `keepNotes`
**Connection**: `mongodb://localhost:27017/keepNotes`

### Collections
- `users` - User accounts and authentication
- `todos` - Todo items with user references

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `200` - Success (GET, PATCH requests)
- `201` - Created (POST, successful login)
- `204` - No Content (DELETE requests)
- `400` - Bad Request (missing required fields)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (invalid refresh token)
- `404` - Not Found (resource not found, unauthorized role)
- `500` - Internal Server Error

## Static Files

Static files are served from the `./Static` directory:
- CSS styles for web interface
- HTML pages
- Other static assets

Access at: `http://localhost:3330/<filename>`

## Development Notes

- Server runs on port 3330
- Uses promisify for JWT verification
- Passwords are automatically hashed before saving
- Refresh tokens are stored and validated against user records
- User deletion cascades to associated todos
- Custom middleware logging enabled

## Dependencies

```json
{
  "express": "Web framework",
  "mongoose": "MongoDB ODM",
  "bcryptjs": "Password hashing",
  "jsonwebtoken": "JWT tokens",
  "dotenv": "Environment variables",
  "cors": "Cross-origin requests",
  "swagger-ui-express": "API documentation",
  "pug": "Template engine"
}
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

---

**Made with ❤️ using Node.js and Express**

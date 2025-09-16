# Backend Documentation

## 📁 **Backend Structure**

The backend is built with **Node.js**, **Express**, and **TypeScript**. It follows a modular architecture with clear separation of concerns.

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── middleware/      # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API route handlers
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   └── index.ts         # Main application entry point
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── setup-env.js         # Environment setup script
└── .env                 # Environment variables
```

## 🚀 **Getting Started**

### **Installation**

```bash
cd backend
npm install
```

### **Environment Setup**

```bash
npm run setup
```

### **Development**

```bash
npm run dev
```

### **Production Build**

```bash
npm run build
npm start
```

## 📋 **Dependencies**

### **Core Dependencies**

- **express**: Web framework
- **mongoose**: MongoDB object modeling
- **jsonwebtoken**: JWT authentication
- **bcryptjs**: Password hashing
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management
- **node-cron**: Task scheduling
- **nodemailer**: Email service

### **Development Dependencies**

- **typescript**: TypeScript compiler
- **ts-node-dev**: Development server with hot reload
- **@types/\***: TypeScript type definitions

## 🔧 **Configuration**

### **Environment Variables**

```env
# Database
MONGO_URI=mongodb://localhost:27017/unidirectional-comm

# Authentication
JWT_SECRET=your-super-secret-jwt-key

# Email Service
GMAIL_USER=your-gmail@gmail.com
GMAIL_APP_PASSWORD=your-app-password

# Server
PORT=3000
NODE_ENV=development
```

### **TypeScript Configuration**

- **Target**: ES2020
- **Module**: CommonJS
- **Strict Mode**: Enabled
- **Source Maps**: Enabled for debugging

## 🗄️ **Database Models**

### **User Model**

- Stores user authentication data
- Supports Type A and Type B users
- Includes password hashing

### **Request Model**

- Manages communication requests
- Tracks acceptance status
- Links users and messages

### **Message Model**

- Stores communication messages
- Links to requests and users
- Includes timestamps for cleanup

## 🛣️ **API Routes**

### **Authentication Routes** (`/api/auth`)

- **POST /register**: User registration
- **POST /login**: User authentication

### **Request Routes** (`/api/requests`)

- **POST /**: Create request (Type A only)
- **GET /pending**: Get pending requests (Type B only)
- **GET /accepted**: Get accepted requests (Type B only)
- **GET /sent**: Get sent requests (Type A only)
- **POST /:id/accept**: Accept request (Type B only)

### **Message Routes** (`/api/messages`)

- **POST /**: Send message
- **GET /:requestId**: Get messages for request

## 🔐 **Security Features**

### **Authentication Middleware**

- JWT token validation
- User context injection
- Route protection

### **Authorization**

- Role-based access control
- Type-specific permissions
- Secure password handling

## ⚡ **Automation**

### **Scheduler**

- Runs every 5 minutes
- Sends reminder emails
- Cleans up expired messages
- Comprehensive logging

### **Email Service**

- Gmail SMTP for development
- AWS SES for production
- Fallback to console logging
- HTML and text email support

## 🧪 **Testing**

### **Test Endpoints**

- **GET /api/test**: Backend connectivity test
- **GET /api/test-scheduler**: Manual scheduler trigger

### **Debugging**

- Comprehensive logging
- Error tracking
- Performance monitoring

## 📚 **File Documentation**

- [Models](models.md) - Database models and schemas
- [Routes](routes.md) - API endpoints and controllers
- [Middleware](middleware.md) - Authentication and other middleware
- [Utils](utils.md) - Utility functions and services
- [Configuration](config.md) - Database and environment configuration

## 🚀 **Deployment**

### **Production Build**

```bash
npm run build
```

### **Environment Setup**

- Set `NODE_ENV=production`
- Configure production database
- Set up email service
- Configure security settings

### **Process Management**

- Use PM2 for process management
- Set up log rotation
- Configure monitoring

The backend provides a robust, scalable foundation for the Unidirectional Communication System!

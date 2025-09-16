# API Routes Documentation

## 🛣️ **Overview**

The backend uses **Express.js** with a modular route structure. Each route file handles specific functionality with proper authentication and authorization.

## 📁 **Route Structure**

```
routes/
├── auth.ts        # Authentication routes (login, register)
├── requests.ts    # Request management routes
└── messages.ts    # Message handling routes
```

## 🔐 **Authentication Routes**

**File**: `src/routes/auth.ts`

### **Purpose**

Handles user registration and authentication. Provides JWT tokens for secure API access.

### **Dependencies**

```typescript
import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
```

### **Routes**

#### **POST /api/auth/register**

**Purpose**: Register a new user with Type A or Type B designation.

**Request Body**:

```typescript
{
  username: string;
  email: string;
  password: string;
  type: "A" | "B";
}
```

**Validation**:

- All fields required
- Type must be 'A' or 'B'
- Username and email must be unique

**Response**:

```typescript
// Success (201)
{
  message: "User registered";
}

// Error (400)
{
  error: "username,email,password,type required";
}
{
  error: "type must be A or B";
}
{
  error: "username or email already exists";
}
```

**Usage Example**:

```typescript
const response = await fetch("/api/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    username: "requester1",
    email: "requester1@test.com",
    password: "password123",
    type: "A",
  }),
});
```

#### **POST /api/auth/login**

**Purpose**: Authenticate user and return JWT token.

**Request Body**:

```typescript
{
  email: string;
  password: string;
}
```

**Response**:

```typescript
// Success (200)
{
  token: string; // JWT token
  type: "A" | "B"; // User type
}

// Error (400)
{
  error: "email and password required";
}
{
  error: "Invalid credentials";
}
```

**Usage Example**:

```typescript
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "requester1@test.com",
    password: "password123",
  }),
});

const { token, type } = await response.json();
localStorage.setItem("token", token);
```

## 📝 **Request Routes**

**File**: `src/routes/requests.ts`

### **Purpose**

Manages communication requests between Type A and Type B users. Handles creation, viewing, and acceptance of requests.

### **Dependencies**

```typescript
import { Router, Request, Response } from "express";
import auth from "../middleware/auth";
import RequestModel from "../models/Request";
import User from "../models/User";
```

### **Routes**

#### **POST /api/requests**

**Purpose**: Create a new communication request (Type A only).

**Authentication**: Required (JWT token)

**Authorization**: Type A users only

**Request Body**: None (user ID from token)

**Response**:

```typescript
// Success (201)
{
  message: 'Request created',
  request: {
    _id: string;
    from: string;
    acceptedBy: null;
    acceptedAt: null;
    responded: false;
    createdAt: string;
  }
}

// Error (403)
{ error: 'Only Type A can send requests' }
```

**Usage Example**:

```typescript
const response = await fetch("/api/requests", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
```

#### **GET /api/requests/pending**

**Purpose**: Get all pending requests (Type B only).

**Authentication**: Required (JWT token)

**Authorization**: Type B users only

**Response**:

```typescript
// Success (200)
[
  {
    _id: string;
    from: {
      _id: string;
      username: string;
      email: string;
    };
    acceptedBy: null;
    acceptedAt: null;
    responded: false;
    createdAt: string;
  }
]
```

**Usage Example**:

```typescript
const response = await fetch("/api/requests/pending", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
const pendingRequests = await response.json();
```

#### **GET /api/requests/accepted**

**Purpose**: Get requests accepted by the current Type B user.

**Authentication**: Required (JWT token)

**Authorization**: Type B users only

**Response**: Same format as pending requests, but with `acceptedBy` populated.

#### **GET /api/requests/sent**

**Purpose**: Get requests sent by the current Type A user that were accepted.

**Authentication**: Required (JWT token)

**Authorization**: Type A users only

**Response**:

```typescript
[
  {
    _id: string;
    from: string;
    acceptedBy: {
      _id: string;
      username: string;
      email: string;
    };
    acceptedAt: string;
    responded: boolean;
    createdAt: string;
  }
]
```

#### **POST /api/requests/:id/accept**

**Purpose**: Accept a pending request (Type B only).

**Authentication**: Required (JWT token)

**Authorization**: Type B users only

**URL Parameters**:

- `id`: Request ID to accept

**Response**:

```typescript
// Success (200)
{
  message: 'Request accepted',
  request: {
    _id: string;
    from: string;
    acceptedBy: string;
    acceptedAt: string;
    responded: false;
    createdAt: string;
  }
}

// Error (404)
{ error: 'Request not found' }

// Error (400)
{ error: 'Request already accepted' }
```

**Usage Example**:

```typescript
const response = await fetch(`/api/requests/${requestId}/accept`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
```

## 💬 **Message Routes**

**File**: `src/routes/messages.ts`

### **Purpose**

Handles message creation and retrieval within accepted requests.

### **Dependencies**

```typescript
import { Router, Request, Response } from "express";
import auth from "../middleware/auth";
import RequestModel from "../models/Request";
import MessageModel from "../models/Message";
```

### **Routes**

#### **POST /api/messages**

**Purpose**: Send a message within an accepted request.

**Authentication**: Required (JWT token)

**Request Body**:

```typescript
{
  requestId: string;
  content: string;
}
```

**Authorization**:

- Type A: Can send to requests they created
- Type B: Can send to requests they accepted

**Response**:

```typescript
// Success (201)
{
  message: 'Message sent',
  data: {
    _id: string;
    requestId: string;
    from: string;
    to: string;
    content: string;
    createdAt: string;
  }
}

// Error (403)
{ error: 'Not your request' }
{ error: 'Not your accepted request' }
```

**Usage Example**:

```typescript
const response = await fetch("/api/messages", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    requestId: "507f1f77bcf86cd799439011",
    content: "Hello, how can I help you?",
  }),
});
```

#### **GET /api/messages/:requestId**

**Purpose**: Get all messages for a specific request.

**Authentication**: Required (JWT token)

**URL Parameters**:

- `requestId`: Request ID to get messages for

**Authorization**: Only participants in the request can view messages

**Response**:

```typescript
// Success (200)
[
  {
    _id: string;
    requestId: string;
    from: string;
    to: string;
    content: string;
    createdAt: string;
  }
]
```

**Usage Example**:

```typescript
const response = await fetch(`/api/messages/${requestId}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
const messages = await response.json();
```

## 🧪 **Test Routes**

### **GET /api/test**

**Purpose**: Test backend connectivity.

**Response**:

```typescript
{
  message: 'Backend is working!',
  timestamp: string
}
```

### **GET /api/test-scheduler**

**Purpose**: Manually trigger the scheduler for testing.

**Response**:

```typescript
{
  message: 'Scheduler test completed',
  result: {
    pendingRequests: number;
    expiredRequests: number;
    messagesDeleted: number;
  },
  timestamp: string
}
```

## 🔒 **Security Features**

### **Authentication Middleware**

All protected routes use the `auth` middleware which:

- Validates JWT tokens
- Extracts user information
- Adds user context to request object

### **Authorization**

- **Type A Only**: Create requests, view sent requests
- **Type B Only**: View pending requests, accept requests
- **Both Types**: Send messages (with restrictions)

### **Input Validation**

- Required field validation
- Type checking for user types
- Unique constraint validation
- ObjectId validation

## 📊 **Error Handling**

### **Standard Error Responses**

```typescript
// 400 Bad Request
{
  error: "Field is required";
}

// 401 Unauthorized
{
  error: "Not authenticated";
}

// 403 Forbidden
{
  error: "Only Type A can send requests";
}

// 404 Not Found
{
  error: "Request not found";
}

// 500 Internal Server Error
{
  error: "Server error";
}
```

### **Error Logging**

All errors are logged with:

- Timestamp
- Error details
- Request information
- Stack trace (in development)

## 🚀 **Best Practices**

### **Route Design**

- **RESTful URLs**: Clear, resource-based URLs
- **HTTP Methods**: Appropriate methods for operations
- **Status Codes**: Correct HTTP status codes
- **Consistent Responses**: Standardized response format

### **Security**

- **Authentication**: JWT token validation
- **Authorization**: Role-based access control
- **Input Validation**: Validate all inputs
- **Error Handling**: Don't expose sensitive information

### **Performance**

- **Database Queries**: Optimized queries with population
- **Error Handling**: Graceful error responses
- **Logging**: Comprehensive logging for debugging
- **Validation**: Early validation to prevent unnecessary processing

The routes provide a secure, well-structured API for the Unidirectional Communication System!

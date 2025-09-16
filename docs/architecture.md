# System Architecture

## 🏗️ **High-Level Architecture**

The Unidirectional Communication System follows a **3-tier architecture**:

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Login     │  │  Dashboard  │  │  Messaging  │        │
│  │   Page      │  │     A/B      │  │    Page     │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│           │               │               │                 │
│           └───────────────┼───────────────┘                 │
│                           │                                 │
│  ┌─────────────────────────────────────────────────────────┐│
│  │              React Frontend (TypeScript)                ││
│  │  • Material-UI Components                              ││
│  │  • React Router for Navigation                         ││
│  │  • Context API for State Management                    ││
│  │  • Axios for API Communication                        ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Auth      │  │  Requests   │  │  Messages   │        │
│  │  Routes     │  │   Routes    │  │   Routes    │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│           │               │               │                 │
│           └───────────────┼───────────────┘                 │
│                           │                                 │
│  ┌─────────────────────────────────────────────────────────┐│
│  │            Express.js Backend (TypeScript)              ││
│  │  • RESTful API Design                                  ││
│  │  • JWT Authentication                                  ││
│  │  • Middleware for Security                             ││
│  │  • Cron Jobs for Automation                            ││
│  │  • Email Service Integration                           ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Database Queries
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │    Users    │  │  Requests   │  │  Messages   │        │
│  │ Collection  │  │ Collection  │  │ Collection  │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│           │               │               │                 │
│           └───────────────┼───────────────┘                 │
│                           │                                 │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                MongoDB Database                         ││
│  │  • Document-based Storage                              ││
│  │  • Mongoose ODM for Schema Management                  ││
│  │  • Indexes for Performance                            ││
│  │  • Data Validation                                    ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

## 🔄 **Data Flow Architecture**

### **1. User Registration Flow**

```
User Input → Frontend Validation → API Call → Backend Validation → Database Storage → JWT Token → Frontend Storage
```

### **2. Request Creation Flow**

```
Type A User → Create Request → API Call → Authentication Check → Database Storage → Response → Frontend Update
```

### **3. Request Acceptance Flow**

```
Type B User → View Pending → Accept Request → API Call → Database Update → Frontend Refresh → Move to Accepted Tab
```

### **4. Messaging Flow**

```
User → Send Message → API Call → Authentication → Database Storage → Response → Frontend Refresh → Other User Sees Message
```

### **5. Automated Cleanup Flow**

```
Cron Job (5 min) → Check Expired Requests → Delete Type A Messages → Send Reminders → Log Results
```

## 🗄️ **Database Schema**

### **Users Collection**

```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  type: String (enum: ['A', 'B']),
  createdAt: Date
}
```

### **Requests Collection**

```javascript
{
  _id: ObjectId,
  from: ObjectId (ref: User),
  acceptedBy: ObjectId (ref: User, nullable),
  acceptedAt: Date (nullable),
  responded: Boolean (default: false),
  createdAt: Date
}
```

### **Messages Collection**

```javascript
{
  _id: ObjectId,
  requestId: ObjectId (ref: Request),
  from: ObjectId (ref: User),
  to: ObjectId (ref: User),
  content: String,
  createdAt: Date
}
```

## 🔐 **Security Architecture**

### **Authentication Flow**

```
1. User Login → Credentials Validation → JWT Token Generation
2. Token Storage → LocalStorage (Frontend)
3. API Requests → Token in Authorization Header
4. Middleware → Token Validation → User Context
5. Route Handler → Access Control Based on User Type
```

### **Authorization Levels**

- **Public Routes**: Login, Register
- **Authenticated Routes**: All API endpoints
- **Type A Only**: Create requests, view sent requests
- **Type B Only**: View pending requests, accept requests

## ⚡ **Performance Architecture**

### **Frontend Optimization**

- **Component-based Architecture**: Reusable components
- **State Management**: Context API for global state
- **Lazy Loading**: Route-based code splitting
- **Material-UI**: Optimized component library

### **Backend Optimization**

- **Middleware Chain**: Efficient request processing
- **Database Indexing**: Optimized queries
- **Connection Pooling**: MongoDB connection management
- **Error Handling**: Graceful error responses

### **Database Optimization**

- **Indexes**: On frequently queried fields
- **Schema Design**: Normalized data structure
- **Query Optimization**: Efficient aggregation pipelines

## 🔄 **Automation Architecture**

### **Scheduler System**

```
Cron Job (Every 5 minutes)
├── Check Pending Requests
│   ├── Calculate Time Since Acceptance
│   ├── Send Reminder Emails (if needed)
│   └── Log Results
└── Cleanup Expired Messages
    ├── Find Requests Older Than 1 Hour
    ├── Delete Type A Messages
    └── Log Deletion Results
```

### **Email Service Architecture**

```
Email Request → Service Selection → Transporter Creation → Email Sending → Result Logging
```

**Service Selection Logic**:

- Development: Gmail SMTP
- Production: AWS SES
- Fallback: Console Logging

## 🌐 **API Architecture**

### **RESTful Design Principles**

- **Resource-based URLs**: `/api/users`, `/api/requests`
- **HTTP Methods**: GET, POST, PUT, DELETE
- **Status Codes**: Proper HTTP status codes
- **Error Handling**: Consistent error responses

### **API Endpoints Structure**

```
/api/auth/
├── POST /register
└── POST /login

/api/requests/
├── POST / (Type A only)
├── GET /pending (Type B only)
├── GET /accepted (Type B only)
├── GET /sent (Type A only)
└── POST /:id/accept (Type B only)

/api/messages/
├── POST /
└── GET /:requestId
```

## 🚀 **Deployment Architecture**

### **Development Environment**

```
Local Machine
├── Frontend (React Dev Server)
├── Backend (Node.js Dev Server)
├── MongoDB (Local/Atlas)
└── Email (Gmail SMTP/Console)
```

### **Production Environment**

```
AWS EC2 Instance
├── Frontend (Built React App)
├── Backend (Node.js Production)
├── MongoDB (Atlas/EC2)
├── Email (AWS SES)
└── Nginx (Reverse Proxy)
```

## 📊 **Monitoring Architecture**

### **Logging Strategy**

- **Frontend**: Console logging for debugging
- **Backend**: Comprehensive server-side logging
- **Database**: Query logging and performance metrics
- **Email**: Send success/failure logging

### **Error Handling**

- **Frontend**: Try-catch blocks with user-friendly messages
- **Backend**: Middleware-based error handling
- **Database**: Connection error handling
- **Email**: Retry logic and fallback options

This architecture ensures scalability, maintainability, and reliability of the Unidirectional Communication System!

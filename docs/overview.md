# System Overview

## 🎯 **What is the Unidirectional Communication System?**

The Unidirectional Communication System is a web-based application that enables controlled communication between two types of users:

- **Type A (Requesters)**: Users who initiate communication requests
- **Type B (Responders)**: Users who receive and can accept communication requests

## 🔄 **How It Works**

### **1. User Registration**

- Users register and select their type (A or B)
- Each user gets role-based access to different features

### **2. Request Flow**

- Type A users create communication requests
- All Type B users can see these requests
- Type B users can selectively accept requests

### **3. Communication Flow**

- Once a request is accepted, unidirectional messaging begins
- Type A can send messages
- Type B must respond within 1 hour
- If Type B doesn't respond, they get reminder emails every 5 minutes

### **4. Message Management**

- Type A messages are automatically deleted after 1 hour
- This ensures strict timing enforcement
- Type B responses are preserved

## 🏗️ **System Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (MongoDB)     │
│                 │    │                 │    │                 │
│ - User Interface│    │ - API Routes    │    │ - User Data     │
│ - State Mgmt    │    │ - Authentication│    │ - Requests      │
│ - Routing       │    │ - Business Logic│    │ - Messages      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Email Service │
                       │   (Gmail/SES)   │
                       │                 │
                       │ - Reminders     │
                       │ - Notifications │
                       └─────────────────┘
```

## 🎨 **User Interface**

### **Type A Dashboard (Requesters)**

- Create new requests
- View accepted requests
- Send messages to accepted requests
- Test backend and scheduler functionality

### **Type B Dashboard (Responders)**

- View pending requests (with Accept buttons)
- View accepted requests (for messaging)
- Accept or ignore requests
- Respond to messages

## 🔐 **Security Features**

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Users can only access features for their type
- **Password Hashing**: Secure password storage with bcrypt
- **CORS Protection**: Cross-origin request protection

## ⚡ **Key Features**

### **Automated Systems**

- **Scheduler**: Runs every 5 minutes to:
  - Send reminder emails
  - Delete expired messages
- **Email Notifications**: Automatic reminders for pending responses
- **Message Cleanup**: Automatic deletion of expired Type A messages

### **Real-time Updates**

- Frontend automatically refreshes after actions
- Real-time status updates
- Comprehensive logging for debugging

## 🎯 **Use Cases**

This system is perfect for:

- **Customer Support**: Customers request help, agents respond
- **Consultation Services**: Clients request consultations, experts respond
- **Help Desk**: Users submit tickets, support staff respond
- **Any scenario requiring controlled, time-limited communication**

## 🚀 **Technology Stack**

- **Backend**: Node.js, Express, TypeScript
- **Frontend**: React, TypeScript, Material-UI
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens
- **Email**: Nodemailer (Gmail/AWS SES)
- **Scheduling**: Node-cron
- **Deployment**: AWS EC2 ready

## 📊 **Data Flow**

1. **User registers** → Stored in MongoDB
2. **Type A creates request** → Stored in requests collection
3. **Type B sees request** → Fetched from pending requests
4. **Type B accepts** → Request updated with acceptance info
5. **Messages exchanged** → Stored in messages collection
6. **Scheduler runs** → Sends reminders, deletes expired messages

This system ensures controlled, time-limited communication with automatic cleanup and reminder systems!

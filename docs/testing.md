# Testing Guide

## 🧪 **Overview**

This guide covers testing the Unidirectional Communication System, including manual testing, automated testing, and debugging techniques.

## 🔧 **Testing Setup**

### **Prerequisites**

- Backend server running (`npm run dev`)
- Frontend server running (`npm start`)
- MongoDB database accessible
- Test users created

### **Test Environment**

```bash
# Backend
cd backend
npm run dev

# Frontend (new terminal)
cd frontend
npm start
```

## 👥 **Test User Setup**

### **Create Test Users**

1. **Type A User (Requester)**:

   - Username: `requester1`
   - Email: `requester1@test.com`
   - Password: `password123`
   - Type: `A (Requester)`

2. **Type B User (Responder)**:
   - Username: `responder1`
   - Email: `responder1@test.com`
   - Password: `password123`
   - Type: `B (Responder)`

## 🧪 **Manual Testing Scenarios**

### **Scenario 1: Complete User Flow**

#### **Step 1: User Registration**

1. Go to `/register`
2. Register Type A user
3. Register Type B user
4. **Expected**: Both users can log in successfully

#### **Step 2: Request Creation**

1. Login as Type A user
2. Click "Create Request"
3. **Expected**: Request appears in "Sent Requests"
4. **Expected**: Console shows successful creation

#### **Step 3: Request Acceptance**

1. Login as Type B user
2. Go to "Pending Requests" tab
3. Click "Accept" button
4. **Expected**: Request moves to "Accepted Requests" tab
5. **Expected**: Request disappears from "Pending Requests"

#### **Step 4: Messaging**

1. Type A: Click on accepted request
2. Send a message
3. Type B: Click on accepted request
4. **Expected**: Both users see the message
5. **Expected**: Messages appear in chronological order

### **Scenario 2: Backend Testing**

#### **Test Backend Connectivity**

1. Login as Type A user
2. Click "Test Backend" button
3. **Expected**: Alert shows "Backend is working!"

#### **Test Scheduler**

1. Click "Test Scheduler" button
2. **Expected**: Alert shows scheduler results
3. **Expected**: Console shows detailed scheduler logs

### **Scenario 3: Error Handling**

#### **Authentication Errors**

1. Try to access `/` without logging in
2. **Expected**: Redirected to `/login`

#### **Authorization Errors**

1. Login as Type A user
2. Try to access Type B only features
3. **Expected**: 403 Forbidden error

#### **Validation Errors**

1. Try to register with missing fields
2. **Expected**: Validation error messages

## 🔍 **API Testing**

### **Using Browser DevTools**

#### **Network Tab Testing**

1. Open browser DevTools
2. Go to Network tab
3. Perform actions in the app
4. **Check**: API calls are made correctly
5. **Check**: Responses are as expected

#### **Console Testing**

1. Open browser DevTools
2. Go to Console tab
3. **Check**: No JavaScript errors
4. **Check**: API request/response logs

### **Using Postman/Insomnia**

#### **Authentication Test**

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "requester1@test.com",
  "password": "password123"
}
```

#### **Request Creation Test**

```http
POST http://localhost:3000/api/requests
Authorization: Bearer <token>
Content-Type: application/json
```

#### **Message Sending Test**

```http
POST http://localhost:3000/api/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "requestId": "<request-id>",
  "content": "Test message"
}
```

## 🗄️ **Database Testing**

### **MongoDB Compass/Shell**

#### **Check Collections**

```javascript
// Connect to database
use unidirectional-comm

// Check users
db.users.find()

// Check requests
db.requests.find()

// Check messages
db.messages.find()
```

#### **Test Data Verification**

```javascript
// Find Type A users
db.users.find({ type: "A" });

// Find pending requests
db.requests.find({ acceptedBy: null });

// Find accepted requests
db.requests.find({ acceptedBy: { $ne: null } });

// Find messages for a request
db.messages.find({ requestId: ObjectId("<request-id>") });
```

## ⚡ **Automated Testing**

### **Backend Testing**

#### **Test Endpoints**

```bash
# Test backend connectivity
curl http://localhost:3000/api/test

# Test scheduler
curl http://localhost:3000/api/test-scheduler
```

#### **Database Testing**

```javascript
// Test user creation
const user = new User({
  username: "testuser",
  email: "test@example.com",
  password: "hashedpassword",
  type: "A",
});
await user.save();

// Test request creation
const request = new RequestModel({
  from: user._id,
});
await request.save();
```

### **Frontend Testing**

#### **Component Testing**

```typescript
import { render, screen } from "@testing-library/react";
import { AuthProvider } from "../context/AuthContext";
import DashboardA from "../pages/DashboardA";

test("renders dashboard for Type A user", () => {
  render(
    <AuthProvider>
      <DashboardA />
    </AuthProvider>
  );

  expect(screen.getByText("Dashboard A (Requester)")).toBeInTheDocument();
  expect(screen.getByText("Create Request")).toBeInTheDocument();
});
```

#### **API Integration Testing**

```typescript
import api from "../api";

test("API client configuration", () => {
  expect(api.defaults.baseURL).toBe("http://localhost:3000/api");
});
```

## 🐛 **Debugging Techniques**

### **Backend Debugging**

#### **Console Logging**

```typescript
// Check authentication
console.log("[AUTH] User:", req.user);

// Check database operations
console.log("[DB] Query result:", result);

// Check email sending
console.log("[EMAIL] Sending to:", to);
```

#### **Error Handling**

```typescript
try {
  const result = await someOperation();
  console.log("Success:", result);
} catch (error) {
  console.error("Error:", error);
  // Handle error appropriately
}
```

### **Frontend Debugging**

#### **React DevTools**

1. Install React DevTools browser extension
2. Inspect component state
3. Check props and context values
4. Monitor re-renders

#### **Console Debugging**

```typescript
// Check API calls
console.log("[API] Request:", config);
console.log("[API] Response:", response);

// Check state updates
console.log("[STATE] Updated:", newState);
```

## 📊 **Performance Testing**

### **Load Testing**

#### **Concurrent Users**

1. Open multiple browser tabs
2. Login with different users
3. Perform simultaneous actions
4. **Check**: System handles concurrent requests

#### **Database Performance**

```javascript
// Test query performance
db.requests.find({ acceptedBy: null }).explain("executionStats");

// Test index usage
db.requests.find({ from: ObjectId("<user-id>") }).explain("executionStats");
```

### **Memory Testing**

#### **Frontend Memory**

1. Open browser DevTools
2. Go to Memory tab
3. Take heap snapshots
4. **Check**: No memory leaks

#### **Backend Memory**

1. Monitor Node.js process memory
2. **Check**: Memory usage stays stable
3. **Check**: No memory leaks in long-running processes

## 🚨 **Common Issues and Solutions**

### **Authentication Issues**

#### **Problem**: "Not authenticated" error

**Solution**: Check JWT token in localStorage and backend logs

#### **Problem**: Token expiration

**Solution**: Implement token refresh or re-login flow

### **Database Issues**

#### **Problem**: Connection errors

**Solution**: Check MongoDB connection and MONGO_URI

#### **Problem**: Query timeouts

**Solution**: Add database indexes and optimize queries

### **API Issues**

#### **Problem**: CORS errors

**Solution**: Check CORS configuration in backend

#### **Problem**: 404 errors

**Solution**: Verify API endpoint URLs and routing

## 📋 **Test Checklist**

### **Functional Testing**

- [ ] User registration works
- [ ] User login works
- [ ] Request creation works
- [ ] Request acceptance works
- [ ] Messaging works
- [ ] Logout works

### **Security Testing**

- [ ] Authentication required for protected routes
- [ ] Authorization works correctly
- [ ] Input validation works
- [ ] SQL injection prevention

### **Performance Testing**

- [ ] Page load times acceptable
- [ ] API response times acceptable
- [ ] Database queries optimized
- [ ] Memory usage stable

### **Error Handling**

- [ ] Graceful error handling
- [ ] User-friendly error messages
- [ ] Proper HTTP status codes
- [ ] Error logging works

## 🎯 **Test Results Documentation**

### **Test Report Template**

```
Test Date: [Date]
Tester: [Name]
Environment: [Development/Production]

Functional Tests:
- User Registration: ✅/❌
- User Login: ✅/❌
- Request Creation: ✅/❌
- Request Acceptance: ✅/❌
- Messaging: ✅/❌

Performance Tests:
- Page Load Time: [Time]
- API Response Time: [Time]
- Database Query Time: [Time]

Issues Found:
1. [Issue description]
2. [Issue description]

Recommendations:
1. [Recommendation]
2. [Recommendation]
```

This comprehensive testing guide ensures the Unidirectional Communication System works correctly and reliably!

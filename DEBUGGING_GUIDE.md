# Debugging Guide for Unidirectional Communication System

## 🔧 **Comprehensive Logging Added**

I've added extensive logging throughout the application to help debug issues. All logs are prefixed with tags like `[AUTH]`, `[DASHBOARD A]`, `[CREATE REQUEST]`, etc.

## 🚀 **How to Test the Complete Flow**

### **Step 1: Start the Backend**

```bash
cd backend
npm run dev
```

**Expected Logs:**

```
[DB] Attempting to connect to MongoDB...
[DB] MONGO_URI: configured
[DB] MongoDB connected successfully
[DB] Database name: unidirectional-comm
[SERVER] Backend listening on port 3000
[SERVER] Environment: development
[SERVER] JWT_SECRET configured: Yes
[SERVER] MONGO_URI configured: Yes
[SERVER] Starting scheduler...
```

### **Step 2: Start the Frontend**

```bash
cd frontend
npm start
```

### **Step 3: Test Complete User Flow**

#### **3.1 Register Type A User (Requester)**

1. Go to `/register`
2. Fill in:
   - Username: `requester1`
   - Email: `requester1@test.com`
   - Password: `password123`
   - Type: `A (Requester)`
3. Click Register

**Expected Backend Logs:**

```
[REGISTER] Registration attempt: { username: 'requester1', email: 'requester1@test.com', type: 'A' }
[REGISTER] Checking for existing user
[REGISTER] Creating new user
[REGISTER] User created successfully: [ObjectId]
[LOGIN] Login attempt: { email: 'requester1@test.com' }
[LOGIN] User found: { id: [ObjectId], type: 'A', username: 'requester1' }
[LOGIN] Generating JWT token
[LOGIN] Login successful for user: [ObjectId]
```

#### **3.2 Register Type B User (Responder)**

1. Go to `/register`
2. Fill in:
   - Username: `responder1`
   - Email: `responder1@test.com`
   - Password: `password123`
   - Type: `B (Responder)`
3. Click Register

#### **3.3 Test Backend Connection**

1. Login as Type A user
2. Click "Test Backend" button

**Expected Logs:**

```
[TEST] Test endpoint called
[DASHBOARD A] Backend test successful: { message: 'Backend is working!', timestamp: '...' }
```

#### **3.4 Create Request (Type A)**

1. While logged in as Type A user
2. Click "Create Request" button

**Expected Logs:**

```
[DASHBOARD A] Create request button clicked
[DASHBOARD A] Sending POST request to /requests
[AUTH] Starting authentication check
[AUTH] Authorization header: Bearer [token]
[AUTH] Token extracted: present
[AUTH] Token decoded successfully: { userId: '[id]', type: 'A', iat: ..., exp: ... }
[AUTH] User set on request: { id: '[id]', type: 'A' }
[CREATE REQUEST] Starting request creation
[CREATE REQUEST] User: { id: '[id]', type: 'A' }
[CREATE REQUEST] Creating request for user: [id]
[CREATE REQUEST] Request created successfully: [request object]
[DASHBOARD A] Request created successfully: { message: 'Request created', request: [object] }
[DASHBOARD A] Refreshing requests list
[DASHBOARD A] Fetching sent requests
[DASHBOARD A] Sent requests received: [array]
```

#### **3.5 View and Accept Request (Type B)**

1. Login as Type B user
2. You should see the request from Type A user
3. Click "Accept" button

**Expected Logs:**

```
[DASHBOARD B] Fetching pending requests
[DASHBOARD B] Pending requests received: [array with request]
[DASHBOARD B] Accepting request: [request_id]
[DASHBOARD B] Request accepted successfully: [response]
```

#### **3.6 Send Messages**

1. Click on the accepted request to enter messaging
2. Type a message and send

**Expected Logs:**

```
[MESSAGING] Fetching messages for request: [request_id]
[MESSAGING] Messages received: [array]
[MESSAGING] Sending message: { requestId: '[id]', content: 'Hello' }
[MESSAGING] Message sent successfully: [response]
```

## 🐛 **Common Issues and Solutions**

### **Issue 1: "Create Request" Button Does Nothing**

**Check these logs:**

- `[DASHBOARD A] Create request button clicked` - Button click detected
- `[AUTH] Starting authentication check` - Authentication middleware triggered
- `[CREATE REQUEST] Starting request creation` - Request creation started

**Possible Causes:**

1. **Authentication Issue**: Check if JWT token is present and valid
2. **Backend Not Running**: Test with "Test Backend" button
3. **Database Connection**: Check MongoDB connection logs

### **Issue 2: Type B Users Don't See Requests**

**Check these logs:**

- `[DASHBOARD B] Fetching pending requests` - Request fetch attempted
- `[DASHBOARD B] Pending requests received: []` - Empty array means no requests

**Possible Causes:**

1. **Request Not Created**: Check Type A user logs
2. **Database Issue**: Check if request was saved to database

### **Issue 3: Authentication Failures**

**Check these logs:**

- `[AUTH] No authorization header found` - Token missing
- `[AUTH] Token verification failed` - Invalid/expired token
- `[AUTH] JWT_SECRET not configured` - Environment variable missing

## 🔍 **Debugging Steps**

### **1. Check Environment Variables**

Make sure `.env` file exists in backend directory:

```env
MONGO_URI=mongodb://localhost:27017/unidirectional-comm
JWT_SECRET=your-super-secret-jwt-key-here
PORT=3000
NODE_ENV=development
```

### **2. Check Database Connection**

Look for these logs:

```
[DB] MongoDB connected successfully
[DB] Database name: unidirectional-comm
```

### **3. Check Authentication Flow**

1. Register a user
2. Check if token is stored in localStorage
3. Check if token is sent with requests

### **4. Test Individual Endpoints**

Use the "Test Backend" button to verify backend connectivity.

## 📊 **Expected Database Collections**

After successful testing, you should have:

- `users` collection with 2 users (Type A and Type B)
- `requests` collection with 1 request
- `messages` collection with messages

## 🆕 **New Features Added**

### **Dashboard B Improvements**

1. **Tabbed Interface**: Type B users now have two tabs:

   - **Pending Requests**: Shows unaccepted requests with "Accept" buttons
   - **Accepted Requests**: Shows accepted requests for messaging

2. **Automatic List Updates**: When a request is accepted:

   - It's removed from the "Pending Requests" tab
   - It's added to the "Accepted Requests" tab
   - Both lists refresh automatically

3. **Messaging Access**: Type B users can now:
   - Click on accepted requests to enter messaging
   - See messages from Type A users
   - Respond to messages

### **New API Endpoint**

- `GET /api/requests/accepted` - Returns requests accepted by the current Type B user

## 🚨 **If Still Not Working**

1. **Check Browser Console**: Look for JavaScript errors
2. **Check Network Tab**: Verify API calls are being made
3. **Check Backend Logs**: Look for error messages
4. **Verify MongoDB**: Ensure database is running and accessible
5. **Check Tab Navigation**: Ensure you're on the correct tab in Dashboard B

## 📝 **Test Data**

For testing, use these credentials:

**Type A User:**

- Username: `requester1`
- Email: `requester1@test.com`
- Password: `password123`

**Type B User:**

- Username: `responder1`
- Email: `responder1@test.com`
- Password: `password123`

This will help you verify the complete unidirectional communication flow as specified in the requirements.

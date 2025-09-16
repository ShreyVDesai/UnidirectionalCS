# Getting Started

## 🚀 **Prerequisites**

Before you begin, make sure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)
- **MongoDB** (local installation or MongoDB Atlas)
- **Git** (for version control)

## 📦 **Installation**

### **1. Clone the Repository**

```bash
git clone <repository-url>
cd UnidirectionalCS
```

### **2. Install Backend Dependencies**

```bash
cd backend
npm install
```

### **3. Install Frontend Dependencies**

```bash
cd ../frontend
npm install
```

## ⚙️ **Configuration**

### **1. Backend Setup**

```bash
cd backend
npm run setup
```

This creates a `.env` file with default values. You can modify it as needed.

### **2. Environment Variables**

The `.env` file should contain:

```env
# Database
MONGO_URI=mongodb://localhost:27017/unidirectional-comm

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email (Optional)
GMAIL_USER=your-gmail@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password

# Server
PORT=3000
NODE_ENV=development
```

### **3. Database Setup**

Make sure MongoDB is running:

```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Just update MONGO_URI in .env file
```

## 🏃 **Running the Application**

### **1. Start the Backend**

```bash
cd backend
npm run dev
```

You should see:

```
[DB] Attempting to connect to MongoDB...
[DB] MongoDB connected successfully
[SERVER] Backend listening on port 3000
[SERVER] Starting scheduler...
```

### **2. Start the Frontend**

```bash
cd frontend
npm start
```

The frontend will open at `http://localhost:3000`

## 🧪 **Testing the Application**

### **1. Register Users**

1. Go to `http://localhost:3000/register`
2. Create a Type A user (Requester):

   - Username: `requester1`
   - Email: `requester1@test.com`
   - Password: `password123`
   - Type: `A (Requester)`

3. Create a Type B user (Responder):
   - Username: `responder1`
   - Email: `responder1@test.com`
   - Password: `password123`
   - Type: `B (Responder)`

### **2. Test the Flow**

1. **Login as Type A**:

   - Click "Create Request"
   - Click "Test Backend" to verify connection
   - Click "Test Scheduler" to test automated tasks

2. **Login as Type B**:

   - See the request in "Pending Requests" tab
   - Click "Accept" button
   - Request moves to "Accepted Requests" tab
   - Click on request to enter messaging

3. **Test Messaging**:
   - Type A sends messages
   - Type B responds
   - Check that messages appear in both interfaces

## 🔧 **Development Tools**

### **Backend Testing**

- **Test Endpoint**: `GET /api/test` - Verify backend is working
- **Scheduler Test**: `GET /api/test-scheduler` - Test automated tasks
- **Console Logs**: Comprehensive logging for debugging

### **Frontend Testing**

- **Test Buttons**: Available in Dashboard A
- **Browser Console**: Check for JavaScript errors
- **Network Tab**: Monitor API calls

## 📁 **Project Structure**

```
UnidirectionalCS/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── middleware/      # Authentication middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   └── index.ts        # Main server file
│   ├── package.json
│   └── .env               # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context
│   │   ├── pages/          # Application pages
│   │   ├── api.ts          # API client
│   │   └── App.tsx         # Main app component
│   └── package.json
└── docs/                   # Documentation
```

## 🐛 **Troubleshooting**

### **Common Issues**

1. **MongoDB Connection Error**:

   - Ensure MongoDB is running
   - Check MONGO_URI in .env file
   - Verify database name is correct

2. **Port Already in Use**:

   - Change PORT in .env file
   - Kill existing processes on port 3000

3. **Frontend Won't Start**:

   - Check if backend is running
   - Verify API base URL in frontend/src/api.ts

4. **Authentication Issues**:
   - Check JWT_SECRET in .env
   - Verify token is being sent in requests

### **Getting Help**

1. **Check Logs**: Look at console output for error messages
2. **Check Documentation**: See specific file documentation in `docs/`
3. **Test Endpoints**: Use test buttons to verify functionality
4. **Check Network**: Use browser dev tools to monitor API calls

## 🎯 **Next Steps**

Once you have the application running:

1. **Explore the Code**: Read through the documentation in `docs/`
2. **Understand the Flow**: Follow a complete user journey
3. **Test Features**: Try all the functionality
4. **Customize**: Modify the code for your needs
5. **Deploy**: Follow the deployment guide when ready

## 📚 **Additional Resources**

- [Architecture Documentation](architecture.md)
- [Backend Documentation](backend/README.md)
- [Frontend Documentation](frontend/README.md)
- [Testing Guide](testing.md)
- [Deployment Guide](deployment.md)

Happy coding! 🚀

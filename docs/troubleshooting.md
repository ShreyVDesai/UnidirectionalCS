# Troubleshooting Guide

## 🚨 **Common Issues and Solutions**

This guide helps you diagnose and fix common issues in the Unidirectional Communication System.

## 🔧 **Backend Issues**

### **Issue: Backend Won't Start**

#### **Symptoms**

- `npm run dev` fails
- Port 3000 already in use
- MongoDB connection errors

#### **Solutions**

```bash
# Check if port is in use
sudo netstat -tulpn | grep :3000

# Kill process using port 3000
sudo kill -9 $(sudo lsof -t -i:3000)

# Check MongoDB status
sudo systemctl status mongod

# Start MongoDB if not running
sudo systemctl start mongod

# Check environment variables
cat backend/.env
```

#### **Debug Steps**

1. Check console output for error messages
2. Verify all dependencies are installed (`npm install`)
3. Check if MongoDB is running
4. Verify environment variables are set

### **Issue: Database Connection Failed**

#### **Symptoms**

- `[DB] Failed to connect to MongoDB` error
- Authentication errors
- Connection timeout

#### **Solutions**

```bash
# Check MongoDB status
sudo systemctl status mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Test MongoDB connection
mongo --eval "db.adminCommand('ismaster')"

# Check MONGO_URI in .env
echo $MONGO_URI
```

#### **Common Causes**

- MongoDB not running
- Wrong MONGO_URI format
- Network connectivity issues
- Authentication problems

### **Issue: JWT Token Errors**

#### **Symptoms**

- "Invalid token" errors
- "JWT_SECRET not configured" errors
- Authentication failures

#### **Solutions**

```bash
# Check JWT_SECRET in .env
grep JWT_SECRET backend/.env

# Verify token format
# Token should be: Bearer <actual-token>
```

#### **Debug Steps**

1. Check JWT_SECRET is set in .env
2. Verify token is being sent in Authorization header
3. Check token expiration time
4. Verify token format (Bearer <token>)

### **Issue: Email Service Not Working**

#### **Symptoms**

- Email sending fails
- "No email service configured" warnings
- Gmail authentication errors

#### **Solutions**

```bash
# Check email configuration
grep GMAIL backend/.env

# Test Gmail connection
# Make sure 2FA is enabled and App Password is used
```

#### **Gmail Setup**

1. Enable 2-Factor Authentication
2. Generate App Password
3. Use App Password (not regular password)
4. Update GMAIL_APP_PASSWORD in .env

## 🎨 **Frontend Issues**

### **Issue: Frontend Won't Start**

#### **Symptoms**

- `npm start` fails
- Port 3000 conflicts
- Build errors

#### **Solutions**

```bash
# Check if port is in use
sudo netstat -tulpn | grep :3000

# Use different port
PORT=3001 npm start

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### **Issue: API Calls Failing**

#### **Symptoms**

- Network errors in browser console
- 404 errors
- CORS errors

#### **Solutions**

```typescript
// Check API base URL in frontend/src/api.ts
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Make sure this is correct
});

// Check if backend is running
curl http://localhost:3000/api/test
```

#### **Debug Steps**

1. Check browser Network tab
2. Verify API base URL
3. Check if backend is running
4. Verify CORS configuration

### **Issue: Authentication Not Working**

#### **Symptoms**

- Login fails
- Redirected to login page
- Token not stored

#### **Solutions**

```typescript
// Check token storage
console.log(localStorage.getItem("token"));

// Check AuthContext
console.log(useAuth());

// Verify API calls include token
// Check browser Network tab for Authorization header
```

## 🗄️ **Database Issues**

### **Issue: Data Not Saving**

#### **Symptoms**

- Requests not created
- Messages not saved
- User registration fails

#### **Solutions**

```bash
# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Check database collections
mongo
use unidirectional-comm
show collections

# Check data
db.users.find()
db.requests.find()
db.messages.find()
```

### **Issue: Slow Queries**

#### **Symptoms**

- Slow page loads
- Timeout errors
- High CPU usage

#### **Solutions**

```javascript
// Add database indexes
db.users.createIndex({ email: 1 });
db.users.createIndex({ username: 1 });
db.requests.createIndex({ from: 1 });
db.requests.createIndex({ acceptedBy: 1 });
db.messages.createIndex({ requestId: 1 });
```

## ⚡ **Scheduler Issues**

### **Issue: Scheduler Not Running**

#### **Symptoms**

- No reminder emails
- Messages not deleted
- No scheduler logs

#### **Solutions**

```bash
# Check scheduler logs
# Look for [SCHEDULER] or [CRON] in console output

# Test scheduler manually
curl http://localhost:3000/api/test-scheduler

# Check cron job syntax
# Should be: */5 * * * *
```

### **Issue: Messages Not Being Deleted**

#### **Symptoms**

- Type A messages remain after 1 hour
- Scheduler runs but no deletions

#### **Debug Steps**

1. Check scheduler logs for deletion attempts
2. Verify request acceptance timestamps
3. Check message creation timestamps
4. Test with shorter timeout for debugging

## 🔍 **Debugging Techniques**

### **Backend Debugging**

#### **Enable Debug Logging**

```typescript
// Add to any file for debugging
console.log("[DEBUG] Variable:", variable);
console.log("[DEBUG] Request:", req.body);
console.log("[DEBUG] Response:", response);
```

#### **Check Environment Variables**

```bash
# Check all environment variables
cat backend/.env

# Check specific variable
echo $MONGO_URI
echo $JWT_SECRET
```

#### **Database Debugging**

```javascript
// Connect to MongoDB
mongo

// Check database
use unidirectional-comm
db.stats()

// Check collections
show collections

// Check data
db.users.find().pretty()
db.requests.find().pretty()
db.messages.find().pretty()
```

### **Frontend Debugging**

#### **Browser DevTools**

1. **Console Tab**: Check for JavaScript errors
2. **Network Tab**: Monitor API calls
3. **Application Tab**: Check localStorage
4. **Elements Tab**: Inspect DOM

#### **React DevTools**

1. Install React DevTools extension
2. Inspect component state
3. Check props and context
4. Monitor re-renders

#### **API Debugging**

```typescript
// Add to api.ts for debugging
api.interceptors.request.use((config) => {
  console.log("[API REQUEST]", config);
  return config;
});

api.interceptors.response.use((response) => {
  console.log("[API RESPONSE]", response);
  return response;
});
```

## 📊 **Performance Issues**

### **Issue: Slow Page Loads**

#### **Solutions**

```bash
# Check system resources
htop
free -h
df -h

# Check database performance
mongo
db.setProfilingLevel(2, { slowms: 100 })
db.system.profile.find().sort({ ts: -1 }).limit(5)
```

### **Issue: High Memory Usage**

#### **Solutions**

```bash
# Check Node.js memory usage
pm2 monit

# Restart application
pm2 restart unidirectional-backend

# Check for memory leaks
# Use browser DevTools Memory tab
```

## 🚨 **Error Codes Reference**

### **HTTP Status Codes**

- **400**: Bad Request - Check request body
- **401**: Unauthorized - Check authentication
- **403**: Forbidden - Check authorization
- **404**: Not Found - Check URL/route
- **500**: Internal Server Error - Check server logs

### **Common Error Messages**

- **"Not authenticated"**: JWT token missing/invalid
- **"Only Type A can send requests"**: Wrong user type
- **"Request not found"**: Invalid request ID
- **"username or email already exists"**: Duplicate registration

## 🔧 **Quick Fixes**

### **Reset Everything**

```bash
# Stop all services
pm2 stop all
sudo systemctl stop mongod

# Clear database
mongo
use unidirectional-comm
db.dropDatabase()

# Restart services
sudo systemctl start mongod
pm2 start all
```

### **Reinstall Dependencies**

```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### **Reset Environment**

```bash
# Recreate .env file
cd backend
npm run setup

# Update with correct values
nano .env
```

## 📋 **Diagnostic Checklist**

### **System Check**

- [ ] Node.js installed and working
- [ ] MongoDB running
- [ ] Ports 3000 and 3001 available
- [ ] Environment variables set

### **Application Check**

- [ ] Backend starts without errors
- [ ] Frontend builds successfully
- [ ] API endpoints responding
- [ ] Database connection working

### **Feature Check**

- [ ] User registration works
- [ ] User login works
- [ ] Request creation works
- [ ] Request acceptance works
- [ ] Messaging works
- [ ] Scheduler runs

### **Performance Check**

- [ ] Page load times acceptable
- [ ] API response times acceptable
- [ ] Memory usage stable
- [ ] Database queries optimized

## 🆘 **Getting Help**

### **Information to Provide**

1. **Error Messages**: Exact error text
2. **Steps to Reproduce**: What you did before the error
3. **Environment**: OS, Node.js version, browser
4. **Logs**: Console output, browser console
5. **Configuration**: Environment variables (without secrets)

### **Useful Commands**

```bash
# System information
uname -a
node --version
npm --version
mongo --version

# Application status
pm2 status
sudo systemctl status mongod
sudo systemctl status nginx

# Logs
pm2 logs
sudo tail -f /var/log/mongodb/mongod.log
sudo tail -f /var/log/nginx/error.log
```

This troubleshooting guide should help you resolve most common issues with the Unidirectional Communication System!

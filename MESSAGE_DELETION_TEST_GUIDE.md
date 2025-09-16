# Message Deletion Testing Guide

## 🧪 **Testing Automated Message Deletion**

This guide will help you test the two key functionalities:

1. **Automated task to delete expired messages after 1 hour**
2. **Messages from Type A are automatically deleted after 1 hour**

## 🔧 **Setup for Testing**

### **Step 1: Install Dependencies**

```bash
cd backend
npm install
```

### **Step 2: Configure Environment**

```bash
npm run setup
```

### **Step 3: Start Backend**

```bash
npm run dev
```

## 🚀 **Testing Methods**

### **Method 1: Manual Scheduler Test (Recommended)**

1. **Start the application** and create test data:

   - Register Type A and Type B users
   - Type A creates a request
   - Type B accepts the request
   - Type A sends some messages

2. **Test the scheduler manually**:
   - Click "Test Scheduler" button in Dashboard A
   - Check the console logs for detailed output
   - The test will show:
     - Number of pending requests
     - Number of expired requests
     - Number of messages deleted

### **Method 2: Wait for Natural Deletion**

1. **Create test scenario**:

   - Accept a request
   - Send messages from Type A
   - Wait 1 hour (or modify the timeout for testing)

2. **Check results**:
   - Messages should be automatically deleted
   - Check database or frontend for message count

### **Method 3: Modify Timeout for Quick Testing**

For faster testing, you can temporarily modify the timeout:

1. **Edit `backend/src/utils/scheduler.ts`**:

   ```typescript
   const RESPONSE_WINDOW_MINUTES = 1; // Change from 60 to 1 minute
   ```

2. **Test the flow**:

   - Accept request
   - Send messages
   - Wait 1 minute
   - Check if messages are deleted

3. **Remember to change it back**:
   ```typescript
   const RESPONSE_WINDOW_MINUTES = 60; // Change back to 60 minutes
   ```

## 📊 **Expected Behavior**

### **What Should Happen:**

1. **When a request is accepted**:

   - Type A can send messages
   - Type B receives reminder emails every 5 minutes if not responding

2. **After 1 hour**:

   - Type A messages are automatically deleted
   - Type B messages remain (they're responses, not original messages)
   - Reminder emails stop being sent

3. **Scheduler logs should show**:
   ```
   [SCHEDULER] Running scheduled job (reminders & cleanup)
   [SCHEDULER] Current time: 2024-01-01T12:00:00.000Z
   [SCHEDULER] Checking for pending reminders...
   [SCHEDULER] Found 1 pending requests
   [SCHEDULER] Request 507f1f77bcf86cd799439011: 45.23 minutes since acceptance
   [SCHEDULER] Checking for expired messages...
   [SCHEDULER] Cutoff time: 2024-01-01T11:00:00.000Z
   [SCHEDULER] Found 0 expired requests
   [SCHEDULER] Total messages deleted: 0
   [SCHEDULER] Scheduled job completed successfully
   ```

## 🔍 **Verification Steps**

### **Step 1: Check Database**

```bash
# Connect to MongoDB
mongo
use unidirectional-comm

# Check messages collection
db.messages.find()

# Check requests collection
db.requests.find()
```

### **Step 2: Check Frontend**

- Login as Type A user
- Check if messages are still visible in the messaging interface
- Messages from Type A should be gone after 1 hour

### **Step 3: Check Backend Logs**

Look for these log messages:

- `[SCHEDULER] Running scheduled job`
- `[SCHEDULER] Found X expired requests`
- `[SCHEDULER] Deleted X expired Type A messages`

## 🐛 **Troubleshooting**

### **Issue: Messages Not Being Deleted**

**Check these:**

1. **Scheduler is running**: Look for `[SCHEDULER] Starting scheduler...` in logs
2. **Request is accepted**: Check `acceptedAt` field in database
3. **Time calculation**: Verify the cutoff time calculation
4. **Database connection**: Ensure MongoDB is accessible

### **Issue: Scheduler Not Running**

**Solutions:**

1. **Check cron syntax**: Ensure `*/5 * * * *` is correct
2. **Check imports**: Verify scheduler is imported in `index.ts`
3. **Check errors**: Look for error messages in console

### **Issue: Wrong Messages Being Deleted**

**Verify:**

1. **Message ownership**: Only Type A messages should be deleted
2. **Request relationship**: Messages must be linked to expired requests
3. **Time logic**: Check if `acceptedAt` time is correct

## 📝 **Test Scenarios**

### **Scenario 1: Normal Flow**

1. Type A creates request
2. Type B accepts request
3. Type A sends 3 messages
4. Type B sends 2 responses
5. Wait 1 hour
6. **Expected**: Only Type A's 3 messages should be deleted

### **Scenario 2: No Response**

1. Type A creates request
2. Type B accepts request
3. Type A sends 1 message
4. Type B doesn't respond
5. Wait 1 hour
6. **Expected**: Type A's message deleted, reminder emails stop

### **Scenario 3: Multiple Requests**

1. Create multiple requests
2. Accept some, leave others pending
3. Send messages to accepted requests
4. Wait 1 hour
5. **Expected**: Only messages from expired accepted requests are deleted

## 🎯 **Success Criteria**

✅ **Scheduler runs every 5 minutes**  
✅ **Type A messages are deleted after 1 hour**  
✅ **Type B messages remain intact**  
✅ **Reminder emails stop after 1 hour**  
✅ **Detailed logging shows the process**  
✅ **Manual test endpoint works**

## 🚀 **Production Considerations**

1. **Time Zone**: Ensure server time is correct
2. **Database Indexes**: Add indexes on `acceptedAt` and `createdAt` fields
3. **Error Handling**: Monitor scheduler errors
4. **Logging**: Set up proper log rotation
5. **Monitoring**: Add alerts for scheduler failures

The automated message deletion system is now fully functional and testable!

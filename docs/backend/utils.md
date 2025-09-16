# Utility Functions Documentation

## 📁 **Utils Structure**

The utils directory contains utility functions and services that support the main application functionality.

```
utils/
├── email.ts        # Email service configuration
└── scheduler.ts    # Automated task scheduling
```

## 📧 **Email Service**

**File**: `src/utils/email.ts`

### **Purpose**

Provides email sending functionality with support for multiple email services (Gmail SMTP and AWS SES).

### **Dependencies**

```typescript
import nodemailer from "nodemailer";
```

### **Service Selection Logic**

The email service automatically selects the appropriate email provider based on environment configuration:

```typescript
const createTransporter = () => {
  // Development: Use Gmail SMTP
  if (process.env.NODE_ENV === "development" || !process.env.AWS_REGION) {
    return nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  // Production: Use AWS SES
  return nodemailer.createTransporter({
    SES: {
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
};
```

### **Main Function**

```typescript
export const sendEmail = async (to: string, subject: string, body: string) => {
  // Check if email is configured
  if (!process.env.GMAIL_USER && !process.env.SES_EMAIL) {
    console.warn(
      "[EMAIL] No email service configured — printing email to console instead of sending"
    );
    console.log("EMAIL TO:", to);
    console.log("SUBJECT:", subject);
    console.log("BODY:", body);
    return;
  }

  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.GMAIL_USER || process.env.SES_EMAIL,
      to: to,
      subject: subject,
      text: body,
      html: `<p>${body.replace(/\n/g, "<br>")}</p>`,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("[EMAIL] Email sent successfully:", result.messageId);
    return result;
  } catch (error) {
    console.error("[EMAIL] Error sending email:", error);
    throw error;
  }
};
```

### **Features**

- **Automatic Service Selection**: Chooses Gmail or AWS SES based on environment
- **HTML Support**: Sends both text and HTML versions
- **Fallback Logging**: Logs to console if no email service configured
- **Error Handling**: Comprehensive error handling and logging
- **Development Friendly**: Works without email setup for testing

### **Usage Examples**

```typescript
// Send reminder email
await sendEmail(
  "user@example.com",
  "Reminder: please respond to the accepted request",
  "Hello user,\n\nYou have a pending request that needs your response.\n\nThanks."
);

// Send notification email
await sendEmail(
  "admin@example.com",
  "New Request Created",
  "A new request has been created in the system."
);
```

### **Environment Configuration**

```env
# Gmail Configuration (Development)
GMAIL_USER=your-gmail@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password

# AWS SES Configuration (Production)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
SES_EMAIL=your-verified-email@example.com
```

## ⏰ **Scheduler Service**

**File**: `src/utils/scheduler.ts`

### **Purpose**

Manages automated tasks including reminder emails and message cleanup using cron jobs.

### **Dependencies**

```typescript
import cron from "node-cron";
import RequestModel from "../models/Request";
import MessageModel from "../models/Message";
import User from "../models/User";
import { sendEmail } from "./email";
```

### **Configuration**

```typescript
const REMINDER_EVERY_MINUTES = 5; // Send reminders every 5 minutes
const RESPONSE_WINDOW_MINUTES = 60; // 1 hour response window
```

### **Main Scheduler Function**

```typescript
export const runScheduledTasks = async () => {
  try {
    console.log("[SCHEDULER] Running scheduled job (reminders & cleanup)");
    const now = new Date();
    console.log("[SCHEDULER] Current time:", now.toISOString());

    // 1) Reminders for accepted requests with no response yet
    console.log("[SCHEDULER] Checking for pending reminders...");
    const pending = await RequestModel.find({
      acceptedBy: { $ne: null },
      responded: false,
    });
    console.log("[SCHEDULER] Found", pending.length, "pending requests");

    for (const req of pending) {
      if (!req.acceptedAt) continue;
      const minutes = (now.getTime() - req.acceptedAt.getTime()) / 60000;
      console.log(
        `[SCHEDULER] Request ${req._id}: ${minutes.toFixed(
          2
        )} minutes since acceptance`
      );

      // Send reminders only while within the 1 hour response window
      if (minutes >= 0 && minutes < RESPONSE_WINDOW_MINUTES) {
        const userB = await User.findById(req.acceptedBy);
        const userA = await User.findById(req.from);
        if (userB && userB.email) {
          const subject = "Reminder: please respond to the accepted request";
          const body = `Hello ${userB.username || userB.email},

You accepted a request from ${
            userA?.username || userA?.email
          } at ${req.acceptedAt?.toISOString()}. Please respond within ${RESPONSE_WINDOW_MINUTES} minutes.

Thanks.`;
          try {
            await sendEmail(userB.email, subject, body);
            console.log(`[SCHEDULER] Reminder sent to ${userB.email}`);
          } catch (err) {
            console.error("[SCHEDULER] Email send error:", err);
          }
        }
      }
    }

    // 2) Cleanup: delete Type A messages older than 1 hour
    console.log("[SCHEDULER] Checking for expired messages...");
    const cutoff = new Date(Date.now() - RESPONSE_WINDOW_MINUTES * 60 * 1000);
    console.log("[SCHEDULER] Cutoff time:", cutoff.toISOString());

    // Find requests that were accepted more than 1 hour ago
    const expiredRequests = await RequestModel.find({
      acceptedAt: { $lte: cutoff },
      acceptedBy: { $ne: null },
    });
    console.log(
      "[SCHEDULER] Found",
      expiredRequests.length,
      "expired requests"
    );

    // Delete messages from Type A users for these expired requests
    let totalDeleted = 0;
    for (const req of expiredRequests) {
      const delRes = await MessageModel.deleteMany({
        requestId: req._id,
        from: req.from, // Only delete messages from Type A (the requester)
      });
      if (delRes.deletedCount && delRes.deletedCount > 0) {
        console.log(
          `[SCHEDULER] Deleted ${delRes.deletedCount} expired Type A messages for request ${req._id}`
        );
        totalDeleted += delRes.deletedCount;
      }
    }

    console.log(`[SCHEDULER] Total messages deleted: ${totalDeleted}`);
    console.log("[SCHEDULER] Scheduled job completed successfully");

    return {
      pendingRequests: pending.length,
      expiredRequests: expiredRequests.length,
      messagesDeleted: totalDeleted,
    };
  } catch (err) {
    console.error("[SCHEDULER] Error in scheduled job:", err);
    throw err;
  }
};
```

### **Cron Job Configuration**

```typescript
// Run every 5 minutes
cron.schedule("*/5 * * * *", async () => {
  try {
    await runScheduledTasks();
  } catch (err) {
    console.error("[CRON] Error in scheduled job:", err);
  }
});
```

### **Scheduler Tasks**

#### **1. Reminder Emails**

- **Frequency**: Every 5 minutes
- **Target**: Type B users with accepted but unanswered requests
- **Window**: Only within 1 hour of acceptance
- **Content**: Personalized reminder with request details

#### **2. Message Cleanup**

- **Frequency**: Every 5 minutes
- **Target**: Type A messages older than 1 hour
- **Logic**: Only deletes messages from expired requests
- **Preservation**: Type B responses are preserved

### **Features**

- **Comprehensive Logging**: Detailed logs for monitoring and debugging
- **Error Handling**: Graceful error handling with detailed error messages
- **Performance Tracking**: Logs execution time and results
- **Manual Testing**: Export function for manual testing
- **Configurable Timing**: Easy to modify timing constants

### **Usage Examples**

```typescript
// Manual trigger for testing
const { runScheduledTasks } = await import("./utils/scheduler");
const result = await runScheduledTasks();
console.log("Scheduler results:", result);

// Check scheduler status
// Look for [SCHEDULER] logs in console output
```

### **Testing**

```typescript
// Test scheduler manually
app.get("/api/test-scheduler", async (req, res) => {
  try {
    const { runScheduledTasks } = await import("./utils/scheduler");
    const result = await runScheduledTasks();
    res.json({
      message: "Scheduler test completed",
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Scheduler test failed", details: err.message });
  }
});
```

## 🔧 **Configuration**

### **Environment Variables**

```env
# Email Configuration
GMAIL_USER=your-gmail@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
SES_EMAIL=your-verified-email@example.com

# Scheduler Configuration
NODE_ENV=development
```

### **Cron Schedule Format**

```
* * * * *
│ │ │ │ │
│ │ │ │ └── Day of week (0-7)
│ │ │ └──── Month (1-12)
│ │ └────── Day of month (1-31)
│ └──────── Hour (0-23)
└────────── Minute (0-59)
```

## 🚀 **Best Practices**

### **Email Service**

- **Service Selection**: Automatic selection based on environment
- **Error Handling**: Comprehensive error handling and logging
- **Fallback**: Console logging when no email service configured
- **Security**: Use App Passwords for Gmail, not regular passwords

### **Scheduler Service**

- **Logging**: Comprehensive logging for monitoring
- **Error Handling**: Graceful error handling
- **Performance**: Efficient database queries
- **Testing**: Manual trigger for testing

### **Maintenance**

- **Monitoring**: Monitor scheduler execution
- **Logging**: Regular log review
- **Performance**: Monitor execution time
- **Updates**: Keep dependencies updated

The utility functions provide essential services for email communication and automated task management in the Unidirectional Communication System!

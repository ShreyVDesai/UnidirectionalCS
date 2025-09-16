# Email Setup Guide

## 🚀 **Easy Email Setup Options**

### **Option 1: Gmail (Recommended for Development)**

Gmail is free and easy to set up for development and testing.

#### **Step 1: Enable 2-Factor Authentication**

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. This is required to generate App Passwords

#### **Step 2: Generate App Password**

1. Go to Google Account → Security → 2-Step Verification
2. Scroll down to "App passwords"
3. Generate a new app password for "Mail"
4. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

#### **Step 3: Configure Environment**

Add to your `.env` file:

```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop
NODE_ENV=development
```

#### **Step 4: Test Email**

The system will automatically use Gmail SMTP when `NODE_ENV=development`.

### **Option 2: AWS SES (For Production)**

For production deployment on AWS, you can use SES:

#### **Step 1: Verify Email in SES**

1. Go to AWS SES Console
2. Verify your email address
3. Move out of sandbox mode if needed

#### **Step 2: Configure Environment**

```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
SES_EMAIL=your-verified-email@example.com
NODE_ENV=production
```

### **Option 3: Console Logging (No Setup Required)**

If you don't want to set up email right now, the system will automatically log emails to the console:

```env
# Leave GMAIL_USER and SES_EMAIL empty
NODE_ENV=development
```

## 🔧 **Automatic Email Service Selection**

The system automatically chooses the email service based on your configuration:

1. **Development Mode**: Uses Gmail SMTP if `GMAIL_USER` is configured
2. **Production Mode**: Uses AWS SES if `AWS_REGION` is configured
3. **Fallback**: Logs emails to console if no service is configured

## 📧 **Email Features**

- **Reminder Emails**: Sent every 5 minutes if Type B doesn't respond
- **HTML Support**: Emails include both text and HTML versions
- **Error Handling**: Comprehensive error logging
- **Automatic Retry**: Built-in retry logic for failed sends

## 🚨 **Troubleshooting**

### **Gmail Issues**

- Make sure you're using an App Password, not your regular password
- Ensure 2-Factor Authentication is enabled
- Check that "Less secure app access" is not enabled (use App Passwords instead)

### **AWS SES Issues**

- Verify your email address in SES console
- Check IAM permissions for SES
- Ensure you're not in sandbox mode for production

### **General Issues**

- Check the console logs for detailed error messages
- Verify environment variables are set correctly
- Test with the console logging option first

## 📝 **Quick Start**

1. **For immediate testing**: Leave email fields empty - emails will be logged to console
2. **For Gmail**: Set up App Password and add to `.env`
3. **For production**: Configure AWS SES

The system is designed to work seamlessly across all these options!

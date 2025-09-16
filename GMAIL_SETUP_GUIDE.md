# Gmail SMTP Setup Guide

This guide will help you set up Gmail SMTP for sending emails from your Unidirectional Communication System using Nodemailer.

## 📧 Why Gmail SMTP?

- **Free**: No cost for sending emails
- **Reliable**: Google's infrastructure
- **Easy Setup**: Simple configuration
- **High Limits**: 500 emails/day for free accounts
- **No AWS Complexity**: No need for SES verification

## 🔧 Step-by-Step Setup

### Step 1: Enable 2-Factor Authentication

1. **Go to Google Account Settings:**

   - Visit [myaccount.google.com](https://myaccount.google.com)
   - Sign in with your Gmail account

2. **Navigate to Security:**

   - Click on "Security" in the left sidebar
   - Look for "2-Step Verification"

3. **Enable 2-Step Verification:**
   - Click "Get started"
   - Follow the setup process
   - You'll need a phone number for verification

### Step 2: Generate App Password

1. **Go to App Passwords:**

   - In Google Account > Security
   - Look for "App passwords" (you'll only see this if 2FA is enabled)
   - Click "App passwords"

2. **Create New App Password:**

   - Select "Mail" from the dropdown
   - Click "Generate"
   - **Copy the 16-character password** (you won't see it again!)

3. **Save the Password:**
   - This password is different from your regular Gmail password
   - Use this in your `.env` file as `GMAIL_APP_PASSWORD`

### Step 3: Configure Your Application

1. **Update your `.env` file:**

   ```env
   GMAIL_USER=your-gmail@gmail.com
   GMAIL_APP_PASSWORD=your-16-character-app-password
   ```

2. **Example:**
   ```env
   GMAIL_USER=john.doe@gmail.com
   GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
   ```

## 🚨 Important Notes

### Security Considerations

- **Never commit** your `.env` file to version control
- **Use App Passwords** instead of your regular password
- **Keep App Passwords secure** - they provide full access to your Gmail

### Gmail Limits

- **Free Accounts**: 500 emails/day
- **Paid Accounts**: 2,000 emails/day
- **Rate Limiting**: Gmail may throttle if you send too many emails quickly

### Troubleshooting

#### "Invalid Login" Error

- **Check 2FA**: Make sure 2-Factor Authentication is enabled
- **Check App Password**: Verify you're using the App Password, not your regular password
- **Check Username**: Ensure `GMAIL_USER` is your full email address

#### "Less Secure Apps" Error

- **Use App Passwords**: Don't use "Less secure app access"
- **Enable 2FA**: This is required for App Passwords

#### "Quota Exceeded" Error

- **Check Daily Limit**: You may have hit the 500 emails/day limit
- **Wait 24 Hours**: Limits reset daily
- **Consider Paid Account**: For higher limits

## 🔄 Alternative Email Services

If Gmail doesn't work for you, here are alternatives:

### 1. Outlook/Hotmail SMTP

```env
# In your .env file
EMAIL_SERVICE=outlook
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-app-password
```

### 2. Yahoo SMTP

```env
# In your .env file
EMAIL_SERVICE=yahoo
EMAIL_USER=your-email@yahoo.com
EMAIL_PASSWORD=your-app-password
```

### 3. Custom SMTP Server

```env
# For other providers
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASSWORD=your-password
```

## 🧪 Testing Email Functionality

### 1. Test Backend Connection

```bash
curl http://your-domain.com/api/test
```

### 2. Test Scheduler (Sends Emails)

```bash
curl http://your-domain.com/api/test-scheduler
```

### 3. Test Email Manually

1. Register a Type A user
2. Register a Type B user
3. Create a request (Type A)
4. Accept the request (Type B)
5. Send a message (Type A)
6. Check if Type B receives reminder emails

## 📱 Mobile Gmail Setup

If you're using Gmail on mobile:

1. **Enable 2FA on Mobile:**

   - Open Gmail app
   - Go to Settings > Google Account
   - Security > 2-Step Verification

2. **Generate App Password:**
   - Use the same process as desktop
   - The App Password works across all devices

## 🔒 Security Best Practices

### For Development

- Use a dedicated Gmail account for testing
- Don't use your personal Gmail for development
- Keep App Passwords in `.env` files only

### For Production

- Consider using a professional email service
- Monitor email sending limits
- Set up proper error handling
- Log email sending attempts

## 📊 Monitoring Email Usage

### Check Gmail Usage

1. Go to [Gmail Settings](https://mail.google.com/mail/u/0/#settings/general)
2. Look for "Mail and Spam" section
3. Check your daily sending statistics

### Application Logs

```bash
# Check if emails are being sent
pm2 logs backend | grep EMAIL

# Check scheduler logs
pm2 logs backend | grep SCHEDULER
```

## 🆘 Common Issues & Solutions

### Issue: "Authentication Failed"

**Solution:**

- Verify 2FA is enabled
- Check App Password is correct
- Ensure username is full email address

### Issue: "Connection Timeout"

**Solution:**

- Check internet connection
- Verify Gmail SMTP settings
- Try different SMTP port (587 or 465)

### Issue: "Daily Limit Exceeded"

**Solution:**

- Wait 24 hours for limit reset
- Upgrade to paid Gmail account
- Use multiple Gmail accounts (rotate)

### Issue: "Emails Going to Spam"

**Solution:**

- Add proper email headers
- Use professional email templates
- Avoid spam trigger words

## 📞 Support

If you're still having issues:

1. **Check Gmail Status**: [Gmail Status Page](https://www.google.com/appsstatus)
2. **Review Logs**: Check application logs for specific errors
3. **Test Manually**: Try sending emails manually first
4. **Alternative**: Consider using a different email service

---

**Ready to send emails?** Follow these steps and your application will be sending emails via Gmail SMTP! 📧

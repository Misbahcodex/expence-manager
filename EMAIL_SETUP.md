# Email Setup Guide

## 🚨 Current Status: Development Mode

Your email system is currently in **development mode**. This means:
- ✅ Verification links are logged to the console
- ✅ You can test the full flow without real emails
- ❌ No actual emails are sent

## 🔧 How to Test Email Verification

### 1. Sign Up Process
1. Go to `http://localhost:3000/signup`
2. Fill out the form and submit
3. Check the **backend console** for the verification URL
4. Copy the verification URL from the console
5. Paste it in your browser to verify your email

### 2. Console Output Example
When you sign up, you'll see something like this in the backend console:
```
🔗 VERIFICATION URL FOR TESTING:
http://localhost:3000/verify-email?token=abc123def456...
🔗 END VERIFICATION URL

📧 EMAIL WOULD BE SENT:
From: noreply@yourapp.com
To: your-email@example.com
Subject: Verify Your Email
Content: <h2>Welcome to Our App!</h2>...
📧 END EMAIL LOG
```

## 📧 Setting Up Real Email (Production)

### Option 1: Gmail Setup

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password
3. **Update the backend code**:

```javascript
// In app/backend/routes/auth.js, replace the development transporter with:
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-16-digit-app-password'
  }
});
```

### Option 2: Other Email Services

#### Outlook/Hotmail
```javascript
const transporter = nodemailer.createTransporter({
  service: 'outlook',
  auth: {
    user: 'your-email@outlook.com',
    pass: 'your-password'
  }
});
```

#### Custom SMTP
```javascript
const transporter = nodemailer.createTransporter({
  host: 'smtp.your-provider.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@domain.com',
    pass: 'your-password'
  }
});
```

## 🧪 Testing Steps

### Step 1: Test Signup
1. Start the backend server: `cd app/backend && node index.js`
2. Start the frontend: `npm run dev`
3. Go to `http://localhost:3000/signup`
4. Fill the form and submit
5. Check the backend console for the verification URL

### Step 2: Test Email Verification
1. Copy the verification URL from the console
2. Paste it in your browser
3. You should see "Email verified successfully!"

### Step 3: Test Login
1. Go to `http://localhost:3000/login`
2. Use the email and password you just created
3. You should be redirected to the dashboard

## 🔍 Troubleshooting

### Common Issues:

1. **"Email sending failed" error**:
   - Check if nodemailer is installed: `npm install nodemailer`
   - Verify email credentials are correct
   - For Gmail, make sure you're using an App Password, not your regular password

2. **"Invalid verification token" error**:
   - Make sure you're using the correct verification URL from the console
   - Check if the token hasn't expired (they don't expire in development mode)

3. **Database errors**:
   - Make sure MySQL is running
   - Check database connection in `app/backend/db.js`

### Debug Commands:

```bash
# Check if backend is running
curl http://localhost:4000/api/signup

# Test database connection
cd app/backend
node -e "const db = require('./db'); db.query('SELECT 1', console.log)"
```

## 🎯 Quick Test

To quickly test the email verification flow:

1. **Sign up**: `http://localhost:3000/signup`
2. **Copy verification URL** from backend console
3. **Paste URL** in browser
4. **Login**: `http://localhost:3000/login`
5. **Access dashboard**: `http://localhost:3000/dashboard`

## 📝 Notes

- In development mode, verification URLs are logged to the console
- No actual emails are sent, making testing faster
- For production, configure real email credentials
- Always use environment variables for sensitive data in production

The email verification system is working correctly - you just need to check the console for the verification links! 🎉 
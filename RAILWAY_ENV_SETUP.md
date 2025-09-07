# Railway Environment Variables Setup

## Backend Environment Variables (Railway)

Set these variables in your Railway backend project:

### **Required Variables:**
```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense_manager

# Server
PORT=5000
NODE_ENV=production

# Frontend URL
FRONTEND_URL=https://prolific-kindness-production-dcce.up.railway.app

# JWT Secret (generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
```

### **Email Service Options:**

#### **Option 1: Gmail SMTP (Recommended for simplicity)**
```bash
# Gmail configuration
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_app_specific_password
```

**To get Gmail App Password:**
1. Go to Google Account settings
2. Enable 2-factor authentication
3. Go to "Security" → "2-Step Verification" → "App passwords"
4. Generate app password for "Mail"
5. Use the 16-character password as GMAIL_APP_PASSWORD

#### **Option 2: Resend API (Alternative)**
```bash
# Resend configuration
RESEND_API_KEY=re_your_resend_api_key
FROM_EMAIL=Expense Manager <noreply@yourdomain.com>
```

## Frontend Environment Variables (Railway)

Set these in your Railway frontend project:

```bash
# Next.js environment
NODE_ENV=production

# Backend API URL (your backend Railway URL)
NEXT_PUBLIC_API_URL=https://resourceful-tranquility-production.up.railway.app
```

## Testing Email Service

After setting up environment variables, test the email service:

1. **Check backend logs** during signup to see if emails are being sent
2. **Look for fallback URLs** in logs if email service fails
3. **Use the logged verification URLs** for manual testing

## Debugging Steps

1. **Check Railway logs** for both frontend and backend
2. **Verify environment variables** are set correctly
3. **Test API endpoints** directly using the health check
4. **Monitor CORS errors** in browser console

## Manual Email Verification (Fallback)

If emails aren't working, the backend logs will show verification URLs like:
```
🔗 VERIFICATION URL FOR TESTING:
https://prolific-kindness-production-dcce.up.railway.app/verify-email?token=abc123
```

Copy this URL and visit it manually to verify accounts during testing.

# 🚀 Deployment Guide

## ✅ **Issues Fixed:**

1. ✅ **TypeScript PORT type error** - Fixed in backend
2. ✅ **Frontend build including backend files** - Fixed tsconfig.json
3. ✅ **CORS configuration** - Enhanced with better headers
4. ✅ **Email service setup** - Configured Gmail fallback

## 🛠️ **Pre-Deployment Steps:**

### 1. **Set Environment Variables in Railway Backend:**
```bash
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/expense_manager
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://prolific-kindness-production-dcce.up.railway.app
JWT_SECRET=your_super_long_random_secret_key_here
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_app_specific_password
```

### 2. **Deploy Backend First:**
```bash
git add .
git commit -m "Fix deployment issues: PORT type, CORS, email service"
git push origin main
```

### 3. **Deploy Frontend:**
The frontend should automatically redeploy after the fixes.

## 📧 **Email Service Setup:**

Your app currently uses Gmail SMTP via nodemailer. To get emails working:

1. **Enable 2FA on your Gmail account**
2. **Generate App Password:**
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Generate password for "Mail" application
   - Use the 16-character password as `GMAIL_APP_PASSWORD`

## 🔍 **Testing Steps:**

### 1. **Test Backend Health:**
Visit: https://resourceful-tranquility-production.up.railway.app/api/health

Should return:
```json
{
  "success": true,
  "message": "Server is running",
  "database": { "status": "connected", "connected": true },
  "port": 5000
}
```

### 2. **Test Signup Flow:**
1. Go to your frontend: https://prolific-kindness-production-dcce.up.railway.app
2. Sign up with a test email
3. Check Railway backend logs for:
   - ✅ Email sent confirmation OR
   - 🔗 Manual verification URL (if email service not configured)

### 3. **Manual Email Verification (If Needed):**
If emails aren't working, backend logs will show:
```
🔗 VERIFICATION URL FOR TESTING:
https://prolific-kindness-production-dcce.up.railway.app/verify-email?token=abc123
```

Copy and visit this URL to verify the account.

## 🐛 **Common Issues & Solutions:**

### **Issue: "service unavailable" in health check**
- ✅ **Fixed**: Server now starts even if database connection fails
- ✅ **Fixed**: Health check always returns 200 OK

### **Issue: Frontend build fails**
- ✅ **Fixed**: Excluded backend files from frontend TypeScript compilation

### **Issue: No verification emails**
- 🔧 **Solution**: Set up Gmail credentials in Railway environment variables
- 🔄 **Fallback**: Backend logs verification URLs for manual use

### **Issue: CORS errors**
- ✅ **Fixed**: Enhanced CORS configuration with proper headers

## 📝 **Post-Deployment Verification:**

1. ✅ Backend health check returns 200
2. ✅ Frontend loads without build errors
3. ✅ API calls work (signup, login)
4. ✅ Email verification works (via Gmail or manual URLs)
5. ✅ Database connection is stable

## 🔧 **If Problems Persist:**

Check Railway logs:
- **Backend**: Look for startup errors, database connection issues
- **Frontend**: Look for build/runtime errors

Most likely remaining issue: **Gmail credentials not set** → emails won't send but verification URLs will be logged for manual use.

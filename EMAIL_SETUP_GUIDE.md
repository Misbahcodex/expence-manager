# 📧 Email Service Setup Guide

## 🚨 Current Issue
- Signup works ✅
- Email sending fails with `ETIMEDOUT` connection error ❌
- Manual verification links provided in logs ✅

## ✅ Solution: Gmail SMTP Setup

### **Step 1: Enable Google 2FA & App Password**

1. **Go to Google Account**: https://myaccount.google.com/
2. **Security** → **2-Step Verification** (enable if not already enabled)
3. **Security** → **2-Step Verification** → **App passwords**
4. **Select app**: Mail
5. **Select device**: Other (custom name) → "Railway Backend"
6. **Generate** → Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### **Step 2: Set Railway Environment Variables**

Go to **Railway Dashboard** → **Your Backend Project** → **Variables** tab:

```bash
# Gmail SMTP Configuration
GMAIL_USER=adilmisbah25@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop

# Required for proper email URLs
FRONTEND_URL=https://prolific-kindness-production-dcce.up.railway.app

# Database (should already be set)
MONGODB_URI=mongodb+srv://username:password@cluster0.yv5anjt.mongodb.net/expense_manager

# JWT Secret (should already be set) 
JWT_SECRET=your_long_random_secret_here
```

### **Step 3: Redeploy Backend**

After adding environment variables, Railway will automatically redeploy your backend.

### **Step 4: Test Email**

1. **Try signup again** from frontend
2. **Check logs** - should see "✅ Verification email sent successfully"
3. **Check Gmail inbox** - should receive styled verification email
4. **Click verification link** - should redirect to frontend and mark account as verified

## 🔧 Alternative: Quick Manual Test

**For immediate testing**, use the verification link from current logs:

```
https://prolific-kindness-production-dcce.up.railway.app/verify-email?token=630ce161-1375-4112-b7c8-3c5e14fa2d3c
```

1. Click this link
2. Account should be verified
3. Try logging in with: `adilmisbah25@gmail.com` + your signup password

## 📋 Verification Checklist

- [ ] Gmail 2FA enabled
- [ ] App password generated (16 characters)
- [ ] `GMAIL_USER` set in Railway
- [ ] `GMAIL_APP_PASSWORD` set in Railway
- [ ] `FRONTEND_URL` set in Railway
- [ ] Backend redeployed automatically
- [ ] Test signup → email received → verification works
- [ ] Test login → success
- [ ] Test transaction creation

## 🐛 Troubleshooting

**If emails still don't work:**
- Check Railway logs for connection errors
- Verify Gmail credentials are correct
- Ensure Gmail account allows "Less secure app access" (though App Password should bypass this)
- Check spam folder

**Railway Logs will show:**
- ✅ `"Verification email sent successfully"` = Working
- ❌ `"Connection timeout"` or `"Auth failed"` = Check credentials

## 🚀 Production Notes

- Gmail SMTP allows ~100 emails/day for free accounts
- For higher volume, consider upgrading to GSuite or using dedicated email service (SendGrid, Resend, etc.)
- Current setup is perfect for personal/development use

# 🚂 Full Railway Deployment Guide

This guide will help you deploy your **entire Expense Manager app** (frontend + backend) on Railway.

## 📋 Prerequisites

- GitHub account
- Railway account (free)
- MongoDB Atlas account (free)

## 🗄️ Step 1: Set up MongoDB Atlas

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account
   - Create a new cluster (choose the free M0 tier)

2. **Configure Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Create a username and password (save these!)
   - Set privileges to "Read and write to any database"

3. **Configure Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Choose "Allow access from anywhere" (0.0.0.0/0)
   - Click "Confirm"

4. **Get Connection String**
   - Go to "Clusters" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (replace `<password>` with your password)

## 🚂 Step 2: Deploy Full App to Railway

1. **Push Code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for full Railway deployment"
   git push origin main
   ```

2. **Deploy to Railway**
   - Go to [Railway](https://railway.app)
   - Sign up with GitHub
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select your repository
   - **Important**: Choose the **root directory** (not backend folder)

3. **Configure Environment Variables**
   - In Railway dashboard, go to your project
   - Click on "Variables" tab
   - Add these environment variables:
     ```
     MONGODB_URI=mongodb+srv://misbahcodex:tAJzG0Dlk0KqIuq0@cluster0.yv5anjt.mongodb.net/expense_manager
     JWT_SECRET=your-super-secure-jwt-secret-key-here
     JWT_EXPIRES_IN=7d
     EMAIL_HOST=smtp.gmail.com
     EMAIL_PORT=587
     EMAIL_USER=your-email@gmail.com
     EMAIL_PASS=your-app-password
     PORT=5000
     NODE_ENV=production
     FRONTEND_URL=https://your-railway-app.railway.app
     NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app/api
     ```

4. **Get Your Railway URL**
   - After deployment, Railway will give you a URL like: `https://your-app.railway.app`
   - This URL will serve both your frontend and backend

## 🔧 Step 3: How It Works

### **Railway Full-Stack Setup:**

1. **Frontend** runs on the main port (usually 3000)
2. **Backend API** runs on the same port with `/api` prefix
3. **MongoDB** connects via Atlas
4. **Single URL** serves everything

### **URL Structure:**
- **Frontend**: `https://your-app.railway.app`
- **API**: `https://your-app.railway.app/api`
- **Health Check**: `https://your-app.railway.app/api/health`

## 🛠️ Step 4: Test Your Deployment

1. **Visit your Railway URL**
2. **Test the application:**
   - Register a new user
   - Verify email (check your email)
   - Login with the account
   - Add transactions
   - View dashboard

## 🔧 Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check Railway logs for build errors
   - Ensure all dependencies are installed
   - Verify Node.js version compatibility

2. **Database Connection Issues**
   - Verify MongoDB Atlas connection string
   - Check that your IP is whitelisted
   - Ensure database user has correct permissions

3. **Port Issues**
   - Railway automatically assigns ports
   - Use `process.env.PORT` in your backend
   - Frontend will be served on the main port

4. **Environment Variables**
   - Make sure all required variables are set
   - Check that `NEXT_PUBLIC_API_URL` points to your Railway URL

### Useful Commands:

```bash
# Check Railway logs
railway logs

# Redeploy
railway up

# Check service status
railway status
```

## 📊 Monitoring

- **Railway Dashboard**: Monitor both frontend and backend
- **MongoDB Atlas**: Monitor database performance
- **Railway Logs**: Check for any errors

## 💰 Cost Estimation

- **Railway**: Free tier (500 hours/month)
- **MongoDB Atlas**: Free tier (512MB storage)

Total monthly cost: **$0** (within free tier limits)

## 🎯 Advantages of Full Railway Deployment

✅ **Single Platform**: Everything in one place
✅ **Simpler Setup**: No need to manage multiple services
✅ **Automatic Scaling**: Railway handles scaling
✅ **Easy Updates**: Single deployment for both frontend and backend
✅ **Cost Effective**: Free tier covers most use cases

---

🎉 **Congratulations!** Your full-stack Expense Manager app is now live on Railway!

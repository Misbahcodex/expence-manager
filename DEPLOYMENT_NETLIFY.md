# 🚀 Netlify + Railway Deployment Guide

This guide will help you deploy your Expense Manager app using **Netlify + Railway + MongoDB Atlas**.

## 📋 Prerequisites

- GitHub account
- Netlify account (free)
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

## 🚂 Step 2: Deploy Backend to Railway

1. **Push Code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Netlify deployment"
   git push origin main
   ```

2. **Deploy to Railway**
   - Go to [Railway](https://railway.app)
   - Sign up with GitHub
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select your repository
   - Choose the `backend` folder as the root directory

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
     FRONTEND_URL=https://your-netlify-app.netlify.app
     ```

4. **Get Railway URL**
   - After deployment, Railway will give you a URL like: `https://your-app.railway.app`
   - Save this URL for the next step

## ⚡ Step 3: Deploy Frontend to Netlify

1. **Deploy to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Sign up with GitHub
   - Click "New site from Git"
   - Choose "GitHub" and select your repository
   - Set build settings:
     - **Build command**: `npm run build`
     - **Publish directory**: `.next`
   - Click "Deploy site"

2. **Configure Environment Variables**
   - In Netlify dashboard, go to your site
   - Click "Site settings" → "Environment variables"
   - Add this variable:
     ```
     NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app/api
     ```

3. **Update netlify.toml**
   - After getting your Railway URL, update the `netlify.toml` file
   - Replace `your-railway-app.railway.app` with your actual Railway URL
   - Commit and push the changes

4. **Update Backend CORS**
   - Go back to Railway
   - Update the `FRONTEND_URL` variable with your Netlify URL
   - Redeploy the backend

## 🔧 Step 4: Final Configuration

1. **Update netlify.toml with your Railway URL**
   ```toml
   [[redirects]]
     from = "/api/*"
     to = "https://your-actual-railway-app.railway.app/api/:splat"
     status = 200
     force = true
   ```

2. **Test Your Deployment**
   - Visit your Netlify URL
   - Try registering a new user
   - Test transaction creation
   - Verify email functionality

## 🛠️ Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Make sure `FRONTEND_URL` in Railway matches your Netlify URL
   - Check that the URL doesn't have trailing slashes

2. **API Redirect Issues**
   - Verify the Railway URL in `netlify.toml` is correct
   - Check that the redirect pattern is working

3. **Database Connection Issues**
   - Verify MongoDB Atlas connection string
   - Check that your IP is whitelisted
   - Ensure database user has correct permissions

### Useful Commands:

```bash
# Check Railway logs
railway logs

# Check Netlify logs
netlify logs

# Redeploy Railway
railway up

# Redeploy Netlify
git push origin main
```

## 📊 Monitoring

- **Netlify**: Monitor frontend performance and analytics
- **Railway**: Monitor backend performance and logs
- **MongoDB Atlas**: Monitor database performance and usage

## 💰 Cost Estimation

- **Netlify**: Free tier (100GB bandwidth, 300 build minutes)
- **Railway**: Free tier (500 hours/month)
- **MongoDB Atlas**: Free tier (512MB storage)

Total monthly cost: **$0** (within free tier limits)

---

🎉 **Congratulations!** Your Expense Manager app is now live on Netlify!

# 🚀 Deployment Guide - Expense Manager

This guide will help you deploy your Expense Manager app using Vercel + Railway + MongoDB Atlas.

## 📋 Prerequisites

- GitHub account
- Vercel account (free)
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
   git commit -m "Prepare for deployment"
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
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense_manager
     JWT_SECRET=your-super-secure-jwt-secret-key-here
     JWT_EXPIRES_IN=7d
     EMAIL_HOST=smtp.gmail.com
     EMAIL_PORT=587
     EMAIL_USER=your-email@gmail.com
     EMAIL_PASS=your-app-password
     PORT=5000
     NODE_ENV=production
     FRONTEND_URL=https://your-vercel-app.vercel.app
     ```

4. **Get Railway URL**
   - After deployment, Railway will give you a URL like: `https://your-app.railway.app`
   - Save this URL for the next step

## ⚡ Step 3: Deploy Frontend to Vercel

1. **Deploy to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Choose the root directory (not backend)
   - Click "Deploy"

2. **Configure Environment Variables**
   - In Vercel dashboard, go to your project
   - Click "Settings" → "Environment Variables"
   - Add this variable:
     ```
     NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app/api
     ```

3. **Update Backend CORS**
   - Go back to Railway
   - Update the `FRONTEND_URL` variable with your Vercel URL
   - Redeploy the backend

## 🔧 Step 4: Final Configuration

1. **Update Email Settings**
   - For production, consider using a service like SendGrid or Mailgun
   - Or use Gmail App Passwords (as configured)

2. **Test Your Deployment**
   - Visit your Vercel URL
   - Try registering a new user
   - Test transaction creation
   - Verify email functionality

## 🛠️ Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Make sure `FRONTEND_URL` in Railway matches your Vercel URL
   - Check that the URL doesn't have trailing slashes

2. **Database Connection Issues**
   - Verify MongoDB Atlas connection string
   - Check that your IP is whitelisted
   - Ensure database user has correct permissions

3. **Email Not Working**
   - Check Gmail App Password is correct
   - Verify email environment variables
   - Check Railway logs for email errors

### Useful Commands:

```bash
# Check Railway logs
railway logs

# Check Vercel logs
vercel logs

# Redeploy Railway
railway up

# Redeploy Vercel
vercel --prod
```

## 📊 Monitoring

- **Railway**: Monitor backend performance and logs
- **Vercel**: Monitor frontend performance and analytics
- **MongoDB Atlas**: Monitor database performance and usage

## 🔒 Security Notes

- Use strong, unique passwords for all services
- Keep your JWT secret secure and don't commit it to Git
- Regularly rotate your API keys and passwords
- Monitor your application logs for any suspicious activity

## 💰 Cost Estimation

- **Vercel**: Free tier (generous limits)
- **Railway**: Free tier (500 hours/month)
- **MongoDB Atlas**: Free tier (512MB storage)

Total monthly cost: **$0** (within free tier limits)

---

🎉 **Congratulations!** Your Expense Manager app is now live and accessible worldwide!

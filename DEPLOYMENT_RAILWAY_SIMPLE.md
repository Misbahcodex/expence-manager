# 🚂 Simple Railway Deployment Guide

Since the full-stack deployment is having issues, let's deploy the frontend and backend separately.

## 🎯 **Recommended Approach: Frontend + Backend on Railway**

### **Step 1: Deploy Backend to Railway**

1. **Create Backend Project on Railway**
   - Go to [Railway](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - **Choose `backend` folder as root directory**

2. **Add Environment Variables to Backend**
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
   FRONTEND_URL=https://your-frontend-app.railway.app
   ```

3. **Get Backend URL**
   - After deployment, you'll get a URL like: `https://your-backend-app.railway.app`
   - Save this URL for the frontend

### **Step 2: Deploy Frontend to Railway**

1. **Create Frontend Project on Railway**
   - Go to [Railway](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - **Choose root directory** (not backend folder)

2. **Add Environment Variables to Frontend**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-app.railway.app/api
   ```

3. **Get Frontend URL**
   - After deployment, you'll get a URL like: `https://your-frontend-app.railway.app`

### **Step 3: Update Backend CORS**

1. **Go to your Backend project on Railway**
2. **Update the `FRONTEND_URL` variable** with your frontend URL
3. **Redeploy the backend**

## 🎯 **Alternative: Use Vercel + Railway**

If Railway continues to have issues with Next.js, you can use:

1. **Frontend**: Deploy to Vercel (excellent for Next.js)
2. **Backend**: Deploy to Railway
3. **Database**: MongoDB Atlas

### **Vercel + Railway Setup:**

1. **Deploy Backend to Railway** (as above)
2. **Deploy Frontend to Vercel**:
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Add environment variable: `NEXT_PUBLIC_API_URL=https://your-backend-app.railway.app/api`
3. **Update Backend CORS** with your Vercel URL

## 🚀 **Quick Start Commands:**

```bash
# Push your code
git add .
git commit -m "Fix Railway deployment configuration"
git push origin main

# Then deploy to Railway:
# 1. Backend: Select backend folder
# 2. Frontend: Select root folder
```

## 💡 **Why This Approach Works Better:**

✅ **Simpler Configuration**: Each service has its own configuration
✅ **Better Debugging**: Easier to troubleshoot individual services
✅ **Railway Optimized**: Each service uses Railway's best practices
✅ **Scalable**: Can scale frontend and backend independently

---

Choose the approach that works best for you! The separate deployment is more reliable than the full-stack approach.

# 🚂 Railway Deployment Guide - Step by Step

## 🎯 **Option A: Deploy from Same Repository (Recommended)**

### **Step 1: Deploy Backend**

1. **Go to [Railway](https://railway.app)**
2. **Click "New Project"**
3. **Choose "Deploy from GitHub repo"**
4. **Select your `expence-manager` repository**
5. **Look for one of these:**
   - **"Root Directory"** field → Enter `backend`
   - **"Configure"** button → Click it → Set root directory to `backend`
   - **"Settings"** tab → Look for root directory option

### **Step 2: If You Can't Find Root Directory Option**

1. **Deploy the project as-is** (it will use root directory)
2. **After deployment, go to your project dashboard**
3. **Click on "Settings" tab**
4. **Look for "Build Settings" or "Root Directory"**
5. **Change it to `backend`**
6. **Redeploy the project**

## 🎯 **Option B: Create Separate Backend Repository (Alternative)**

If the above doesn't work, create a separate repository:

### **Step 1: Create Backend Repository**

1. **Go to GitHub**
2. **Create a new repository** called `expense-manager-backend`
3. **Copy only the backend folder** to this new repository
4. **Push the code**

### **Step 2: Deploy Backend Repository**

1. **Go to Railway**
2. **Deploy from the new `expense-manager-backend` repository**
3. **No root directory configuration needed**

## 🎯 **Option C: Use Railway CLI (Advanced)**

If you have Railway CLI installed:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy backend folder
cd backend
railway deploy
```

## 🔍 **What to Look For in Railway Interface**

When you're in the Railway project setup:

1. **Look for these sections:**
   - "Build Settings"
   - "Root Directory" 
   - "Configure"
   - "Advanced Settings"

2. **Common locations:**
   - Right after selecting the repository
   - In the project settings after deployment
   - In the "Deploy" tab

3. **If you see a file tree:**
   - Look for a checkbox or selection option
   - Select the `backend` folder

## 🆘 **Still Can't Find It?**

If you still can't find the root directory option:

1. **Take a screenshot** of your Railway interface
2. **Or describe what you see** after selecting your repository
3. **I'll help you find the exact location**

## 🎯 **Quick Test**

Once you deploy the backend:

1. **Visit your Railway URL + `/api/health`**
2. **You should see:** `{"success":true,"message":"Server is running"}`
3. **If you see this, the backend is working!**

---

**Which option would you like to try first?** Let me know what you see in your Railway interface!

# Complete Railway Deployment Guide

## Why Railway?
- **Better MongoDB connectivity** than Vercel (traditional server model, not serverless)
- **No cold starts** - connections persist
- **Better connection pooling** for MongoDB Atlas
- **Simple configuration** - works with standard Node.js apps

## Step-by-Step Manual Deployment

### 1. Create Railway Account
- Go to https://railway.app
- Click "Sign in" → Accept Terms of Service (scroll down in the modal)
- Click "Accept" button at the bottom
- Login with GitHub (authorize the app)

### 2. Create New Project
- After login, you'll see the Dashboard
- Click "Create New Project" or "+ New Project"
- Select "Deploy from GitHub repo"
- Search for: `solsonn` or go to https://github.com/sandeepnaiduruttala-sys/solsonn
- Click "Connect" to authorize Railway to access your GitHub account
- Select the repository
- Click "Deploy"

### 3. Wait for Build
- Railway will start building your app
- You'll see "Building..." → "Deploying..." → "Deployed"
- This typically takes 2-5 minutes

### 4. Add Environment Variables
**IMPORTANT:** Set these BEFORE the deployment completes if possible, or immediately after

In the Railway dashboard:
1. Click on your newly created project/deployment
2. Look for "Variables" tab or settings
3. Click "Add Variable" or "New Variable"
4. Add these variables:

```
MONGODB_URI = mongodb+srv://sandeepnaiduruttala_db_user:sandeep12345@solson.5qh1dic.mongodb.net/?appName=solson
JWT_SECRET = sandeep12345
NODE_ENV = production
```

4. Save/Apply the variables
5. Railway will automatically redeploy with the new variables

### 5. Get Your Live URL
- In the Railway dashboard, look for "Deployments" or "Overview"
- You'll see a URL like: `https://your-app-xxxx.railway.app`
- This is your production app URL!

### 6. Test Your Deployment

**Test health endpoint:**
```bash
curl https://your-app-xxxx.railway.app/api/health
```

Expected response:
```json
{
  "status": "ok",
  "dbConnected": true,
  "mongooseReadyState": 1,
  "timestamp": "2026-05-25T..."
}
```

**Test registration:**
```bash
curl -X POST https://your-app-xxxx.railway.app/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"railwaytest","password":"test123","email":"test@railway.com"}'
```

Expected response:
```json
{"message":"User registered successfully"}
```

## If It Doesn't Work

### Check Logs
1. In Railway dashboard, click your project
2. Look for "Logs" or "Deployments"
3. Click "View logs" to see what went wrong

### Common Issues

**Issue: Logs show "MONGODB_URI not found"**
- Solution: Make sure you added the environment variables in Railway dashboard
- Variables take effect on next deployment

**Issue: MongoDB timeout errors**
- Solution: MongoDB IP whitelist is already done (0.0.0.0/0 is set)
- May take 1-2 minutes to take effect after Railway redeploys

**Issue: Application crashes on startup**
- Solution: Check the logs for specific errors
- Ensure all 3 environment variables are set

## Features to Test Once Connected

✅ User Registration
✅ User Login
✅ Wallet Creation (Solana keypairs)
✅ Wallet Details Display
✅ Balance Checking (Mainnet/Devnet)
✅ Private Key Viewing (password-protected)
✅ Seed Phrase Viewing (password-protected)
✅ Token Holdings

## Need Help?

- Railway Docs: https://docs.railway.app
- Railway Support: https://railway.app/support
- GitHub Repo: https://github.com/sandeepnaiduruttala-sys/solsonn

---

**NOTE:** The code is already pushed to GitHub and includes:
- ✅ Procfile for Railway
- ✅ Enhanced MongoDB connection with better debugging
- ✅ All endpoints working locally
- ✅ Debug endpoint at `/api/debug` to check env vars

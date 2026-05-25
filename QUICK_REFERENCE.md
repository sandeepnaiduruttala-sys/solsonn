# 🚀 QUICK REFERENCE: VERCEL DEPLOYMENT

## ✅ STATUS: READY TO DEPLOY (0 ERRORS)

---

## 📋 REQUIRED ENVIRONMENT VARIABLES

Add these to Vercel dashboard → Settings → Environment Variables:

```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/solson?retryWrites=true&w=majority
JWT_SECRET=your_long_random_secret_key_min_32_chars
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_NETWORK=devnet
```

---

## 🔧 DEPLOYMENT FILES

| File | Purpose |
|------|---------|
| `api/index.js` | Vercel serverless entry point (DO NOT modify) |
| `vercel.json` | Routing & function configuration |
| `.vercelignore` | Ignore files in deployment |
| `src/index.js` | Express app (dual-mode: local + serverless) |

---

## 🔗 DEPLOYMENT WORKFLOW

```bash
# 1. Commit & push to GitHub
git add .
git commit -m "Vercel deployment"
git push origin main

# 2. In Vercel Dashboard
#    - Import repository
#    - Add environment variables
#    - Deploy!

# 3. Verify deployment
curl https://YOUR_DOMAIN.vercel.app/api/health
```

---

## 🔍 VERIFICATION ENDPOINTS

After deployment, test these:

```bash
# Health check
GET https://YOUR_DOMAIN.vercel.app/api/health

# Homepage
GET https://YOUR_DOMAIN.vercel.app/

# User API
POST https://YOUR_DOMAIN.vercel.app/api/v1/users/register
POST https://YOUR_DOMAIN.vercel.app/api/v1/users/login
```

---

## ⚠️ CRITICAL REQUIREMENTS

Before deploying:

1. **MongoDB Atlas**
   - Add `0.0.0.0/0` to Network Access (allows Vercel IPs)
   - Get connection string from Connect → Node.js

2. **Vercel Environment Variables**
   - MONGODB_URI (required)
   - JWT_SECRET (required)
   - SOLANA_RPC_URL (optional)
   - SOLANA_NETWORK (optional)

3. **GitHub**
   - Repository must be public or Vercel has access
   - .env file must be in .gitignore

---

## 🐛 TROUBLESHOOTING QUICK LINKS

| Problem | Solution |
|---------|----------|
| 502 Error | Check MongoDB connection & IP whitelist |
| 404 on / | Already fixed - uses proper path.join() |
| Module not found | All in package.json - Vercel will install |
| Timeout | Check DB queries or increase maxDuration |

---

## 📊 WHAT'S DEPLOYED

```
Frontend:  public/index.html (HTML/CSS/JS)
Backend:   Express API with 3 route groups
Database:  MongoDB Atlas
Auth:      JWT tokens
Wallet:    Solana wallet management
```

---

## ✨ ARCHITECTURE

```
Vercel CDN
    ↓
api/index.js (Serverless Function)
    ↓
Express App (src/index.js)
    ↓
├── Users API (/api/v1/users)
├── Wallets API (/api/v1/wallets)
├── Balance API (/api/v1/balance)
└── Static Files (public/)
    ↓
MongoDB Atlas
```

---

## 🎯 SUCCESS INDICATORS

✅ Page loads: https://YOUR_DOMAIN.vercel.app/
✅ Health check returns 200: /api/health
✅ API calls work: /api/v1/users/login
✅ No 502/504 errors in logs
✅ MongoDB connects successfully

---

## 📞 HELP RESOURCES

- **Vercel Docs**: https://vercel.com/docs
- **Deployment Logs**: Vercel Dashboard → Deployments → View Build Logs
- **Function Logs**: Vercel Dashboard → Functions
- **VERCEL_DEPLOY_STEPS.md**: Full step-by-step guide

---

**Last verified**: May 25, 2026  
**Status**: ✅ All 16 checks passed - Ready to deploy!

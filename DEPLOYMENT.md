# Vercel Deployment Guide

## ✅ Deployment Structure

Your project is now configured for Vercel serverless deployment with the following structure:

```
/
├── api/
│   └── index.js          # Serverless handler (entry point for Vercel)
├── src/
│   ├── index.js          # Local development entry (works as serverless export too)
│   ├── router.js         # Express routers
│   ├── middleware.js     # Authentication middleware
│   ├── mongoConnection.js # MongoDB connection (with connection pooling)
│   └── ...other backend files
├── public/
│   ├── index.html        # Frontend
│   ├── script.js
│   └── styles.css
├── vercel.json           # Vercel configuration
├── .vercelignore         # Files to ignore in deployment
├── package.json
└── .env                  # Environment variables (NOT committed)
```

## 🚀 Deployment Steps

### 1. Set Environment Variables in Vercel
In your Vercel project settings, add these environment variables:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Your JWT secret key
- `SOLANA_RPC_URL` - Solana RPC endpoint (optional if using default)
- `SOLANA_NETWORK` - Network (devnet, testnet, mainnet-beta)

### 2. Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or deploy from git (recommended)
# Push to GitHub and connect to Vercel dashboard
```

### 3. Important Notes
- **No build command needed** - Express + static files are pre-built
- **Connection pooling enabled** - MongoDB connections are reused in serverless containers
- **Health check available** - `GET /api/health` to verify deployment
- **Static files** - Frontend served from `/public` directory

## 🔧 MongoDB Configuration for Vercel

1. **IP Whitelist**: Add `0.0.0.0/0` in MongoDB Atlas Network Access (or your Vercel IP)
2. **Connection String**: Use `mongodb+srv://` format with appropriate credentials
3. **Connection Pooling**: Set `minPoolSize: 1, maxPoolSize: 5` for serverless

## 📝 File Mapping

| File | Purpose |
|------|---------|
| `api/index.js` | Vercel serverless handler |
| `src/index.js` | Local dev + serverless export |
| `vercel.json` | Routing & build config |
| `.vercelignore` | Deployment optimization |

## 🔍 Testing Deployment

```bash
# Test locally first
npm run dev

# Test API endpoints
curl http://localhost:3000/
curl http://localhost:3000/api/health
curl http://localhost:3000/api/v1/users/login

# Then deploy to Vercel
vercel
```

## ⚠️ Troubleshooting

### Error: "ForbiddenError" when loading HTML
✅ **Fixed** - Now using proper path.join() for static file serving

### MongoDB connection fails
- Check IP whitelist in MongoDB Atlas
- Verify MONGODB_URI environment variable is set
- Check database credentials

### Serverless timeout
- Default: 30 seconds (configurable in vercel.json)
- Increase if needed: `"maxDuration": 60`

## 🎯 Success Indicators

✅ Homepage loads at `https://your-domain.vercel.app/`
✅ Health check responds at `https://your-domain.vercel.app/api/health`
✅ API endpoints accessible at `https://your-domain.vercel.app/api/v1/*`
✅ No "ForbiddenError" or 502 errors

---

**Last Updated**: May 25, 2026

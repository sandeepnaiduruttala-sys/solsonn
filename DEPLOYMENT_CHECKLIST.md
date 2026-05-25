# ✅ Vercel Deployment Checklist

## Pre-Deployment
- [ ] Remove real credentials from `.env.example` (keep only placeholder structure)
- [ ] Ensure `.env` file is in `.gitignore` (not committed to Git)
- [ ] Test locally: `npm run dev` - Should start without errors
- [ ] Test API endpoints locally: `curl http://localhost:3000/api/health`

## Vercel Configuration
- [ ] Connect GitHub repository to Vercel
- [ ] Set MongoDB IP whitelist to `0.0.0.0/0` (or your Vercel IP)
- [ ] Add environment variables in Vercel dashboard:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `SOLANA_RPC_URL`
  - `SOLANA_NETWORK`
  - `PORT` (optional, defaults to 3000)

## Deployment Files
- [ ] `api/index.js` - Serverless handler ✓
- [ ] `src/index.js` - Works as both local dev and serverless ✓
- [ ] `vercel.json` - Routing configuration ✓
- [ ] `.vercelignore` - Ignore unnecessary files ✓
- [ ] `public/` - Frontend static files ✓
- [ ] `package.json` - Dependencies with correct scripts ✓

## Post-Deployment
- [ ] Access homepage: `https://your-domain.vercel.app/`
- [ ] Check health: `https://your-domain.vercel.app/api/health`
- [ ] Test register: `POST https://your-domain.vercel.app/api/v1/users/register`
- [ ] Check Vercel logs for errors
- [ ] Verify MongoDB connections in Atlas logs

## Common Issues & Solutions

### 502 Bad Gateway
- ❌ **Cause**: MongoDB connection failed
- ✅ **Solution**: Check MONGODB_URI, IP whitelist, connection timeout

### Static files not loading (404)
- ❌ **Cause**: Incorrect static path
- ✅ **Solution**: Using proper `path.join()` - Already fixed! ✓

### Function crashes on startup
- ❌ **Cause**: Missing environment variables
- ✅ **Solution**: Add all required env vars in Vercel dashboard

### Timeout errors
- ❌ **Cause**: MongoDB queries taking too long
- ✅ **Solution**: Optimize queries, increase maxDuration in vercel.json

## Deployment Command

```bash
# Option 1: Push to GitHub (recommended)
git push origin main
# (Vercel auto-deploys)

# Option 2: Deploy directly via CLI
npm i -g vercel
vercel
```

---

✨ **Ready for deployment!** All serverless issues have been fixed.

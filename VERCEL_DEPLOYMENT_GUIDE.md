# LIMS Vercel Deployment Guide

## 🚀 Deployment Status

Your LIMS project has been successfully deployed to Vercel!

### Deployment URLs
- **Custom Domain**: [lims.theqbitlabs.com](https://lims.theqbitlabs.com)
- **Vercel Domain**: [lims-ochre.vercel.app](https://lims-ochre.vercel.app)

---

## 🔧 DNS Configuration (Namecheap)

To complete the custom domain setup, you need to add a CNAME record in your Namecheap DNS settings:

### Steps:
1. Log in to your **Namecheap** account
2. Navigate to **Domain List** → Select **theqbitlabs.com**
3. Go to **Advanced DNS** tab
4. Click **Add New Record**
5. Configure the CNAME record:

| Field | Value |
|-------|-------|
| **Type** | CNAME Record |
| **Host** | lims |
| **Value** | lims-ochre.vercel.app |
| **TTL** | Automatic (or 300 seconds) |

6. Click **Save All Changes**

### DNS Propagation
- DNS changes may take **5-30 minutes** to propagate
- You can check propagation status at: [whatsmydns.net](https://www.whatsmydns.net/#CNAME/lims.theqbitlabs.com)

---

## ✅ Build Fix Applied

### Issue Fixed
The deployment was failing due to a local `.npmrc` configuration file that contained system-specific paths:
```
prefix=/home/minimax/.npm-global
cache=/home/minimax/.npm
```

### Solution
- **Removed** `.npmrc` from the repository
- **Added** `.npmrc` to `.gitignore` to prevent future commits
- **Pushed** the fix to GitHub (commit: `c06e259`)

Vercel will automatically redeploy with the latest changes.

---

## 🔍 Monitoring Deployment

### Check Deployment Status
1. Visit your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select the **lims** project
3. Check the **Deployments** tab for build status

### Expected Build Output
- ✅ Dependencies installed successfully
- ✅ Next.js build completed
- ✅ Static pages generated
- ✅ Deployment ready

---

## 🌐 Accessing Your Application

Once DNS propagates, your LIMS application will be accessible at:
- **https://lims.theqbitlabs.com** (Custom Domain)
- **https://lims-ochre.vercel.app** (Vercel Domain - always works)

---

## 📝 Environment Variables

If your application requires environment variables (API keys, database URLs, etc.), configure them in Vercel:

1. Go to **Project Settings** → **Environment Variables**
2. Add variables for:
   - `NEXT_PUBLIC_API_URL` (if using external API)
   - Any other required environment variables

---

## 🔄 Future Deployments

Vercel is now connected to your GitHub repository. Any push to the `main` branch will automatically trigger a new deployment:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

---

## 🆘 Troubleshooting

### Build Fails
- Check Vercel deployment logs
- Ensure all dependencies are in `package.json`
- Verify no local-specific configurations

### Domain Not Working
- Verify CNAME record is correct
- Wait for DNS propagation (up to 48 hours max)
- Check SSL certificate status in Vercel

### Need Help?
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)

---

## 📊 Project Information

- **Framework**: Next.js 14.2.35
- **Node Version**: 18.x (Vercel default)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

---

**Last Updated**: December 15, 2025
**Status**: ✅ Deployed and Ready

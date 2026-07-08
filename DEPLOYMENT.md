# Deployment Guide - Hostinger Node.js Hosting

## 🚀 Automated CI/CD Pipeline

This project uses GitHub Actions for automatic deployment to Hostinger Node.js hosting.

## 📋 Prerequisites

Before deploying, you need to configure GitHub Secrets:

### Required GitHub Secrets

Go to your repository → Settings → Secrets and variables → Actions → New repository secret

Add the following secrets:

1. **SSH_HOST**: Your Hostinger server hostname (e.g., `your-site.com` or IP address)
2. **SSH_USERNAME**: Your SSH username (usually your Hostinger account username)
3. **SSH_PASSWORD**: Your SSH password
4. **SSH_PORT**: SSH port (default: 22, but check Hostinger panel)
5. **DEPLOY_PATH**: Deployment path on server (e.g., `/home/username/public_html` or `~/domains/your-site.com/public_html`)

### How to Get Hostinger SSH Credentials

1. Log in to Hostinger **hPanel**
2. Go to **Advanced** → **SSH Access**
3. Enable SSH if not already enabled
4. Note down:
   - Hostname/Server IP
   - SSH Username
   - Port (usually 65002 for Hostinger)
5. Use your hosting account password for SSH_PASSWORD

## 🔄 Deployment Workflow

### Automatic Deployment

Every push to the `main` branch triggers automatic deployment:

```bash
git add .
git commit -m "Your update message"
git push origin main
```

GitHub Actions will automatically:
1. ✅ Checkout code
2. ✅ Install dependencies
3. ✅ Build production bundle
4. ✅ Deploy to Hostinger via SSH
5. ✅ Install production dependencies on server
6. ✅ Restart Node.js application
7. ✅ Perform health check

### Manual Deployment

You can also trigger deployment manually:
1. Go to your GitHub repository
2. Click **Actions** tab
3. Select **Deploy to Hostinger** workflow
4. Click **Run workflow**

## 📁 Files Deployed

The deployment includes:
- `/dist` - Built frontend and backend
- `/server` - Database and server files
- `package.json` - Dependencies list
- `package-lock.json` - Locked dependencies

**Files NOT deployed** (automatically excluded):
- `node_modules/`
- `.env` files
- `.git/` directory
- Development files
- Build artifacts
- Temporary files

## 🔧 Server Configuration

### Port Configuration

The application runs on **port 3000** by default. Hostinger may require specific port configuration:

1. Check your Hostinger Node.js application settings
2. Ensure the port matches your app configuration
3. Update `PORT` in server.ts if needed

### Environment Variables on Server

After first deployment, you may need to configure environment variables on Hostinger:

1. Log in to Hostinger hPanel
2. Go to your Node.js application
3. Add environment variables:
   - `NODE_ENV=production`
   - `PORT=3000` (or as required)

### Process Management

The workflow attempts to use **PM2** if available on your server. If not, it falls back to `nohup`.

**Recommended**: Install PM2 on your Hostinger server:

```bash
npm install -g pm2
```

PM2 provides:
- Auto-restart on crashes
- Log management
- Process monitoring
- Zero-downtime restarts

## 🐛 Troubleshooting

### Deployment Fails

1. **Check GitHub Actions logs**:
   - Go to Actions tab
   - Click on failed workflow
   - Review each step's output

2. **Verify SSH credentials**:
   - Test SSH connection manually:
     ```bash
     ssh -p PORT USERNAME@HOST
     ```

3. **Check Hostinger Node.js support**:
   - Ensure Node.js hosting is enabled
   - Verify Node.js version compatibility

### Application Not Starting

1. **SSH into your server**:
   ```bash
   ssh -p PORT USERNAME@HOST
   ```

2. **Check logs**:
   ```bash
   cd ~/public_html/current
   pm2 logs lifevision-healthcare
   # or
   cat logs/app.log
   ```

3. **Check Node.js process**:
   ```bash
   pm2 list
   # or
   ps aux | grep node
   ```

4. **Manual restart**:
   ```bash
   pm2 restart lifevision-healthcare
   # or
   pkill -f "node.*server.cjs"
   node dist/server.cjs
   ```

### Database Issues

The application uses a JSON file database (`server/db.json`). Ensure:
- The `server` directory exists on the server
- Write permissions are set correctly:
  ```bash
  chmod -R 755 ~/public_html/current/server
  ```

## 🔐 Security Best Practices

1. **Never commit `.env` files**
2. **Use strong SSH passwords**
3. **Keep dependencies updated**
4. **Use PM2 or similar for process management**
5. **Enable HTTPS on your domain**
6. **Regular backups of `server/db.json`**

## 📊 Monitoring

### Check Application Status

```bash
# Via PM2
pm2 status
pm2 monit

# Check if app is running
curl http://localhost:3000/api/settings
```

### View Logs

```bash
# PM2 logs
pm2 logs lifevision-healthcare --lines 100

# Application logs
tail -f ~/public_html/current/logs/app.log
```

## 🔄 Rollback

If deployment causes issues, previous versions are backed up:

```bash
cd ~/public_html
ls -la backup_*

# Restore previous version
rm -rf current
mv backup_TIMESTAMP current
pm2 restart lifevision-healthcare
```

## 📞 Support

For Hostinger-specific issues:
- **Hostinger Support**: https://www.hostinger.com/contact
- **Hostinger Tutorials**: https://www.hostinger.com/tutorials/

For application issues:
- Check GitHub repository issues
- Review application logs

## ✅ Deployment Checklist

Before first deployment:
- [ ] GitHub Secrets configured
- [ ] SSH access tested
- [ ] Node.js hosting enabled on Hostinger
- [ ] Deployment path verified
- [ ] Domain/subdomain configured (if applicable)

After first deployment:
- [ ] Application accessible via domain
- [ ] Database initialized (check `/api/settings`)
- [ ] Admin panel accessible (`/admin`)
- [ ] PM2 process running (if available)
- [ ] Logs being generated

## 🎯 Quick Commands Reference

```bash
# Local Development
npm install          # Install dependencies
npm run dev         # Start development server
npm run build       # Build for production
npm run start       # Run production build locally

# Git Operations
git add .
git commit -m "message"
git push origin main  # Triggers auto-deployment

# Server Operations (via SSH)
pm2 list               # List all processes
pm2 restart app-name   # Restart application
pm2 logs app-name      # View logs
pm2 stop app-name      # Stop application
pm2 delete app-name    # Remove from PM2
```

---

**Deployment Status**: Check GitHub Actions tab for latest deployment status
**Live URL**: Configure your Hostinger domain to point to the application

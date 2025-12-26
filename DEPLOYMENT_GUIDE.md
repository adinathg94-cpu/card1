# Deployment Guide - No Source Code Required

This guide explains how to deploy your Next.js application to the client's production server **without providing source code**. The application is built using Next.js standalone mode with obfuscated code.

## Overview

Your Next.js application is configured with:
- ✅ Standalone output mode (self-contained server)
- ✅ Code obfuscation (protects intellectual property)
- ✅ Production-ready build
- ✅ No source code required for deployment

## Solution: Standalone Deployment Package

The deployment package contains:
- Compiled, obfuscated JavaScript (no source code)
- Built-in Node.js server
- Static assets and public files
- Production dependencies only
- Environment configuration template

## Step 1: Build the Deployment Package

### Manual Method

1. **Build the production bundle**:
   ```bash
   npm run build
   ```

2. **Create deployment directory**:
   ```bash
   mkdir deployment-package
   ```

3. **Copy standalone server**:
   ```bash
   # Copy the standalone server files
   cp -r .next/standalone/* deployment-package/
   ```

4. **Copy static assets**:
   ```bash
   # Copy client-side JavaScript and CSS
   cp -r .next/static deployment-package/.next/static
   
   # Copy public assets
   cp -r public deployment-package/public
   ```

5. **Copy production dependencies**:
   ```bash
   # Copy package.json (production dependencies only)
   cp package.json deployment-package/
   ```

6. **Create environment template**:
   ```bash
   # Copy .env.example if it exists, or create one
   cp .env.example deployment-package/.env.production.example
   ```

7. **Create ZIP archive**:
   ```bash
   # Windows PowerShell
   Compress-Archive -Path deployment-package\* -DestinationPath deployment-package.zip
   
   # Linux/Mac
   cd deployment-package && zip -r ../deployment-package.zip . && cd ..
   ```

### Automated Method (Recommended)

Run the deployment script (to be created):
```bash
npm run build:deploy
```

This automatically creates `deployment-package.zip` with everything needed.

## Step 2: Package Contents

The deployment package will contain:

```
deployment-package/
├── server.js                 # Standalone Node.js server
├── .next/
│   ├── static/              # Obfuscated client JavaScript & CSS
│   ├── server/              # Server-side compiled code
│   └── [other compiled]     # Prerendered pages, etc.
├── public/                  # Images, fonts, favicon, etc.
├── package.json             # Production dependencies
├── ecosystem.config.js      # PM2 configuration
├── .env.production.example  # Environment variables template
└── DEPLOYMENT_INSTRUCTIONS.md
```

**What's NOT included:**
- ❌ Source code (`src/` directory)
- ❌ TypeScript files
- ❌ Configuration files (next.config.js, tailwind.config.ts)
- ❌ Development dependencies
- ❌ Git history

## Step 3: Client Server Requirements

The client's server needs:

- **Node.js**: v18.17 or higher
- **RAM**: 1 GB minimum, 2 GB recommended
- **Storage**: ~500 MB for application + dependencies
- **OS**: Linux (Ubuntu 20.04+), Windows Server, or macOS
- **Port**: 3000 (configurable)

## Step 4: Client Deployment Steps

Provide these instructions to your client:

### 1. Extract the Package

```bash
# Extract ZIP file
unzip deployment-package.zip -d /var/www/kindora-app
cd /var/www/kindora-app
```

### 2. Configure Environment Variables

```bash
# Copy and edit environment file
cp .env.production.example .env.production
nano .env.production
```

Required environment variables:
```env
# Database (if using)
DATABASE_URL=your_database_connection_string

# PayPal Configuration
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_secret

# Mailgun Configuration
MAILGUN_API_KEY=your_api_key
MAILGUN_DOMAIN=your_domain

# Application URL
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### 3. Install Dependencies

```bash
# Install production dependencies only
npm install --production
```

### 4. Start the Server

**Option A: Direct (for testing)**
```bash
NODE_ENV=production node server.js
```
The app will run on `http://localhost:3000`

**Option B: PM2 (recommended for production)**

Install PM2:
```bash
npm install -g pm2
```

Start the application:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

Check status:
```bash
pm2 status
pm2 logs kindora-app
```

### 5. Configure Reverse Proxy (nginx)

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 6. SSL Configuration (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal is configured automatically
```

## Step 5: Updating the Application

When you provide updates:

1. **Stop the server**:
   ```bash
   pm2 stop kindora-app
   ```

2. **Backup environment**:
   ```bash
   cp .env.production .env.production.backup
   ```

3. **Extract new package**:
   ```bash
   # Remove old files (keep .env.production)
   rm -rf .next public server.js package.json
   
   # Extract new version
   unzip deployment-package-v2.zip
   ```

4. **Restore environment**:
   ```bash
   cp .env.production.backup .env.production
   ```

5. **Update dependencies**:
   ```bash
   npm install --production
   ```

6. **Restart**:
   ```bash
   pm2 restart kindora-app
   ```

## Security Notes

1. **Environment Variables**: Never commit `.env.production` to version control
2. **Firewall**: Only expose port 80/443 (not 3000 directly)
3. **Updates**: Regularly update Node.js and npm packages
4. **Logs**: Monitor PM2 logs for errors
5. **Backups**: Regular database and asset backups

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000
# Or on Windows
netstat -ano | findstr :3000

# Kill the process or change PORT in .env.production
PORT=3001 node server.js
```

### Permission Denied
```bash
# Give proper permissions
sudo chown -R $USER:$USER /var/www/kindora-app
```

### Memory Issues
```bash
# Increase Node.js memory limit in ecosystem.config.js
node_args: '--max-old-space-size=2048'
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install --production
```

## Benefits of This Approach

✅ **No Source Code Exposed**: Client gets compiled/obfuscated code only
✅ **Self-Contained**: Everything needed to run is included
✅ **Easy Updates**: Simple package replacement process
✅ **Production Ready**: Optimized build with PM2 process management
✅ **Maintainable**: You control the source, provide updates as packages
✅ **Secure**: Environment-based configuration, obfuscated code

## Support

For deployment support or issues:
1. Check PM2 logs: `pm2 logs kindora-app`
2. Verify environment variables in `.env.production`
3. Ensure Node.js version is correct: `node --version`
4. Check disk space: `df -h`

---

**Note**: This deployment method allows you to maintain full control of your source code while providing the client with a fully functional, production-ready application.

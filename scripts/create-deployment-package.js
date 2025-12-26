import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Creating Deployment Package...\n');

const ROOT_DIR = path.join(__dirname, '..');
const DEPLOY_DIR = path.join(ROOT_DIR, 'deployment-package');
const STANDALONE_DIR = path.join(ROOT_DIR, '.next', 'standalone');
const STATIC_DIR = path.join(ROOT_DIR, '.next', 'static');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

// Clean up old deployment directory
if (fs.existsSync(DEPLOY_DIR)) {
    console.log('📁 Cleaning old deployment directory...');
    fs.rmSync(DEPLOY_DIR, { recursive: true, force: true });
}

// Create new deployment directory
fs.mkdirSync(DEPLOY_DIR, { recursive: true });

// Step 1: Copy standalone server
console.log('📦 Copying standalone server files...');
if (!fs.existsSync(STANDALONE_DIR)) {
    console.error('❌ Error: Standalone build not found. Run "npm run build" first.');
    process.exit(1);
}

copyRecursiveSync(STANDALONE_DIR, DEPLOY_DIR);

// Step 2: Copy static assets
console.log('📦 Copying static assets (.next/static)...');
const targetStaticDir = path.join(DEPLOY_DIR, '.next', 'static');
fs.mkdirSync(path.dirname(targetStaticDir), { recursive: true });
copyRecursiveSync(STATIC_DIR, targetStaticDir);

// Step 3: Copy public directory
console.log('📦 Copying public assets...');
const targetPublicDir = path.join(DEPLOY_DIR, 'public');
copyRecursiveSync(PUBLIC_DIR, targetPublicDir);

// Step 4: Create production package.json (dependencies only)
console.log('📝 Creating production package.json...');
const packageJsonPath = path.join(ROOT_DIR, 'package.json');
const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
const originalPackageJson = JSON.parse(packageJsonContent);

const productionPackageJson = {
    name: originalPackageJson.name,
    version: originalPackageJson.version,
    description: originalPackageJson.description,
    scripts: {
        start: 'NODE_ENV=production node server.js'
    },
    dependencies: originalPackageJson.dependencies || {},
    engines: {
        node: '>=18.17.0'
    }
};
fs.writeFileSync(
    path.join(DEPLOY_DIR, 'package.json'),
    JSON.stringify(productionPackageJson, null, 2)
);

// Step 5: Create .env.production.example
console.log('📝 Creating environment template...');
const envExample = `# Production Environment Variables
# Copy this file to .env.production and fill in your actual values

# Application
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_BASE_URL=https://yourdomain.com

# Database (if applicable)
# DATABASE_URL=your_database_connection_string

# PayPal Configuration
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret

# Mailgun Configuration
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your_mailgun_domain

# Admin Configuration
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=your_bcrypt_password_hash

# Other configurations as needed
`;
fs.writeFileSync(path.join(DEPLOY_DIR, '.env.production.example'), envExample);

// Step 6: Create PM2 ecosystem file
console.log('📝 Creating PM2 ecosystem configuration...');
const ecosystemConfig = `module.exports = {
  apps: [{
    name: 'kindora-app',
    script: './server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/error.log',
    out_file: './logs/access.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '1G',
    watch: false
  }]
};
`;
fs.writeFileSync(path.join(DEPLOY_DIR, 'ecosystem.config.js'), ecosystemConfig);

// Step 7: Create deployment instructions for client
console.log('📝 Creating client deployment instructions...');
const clientInstructions = `# Deployment Instructions

## Quick Start

1. Extract this package to your server
2. Configure environment variables:
   \`\`\`bash
   cp .env.production.example .env.production
   nano .env.production
   \`\`\`

3. Install dependencies:
   \`\`\`bash
   npm install --production
   \`\`\`

4. Start the application:
   \`\`\`bash
   # Option A: Direct start (for testing)
   npm start

   # Option B: With PM2 (recommended for production)
   npm install -g pm2
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   \`\`\`

5. Configure reverse proxy (nginx) for port 80/443

## Server Requirements

- Node.js v18.17 or higher
- 1 GB RAM minimum (2 GB recommended)
- 500 MB disk space

## Support

The application runs on port 3000 by default.
Access it at http://localhost:3000 or configure nginx to proxy requests.

For detailed instructions, see DEPLOYMENT_GUIDE.md
`;
fs.writeFileSync(path.join(DEPLOY_DIR, 'README.md'), clientInstructions);

// Step 8: Create logs directory
fs.mkdirSync(path.join(DEPLOY_DIR, 'logs'), { recursive: true });
fs.writeFileSync(path.join(DEPLOY_DIR, 'logs', '.gitkeep'), '');

// Step 9: Create ZIP archive
console.log('\n📦 Creating ZIP archive...');
try {
    const zipName = 'deployment-package.zip';
    const zipPath = path.join(ROOT_DIR, zipName);

    // Remove old zip if exists
    if (fs.existsSync(zipPath)) {
        fs.unlinkSync(zipPath);
    }

    // Create zip based on OS
    if (process.platform === 'win32') {
        // Windows PowerShell
        execSync(
            `powershell Compress-Archive -Path "${DEPLOY_DIR}\\*" -DestinationPath "${zipPath}" -Force`,
            { stdio: 'inherit' }
        );
    } else {
        // Linux/Mac
        execSync(
            `cd "${DEPLOY_DIR}" && zip -r "${zipPath}" . && cd "${ROOT_DIR}"`,
            { stdio: 'inherit', shell: '/bin/bash' }
        );
    }

    const stats = fs.statSync(zipPath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

    console.log(`\n✅ Deployment package created successfully!`);
    console.log(`📦 File: ${zipName}`);
    console.log(`📊 Size: ${sizeMB} MB`);
    console.log(`📍 Location: ${zipPath}`);
} catch (error) {
    console.error('❌ Error creating ZIP archive:', error.message);
    console.log('\n📁 Uncompressed package available at:', DEPLOY_DIR);
    console.log('💡 You can manually compress this folder.');
}

console.log('\n✨ Done! You can now transfer the deployment package to the client.');
console.log('📖 See DEPLOYMENT_GUIDE.md for detailed deployment instructions.\n');

// Helper function to copy directory recursively
function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();

    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        fs.readdirSync(src).forEach(function (childItemName) {
            copyRecursiveSync(
                path.join(src, childItemName),
                path.join(dest, childItemName)
            );
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

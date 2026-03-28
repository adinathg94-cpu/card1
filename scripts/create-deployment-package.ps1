# ============================================================
# Kindora – Deployment Package Creator
# ============================================================

$Root          = "c:\wamp64\www\ngo-card\kindora-nextjs\themes\kindora-nextjs"
$StandaloneSrc = Join-Path $Root ".next\standalone"
$StaticSrc     = Join-Path $Root ".next\static"
$PublicSrc     = Join-Path $Root "public"
$DataSrc       = Join-Path $Root "data"
$StagingDir    = Join-Path $Root "_deploy_staging"
$ZipOut        = Join-Path $Root "kindora-deployment.zip"

# Sanity check
if (-not (Test-Path $StandaloneSrc)) {
    Write-Error "Standalone build not found. Run 'npm run build' first."
    exit 1
}

# Clean previous staging / zip
if (Test-Path $StagingDir) { Remove-Item $StagingDir -Recurse -Force }
if (Test-Path $ZipOut)     { Remove-Item $ZipOut -Force }

New-Item -ItemType Directory -Path $StagingDir | Out-Null
Write-Host "Staging directory created." -ForegroundColor Yellow

# 1. Copy .next/standalone to staging root
Write-Host "Copying standalone app..." -ForegroundColor Yellow
Copy-Item -Path "$StandaloneSrc\*" -Destination $StagingDir -Recurse -Force

# 2. Copy .next/static into staging/.next/static
Write-Host "Copying static assets..." -ForegroundColor Yellow
$StaticDst = Join-Path $StagingDir ".next\static"
New-Item -ItemType Directory -Path $StaticDst -Force | Out-Null
Copy-Item -Path "$StaticSrc\*" -Destination $StaticDst -Recurse -Force

# 3. Copy public folder
Write-Host "Copying public folder..." -ForegroundColor Yellow
$PublicDst = Join-Path $StagingDir "public"
if (Test-Path $PublicSrc) {
    New-Item -ItemType Directory -Path $PublicDst -Force | Out-Null
    Copy-Item -Path "$PublicSrc\*" -Destination $PublicDst -Recurse -Force
}

# 4. Copy data (SQLite DB)
Write-Host "Copying data folder..." -ForegroundColor Yellow
$DataDst = Join-Path $StagingDir "data"
if (Test-Path $DataSrc) {
    New-Item -ItemType Directory -Path $DataDst -Force | Out-Null
    Copy-Item -Path "$DataSrc\*" -Destination $DataDst -Recurse -Force
}

# 5. Write README
Write-Host "Writing README..." -ForegroundColor Yellow
$ReadmePath = Join-Path $StagingDir "README.txt"
$lines = @(
    "# Kindora Deployment Package",
    "Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')",
    "",
    "## Requirements",
    "Node.js 18+ (https://nodejs.org)",
    "PM2 (optional): npm install -g pm2",
    "",
    "## Quick Start",
    "1. Extract this zip to your server (e.g. /var/www/kindora)",
    "2. Create a .env.local file with your secrets:",
    "     NEXT_PUBLIC_SITE_URL=https://yourdomain.com",
    "     MAILGUN_API_KEY=your_key",
    "     STRIPE_SECRET_KEY=your_key",
    "     PAYPAL_CLIENT_ID=your_id",
    "     PAYPAL_CLIENT_SECRET=your_secret",
    "     JWT_SECRET=your_secret",
    "3. Start the server:",
    "     node server.js",
    "   Or with PM2:",
    "     pm2 start server.js --name kindora",
    "",
    "## Default Port: 3000",
    "Use Nginx or Apache as a reverse proxy for port 80/443.",
    "",
    "## Nginx Example Config",
    "   location / {",
    "       proxy_pass http://localhost:3000;",
    "       proxy_http_version 1.1;",
    "       proxy_set_header Upgrade `$http_upgrade;",
    "       proxy_set_header Connection 'upgrade';",
    "       proxy_set_header Host `$host;",
    "       proxy_cache_bypass `$http_upgrade;",
    "   }"
)
$lines | Set-Content -Path $ReadmePath -Encoding UTF8
Write-Host "README.txt created." -ForegroundColor Yellow

# 6. Compress to zip
Write-Host "Creating zip archive..." -ForegroundColor Yellow
Compress-Archive -Path "$StagingDir\*" -DestinationPath $ZipOut -Force

# 7. Clean staging
Remove-Item $StagingDir -Recurse -Force

$ZipSize = [math]::Round((Get-Item $ZipOut).Length / 1MB, 1)
Write-Host ""
Write-Host "Done! Deployment package ready:" -ForegroundColor Green
Write-Host "  $ZipOut" -ForegroundColor Cyan
Write-Host "  Size: $ZipSize MB" -ForegroundColor Cyan

# Hostinger Deployment Package Creator
# Creates a source-code zip for Hostinger managed Node.js hosting.
# Hostinger will run npm install + npm run build on their Linux servers,
# which ensures native modules (like better-sqlite3) compile correctly for Linux.

$ErrorActionPreference = "Stop"
$ROOT = Split-Path -Parent $PSScriptRoot
$ZIP_NAME = "hostinger-deploy.zip"
$ZIP_PATH = Join-Path $ROOT $ZIP_NAME
$TEMP_DIR = Join-Path $ROOT "hostinger-temp"

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  Hostinger Deployment Package Creator" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Clean up old files
if (Test-Path $ZIP_PATH) {
    Write-Host "Removing old zip..." -ForegroundColor Yellow
    Remove-Item $ZIP_PATH -Force
}
if (Test-Path $TEMP_DIR) {
    Write-Host "Cleaning temp directory..." -ForegroundColor Yellow
    Remove-Item $TEMP_DIR -Recurse -Force
}

# Directories to EXCLUDE
$EXCLUDE_DIRS = @(
    "node_modules",
    ".next",
    ".git",
    "deployment-package",
    "hostinger-temp",
    ".cursor",
    ".sitepins",
    ".vscode"
)

# Files to EXCLUDE
$EXCLUDE_FILES = @(
    "deployment-package.zip",
    "hostinger-deploy.zip",
    "tsconfig.tsbuildinfo",
    ".env.local",
    ".env",
    "Home Page.pdf",

    "process_remaining.js",
    "package-lock.json"
)

Write-Host "Collecting files..." -ForegroundColor Cyan

# Get all items, filtering excluded
$allItems = Get-ChildItem -Path $ROOT -Recurse | Where-Object {
    $itemPath = $_.FullName
    $relativePath = $itemPath.Substring($ROOT.Length + 1)

    $inExcludedDir = $false
    foreach ($dir in $EXCLUDE_DIRS) {
        if ($relativePath -like "$dir\*" -or $relativePath -eq $dir) {
            $inExcludedDir = $true
            break
        }
    }

    $isExcludedFile = $false
    if (-not $_.PSIsContainer) {
        $fileName = $_.Name
        if ($EXCLUDE_FILES -contains $fileName) { $isExcludedFile = $true }
        if ($fileName -match "\.env\..*\.local" -or $fileName -eq ".env.local") { $isExcludedFile = $true }
    }

    return (-not $inExcludedDir -and -not $isExcludedFile)
}

Write-Host "Found $($allItems.Count) items to package." -ForegroundColor Green

# Create temp dir and copy files
New-Item -ItemType Directory -Path $TEMP_DIR -Force | Out-Null

foreach ($item in $allItems) {
    $relativePath = $item.FullName.Substring($ROOT.Length + 1)
    $destPath = Join-Path $TEMP_DIR $relativePath

    if ($item.PSIsContainer) {
        New-Item -ItemType Directory -Path $destPath -Force | Out-Null
    } else {
        $destDir = Split-Path $destPath -Parent
        if (-not (Test-Path $destDir)) {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
        }
        Copy-Item -Path $item.FullName -Destination $destPath -Force
    }
}

# Create .env.production.example
$envContent = "# ============================================`n# HOSTINGER PRODUCTION ENVIRONMENT VARIABLES`n# ============================================`n# Add these in Hostinger hPanel > Node.js > Environment Variables`n`nNODE_ENV=production`nPORT=3000`nNEXT_PUBLIC_BASE_URL=https://yourdomain.com`n`n# PayPal`nNEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id`nPAYPAL_CLIENT_SECRET=your_paypal_client_secret`n`n# Stripe`nNEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key`nSTRIPE_SECRET_KEY=your_stripe_secret_key`nSTRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret`n`n# Mailgun`nMAILGUN_API_KEY=your_mailgun_api_key`nMAILGUN_DOMAIN=your_mailgun_domain`n`n# Admin`nADMIN_USERNAME=admin`nADMIN_PASSWORD_HASH=your_bcrypt_hash`n`n# JWT`nJWT_SECRET=your_very_long_random_secret_key`n"
Set-Content -Path (Join-Path $TEMP_DIR ".env.production.example") -Value $envContent -Encoding UTF8

# Create HOSTINGER_README.md
$readmeContent = "# Hostinger Deployment Guide`n`n## Steps in Hostinger hPanel`n`n### 1. Upload & Extract`n- Upload hostinger-deploy.zip via File Manager`n- Extract it into your app folder (e.g. /home/user/domains/yourdomain.com/public_html)`n`n### 2. Node.js App Settings`n- Go to hPanel > Websites > Manage > Node.js`n- Node.js version: 20.x (recommended)`n- Application startup file: server.js (This fixes the 'EEXIST process.getStdin' error)`n- Build command: npm install --legacy-peer-deps && npm run build`n`n### 3. Startup Command`n  node server.js`n`n### 4. Environment Variables`n- Add all variables from .env.production.example in hPanel Node.js settings`n- Fill in your actual API keys`n`n### 5. After First Deploy`n- The app runs on the port Hostinger assigns`n- Hostinger proxies it to your domain automatically`n"
Set-Content -Path (Join-Path $TEMP_DIR "HOSTINGER_README.md") -Value $readmeContent -Encoding UTF8

# Create the ZIP
Write-Host ""
Write-Host "Creating zip archive..." -ForegroundColor Cyan
Compress-Archive -Path "$TEMP_DIR\*" -DestinationPath $ZIP_PATH -Force

# Cleanup
Remove-Item $TEMP_DIR -Recurse -Force

# Results
$zipSize = [math]::Round((Get-Item $ZIP_PATH).Length / 1MB, 2)
Write-Host ""
Write-Host "======================================" -ForegroundColor Green
Write-Host "  Package Created Successfully!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host "  File : $ZIP_NAME" -ForegroundColor White
Write-Host "  Size : $zipSize MB" -ForegroundColor White
Write-Host "  Path : $ZIP_PATH" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Upload 'hostinger-deploy.zip' to Hostinger File Manager" -ForegroundColor White
Write-Host "  2. Extract into your app root folder" -ForegroundColor White
Write-Host "  3. In hPanel Node.js: set build cmd = npm install --legacy-peer-deps && npm run build" -ForegroundColor White
Write-Host "  4. Set startup = node server.js" -ForegroundColor White
Write-Host "  5. Add environment variables from .env.production.example" -ForegroundColor White
Write-Host ""

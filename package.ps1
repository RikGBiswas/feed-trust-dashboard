# ──────────────────────────────────────────────────────────
# package.ps1 — Build & package deployment zip
# Run this on your dev machine before copying to the server
# ──────────────────────────────────────────────────────────

param(
  [string]$OutDir = ".\deploy"
)

$ErrorActionPreference = "Stop"
Write-Host "`n=== Feed Inventory — Build & Package ===" -ForegroundColor Cyan

# 1. Install frontend deps & build SPA
Write-Host "`n[1/5] Installing frontend dependencies..." -ForegroundColor Yellow
npm install --production=false
if ($LASTEXITCODE -ne 0) { throw "npm install failed" }

Write-Host "`n[2/5] Building frontend (SPA)..." -ForegroundColor Yellow
npm run build:prod
if ($LASTEXITCODE -ne 0) { throw "build failed" }

# 3. Install backend production deps
Write-Host "`n[3/5] Installing backend dependencies..." -ForegroundColor Yellow
Push-Location backend
npm install --production
if ($LASTEXITCODE -ne 0) { Pop-Location; throw "backend npm install failed" }
Pop-Location

# 4. Assemble staging folder
Write-Host "`n[4/5] Assembling deployment package..." -ForegroundColor Yellow
$staging = Join-Path $OutDir "feed-inventory"
if (Test-Path $staging) { Remove-Item $staging -Recurse -Force }
New-Item -ItemType Directory -Path $staging | Out-Null

# Copy dist (built SPA)
Copy-Item -Path "dist" -Destination $staging -Recurse

# Copy backend (server + deps, no .env)
Copy-Item -Path "backend" -Destination $staging -Recurse
Remove-Item (Join-Path $staging "backend\.env") -ErrorAction SilentlyContinue

# Copy config files
Copy-Item "ecosystem.config.cjs" $staging
Copy-Item "web.config" $staging
Copy-Item "deploy-server.ps1" $staging -ErrorAction SilentlyContinue

# Copy .env template
Copy-Item "backend\.env.example" (Join-Path $staging "backend\.env.example") -ErrorAction SilentlyContinue

# 5. Create zip
Write-Host "`n[5/5] Creating zip..." -ForegroundColor Yellow
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$zipName = "feed-inventory-$timestamp.zip"
$zipPath = Join-Path $OutDir $zipName

if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
Compress-Archive -Path "$staging\*" -DestinationPath $zipPath -Force

# Cleanup staging
Remove-Item $staging -Recurse -Force

$sizeMB = [math]::Round((Get-Item $zipPath).Length / 1MB, 2)
Write-Host "`n=== Package created ===" -ForegroundColor Green
Write-Host "  File: $zipPath" -ForegroundColor Cyan
Write-Host "  Size: ${sizeMB} MB" -ForegroundColor Cyan
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "  1. Copy $zipName to D:\Temp on the server"
Write-Host "  2. RDP into the server and run:"
Write-Host "     powershell -ExecutionPolicy Bypass -File D:\DataFeedInventory\deploy-server.ps1"

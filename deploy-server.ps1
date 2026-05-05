# ──────────────────────────────────────────────────────────
# deploy-server.ps1 — Run this ON the server
# Extracts the deployment zip and starts the app with PM2
# ──────────────────────────────────────────────────────────

param(
  [string]$ZipDir    = "D:\Temp",
  [string]$AppDir    = "D:\DataFeedInventory",
  [string]$ZipName   = ""          # leave empty to auto-detect latest zip
)

$ErrorActionPreference = "Stop"
Write-Host "`n=== Feed Inventory — Server Deploy ===" -ForegroundColor Cyan

# 1. Find the zip
if ($ZipName -eq "") {
  $zip = Get-ChildItem $ZipDir -Filter "feed-inventory-*.zip" |
         Sort-Object LastWriteTime -Descending |
         Select-Object -First 1
  if (-not $zip) { throw "No feed-inventory-*.zip found in $ZipDir" }
  $ZipName = $zip.Name
}
$zipPath = Join-Path $ZipDir $ZipName
if (-not (Test-Path $zipPath)) { throw "Zip not found: $zipPath" }
Write-Host "  Using: $zipPath" -ForegroundColor Gray

# 2. Stop existing PM2 process (if running)
Write-Host "`n[1/5] Stopping existing process..." -ForegroundColor Yellow
pm2 stop feed-inventory 2>$null
pm2 delete feed-inventory 2>$null

# 3. Backup existing app (optional safety)
if (Test-Path $AppDir) {
  $backupName = "DataFeedInventory-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
  $backupPath = Join-Path (Split-Path $AppDir) $backupName
  Write-Host "`n[2/5] Backing up existing app to $backupPath..." -ForegroundColor Yellow
  # Only backup key runtime files, not everything
  if (Test-Path "$AppDir\backend\.env") {
    $savedEnv = Get-Content "$AppDir\backend\.env" -Raw
  }
  Remove-Item $AppDir -Recurse -Force
} else {
  Write-Host "`n[2/5] No existing app to backup — fresh install" -ForegroundColor Yellow
}

# 4. Extract zip
Write-Host "`n[3/5] Extracting to $AppDir..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path $AppDir -Force | Out-Null
Expand-Archive -Path $zipPath -DestinationPath $AppDir -Force

# Create logs directory
New-Item -ItemType Directory -Path "$AppDir\logs" -Force | Out-Null

# 5. Restore or prompt for .env
Write-Host "`n[4/5] Configuring backend .env..." -ForegroundColor Yellow
$envFile = "$AppDir\backend\.env"
if ($savedEnv) {
  Set-Content -Path $envFile -Value $savedEnv
  Write-Host "  Restored previous .env" -ForegroundColor Green
} elseif (-not (Test-Path $envFile)) {
  $envTemplate = @"
# PostgreSQL (Aurora) connection
DB_HOST=aurora-serverless-ods-policy-postgres-cluster-hfx-instance-1.ckhyoqkr8blc.us-east-1.rds.amazonaws.com
DB_PORT=5432
DB_NAME=PolicyODS
DB_USER=cs_esi_shrd_nonprod
DB_PASSWORD=CHANGE_ME
DB_SCHEMA=stage
DB_SSL=true
PORT=5000
"@
  Set-Content -Path $envFile -Value $envTemplate
  Write-Host "  Created template .env — EDIT $envFile with the real password!" -ForegroundColor Red
}

# 6. Start with PM2
Write-Host "`n[5/5] Starting with PM2..." -ForegroundColor Yellow
Push-Location $AppDir
pm2 start ecosystem.config.cjs --env production
pm2 save
Pop-Location

Write-Host "`n=== Deployment complete! ===" -ForegroundColor Green
Write-Host "  App running at http://localhost:5000" -ForegroundColor Cyan
Write-Host "  IIS should reverse-proxy to this port" -ForegroundColor Cyan
Write-Host ""
Write-Host "  pm2 status              — check process" -ForegroundColor Gray
Write-Host "  pm2 logs feed-inventory — view logs" -ForegroundColor Gray
Write-Host "  pm2 restart feed-inventory — restart" -ForegroundColor Gray

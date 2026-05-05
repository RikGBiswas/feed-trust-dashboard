# ──────────────────────────────────────────────────────
# Feed Inventory Dashboard — Deployment Script
# Run this on the target server after cloning / pulling
# ──────────────────────────────────────────────────────

Write-Host "=== Feed Inventory Dashboard — Deploy ===" -ForegroundColor Cyan

# 1. Install frontend dependencies & build
Write-Host "`n[1/4] Installing frontend dependencies..." -ForegroundColor Yellow
npm install --production=false
if ($LASTEXITCODE -ne 0) { Write-Host "FAILED: npm install" -ForegroundColor Red; exit 1 }

Write-Host "`n[2/4] Building frontend (SPA)..." -ForegroundColor Yellow
npm run build:prod
if ($LASTEXITCODE -ne 0) { Write-Host "FAILED: build" -ForegroundColor Red; exit 1 }

# 2. Install backend dependencies
Write-Host "`n[3/4] Installing backend dependencies..." -ForegroundColor Yellow
Push-Location backend
npm install --production
if ($LASTEXITCODE -ne 0) { Write-Host "FAILED: backend npm install" -ForegroundColor Red; Pop-Location; exit 1 }
Pop-Location

# 3. Create logs directory
if (-not (Test-Path "logs")) { New-Item -ItemType Directory -Path "logs" | Out-Null }

# 4. Start / restart with PM2
Write-Host "`n[4/4] Starting with PM2..." -ForegroundColor Yellow
pm2 startOrRestart ecosystem.config.cjs --env production
pm2 save

Write-Host "`n=== Deployment complete! ===" -ForegroundColor Green
Write-Host "App running at http://localhost:5000" -ForegroundColor Cyan
Write-Host "PM2 status: pm2 status" -ForegroundColor Gray
Write-Host "PM2 logs:   pm2 logs feed-inventory" -ForegroundColor Gray

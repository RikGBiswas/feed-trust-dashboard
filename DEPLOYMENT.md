# Feed Inventory Dashboard — Deployment Guide

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Infrastructure](#infrastructure)
- [Prerequisites](#prerequisites)
- [Database Setup](#database-setup)
- [Local Build & Packaging](#local-build--packaging)
- [Server Deployment](#server-deployment)
- [IIS Configuration](#iis-configuration)
- [PM2 Process Management](#pm2-process-management)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)
- [Useful Commands](#useful-commands)

---

## Architecture Overview

```
Browser
  │
  ▼
IIS (port 2468) ──reverse proxy──► Express/Node.js (port 5050) ──► Aurora PostgreSQL
  │                                    │
  │                                    ├── GET/POST/PUT /api/feeds
  │                                    └── Serves static SPA (dist/)
  │
  └── web.config (URL Rewrite rules)
```

- **Frontend**: React 19 SPA built with Vite, using TanStack Router for client-side routing
- **Backend**: Express 4.21 REST API (Node.js)
- **Database**: AWS Aurora PostgreSQL (Serverless), schema `stage`, table `coaction_feed_inventory`
- **Process Manager**: PM2 (fork mode)
- **Reverse Proxy**: IIS with URL Rewrite module

---

## Infrastructure

| Component       | Detail                                                                                              |
|-----------------|-----------------------------------------------------------------------------------------------------|
| Server          | `toolbox-nonprod-app.prosight.net`                                                                  |
| App Directory   | `D:\DataFeedInventory`                                                                              |
| IIS Site Port   | `2468`                                                                                              |
| Express Port    | `5050`                                                                                              |
| Database Host   | `aurora-serverless-ods-policy-postgres-cluster-hfx-instance-1.ckhyoqkr8blc.us-east-1.rds.amazonaws.com` |
| Database Name   | `PolicyODS`                                                                                         |
| Database Schema | `stage`                                                                                             |
| Database Table  | `coaction_feed_inventory`                                                                           |
| GitHub Repo     | `https://github.com/RikGBiswas/feed-trust-dashboard.git`                                           |
| ADO Repo        | `https://dev.azure.com/prosightspecialty/ProSight%20Data/_git/DataFeedInventory`                     |

---

## Prerequisites

### Developer Machine

- Node.js 18+ and npm
- Git
- PowerShell 5.1+

### Server

- Node.js 18+ installed and on PATH
- PM2 installed globally: `npm install -g pm2`
- IIS with URL Rewrite module installed
- Network access to Aurora PostgreSQL on port 5432

---

## Database Setup

The DDL for the feed inventory table is in `backend/sql/create_tables.sql`.

To create the table from scratch:

```sql
-- Connect to PolicyODS database
-- Run the contents of backend/sql/create_tables.sql
```

To add the `environment` column to an existing table:

```sql
ALTER TABLE stage.coaction_feed_inventory ADD COLUMN environment VARCHAR(10) DEFAULT 'DEV';
```

---

## Local Build & Packaging

### Step 1: Install Dependencies & Build

From the project root on your dev machine:

```powershell
cd <project-root>
powershell -ExecutionPolicy Bypass -File package.ps1
```

This script (`package.ps1`) performs the following:

1. Installs frontend dependencies (`npm install`)
2. Builds the SPA (`vite build --config vite.config.prod.ts`) → outputs to `dist/`
3. Installs backend production dependencies (`cd backend && npm install --omit=dev`)
4. Assembles a deployment folder containing:
   - `dist/` (compiled SPA)
   - `backend/` (server code + node_modules, excluding `.env`)
   - `ecosystem.config.cjs` (PM2 config)
   - `web.config` (IIS reverse proxy rules)
   - `deploy-server.ps1` (server-side deployment script)
5. Creates a timestamped zip: `deploy/feed-inventory-YYYYMMDD-HHMMSS.zip`

### Step 2: Copy to Server

Copy the generated zip file to `D:\Temp` on the server via RDP, shared drive, or SCP.

---

## Server Deployment

### Option A: Using the Deploy Script

RDP into the server and run:

```powershell
powershell -ExecutionPolicy Bypass -File D:\DataFeedInventory\deploy-server.ps1
```

The script (`deploy-server.ps1`) will:

1. Auto-detect the latest `feed-inventory-*.zip` in `D:\Temp`
2. Stop and remove the existing PM2 process
3. Preserve the existing `backend/.env` file
4. Extract the zip to `D:\DataFeedInventory`
5. Restore the `.env` file
6. Start the app with PM2

### Option B: Manual Deployment

```powershell
# 1. Stop existing process
pm2 stop feed-inventory
pm2 delete feed-inventory

# 2. Backup .env
Copy-Item D:\DataFeedInventory\backend\.env D:\Temp\.env.bak

# 3. Extract new version
Remove-Item D:\DataFeedInventory -Recurse -Force
Expand-Archive -Path D:\Temp\feed-inventory-YYYYMMDD-HHMMSS.zip -DestinationPath D:\DataFeedInventory -Force

# 4. Restore .env
Copy-Item D:\Temp\.env.bak D:\DataFeedInventory\backend\.env

# 5. Create logs dir
New-Item -ItemType Directory -Path D:\DataFeedInventory\logs -Force

# 6. Start with PM2
cd D:\DataFeedInventory
pm2 start ecosystem.config.cjs
pm2 save

# 7. (If IIS config changed) Reset IIS
iisreset
```

---

## IIS Configuration

### Site Setup

1. Open **IIS Manager** (`inetmgr`)
2. Create a new site (or use existing) pointed at `D:\DataFeedInventory`
3. Set binding: **port 2468**, **hostname blank** (accepts any hostname)
4. Ensure the **URL Rewrite** module is installed

### web.config

The `web.config` at `D:\DataFeedInventory\web.config` configures:

- **Reverse proxy**: All requests rewritten to `http://localhost:5050/{R:1}`
- **Hidden segments**: `node_modules`, `backend`, `src`, `.env` are blocked from direct access
- **Pass-through errors**: Express error responses are returned to the client as-is

```xml
<action type="Rewrite" url="http://localhost:5050/{R:1}" />
```

> **Important**: The port in `web.config` must match the `PORT` in `ecosystem.config.cjs` and `backend/.env`. Currently: **5050**.

---

## PM2 Process Management

### Configuration (ecosystem.config.cjs)

```js
module.exports = {
  apps: [{
    name: "feed-inventory",
    cwd: "./backend",
    script: "server.js",
    exec_mode: "fork",        // MUST be "fork", not "cluster"
    env: {
      NODE_ENV: "production",
      PORT: 5050,              // MUST match web.config proxy target
    },
    instances: 1,
    autorestart: true,
    max_memory_restart: "500M",
    error_file: "./logs/err.log",
    out_file: "./logs/out.log",
  }],
};
```

### Common Commands

| Command                              | Purpose                        |
|--------------------------------------|--------------------------------|
| `pm2 start ecosystem.config.cjs`     | Start the app                  |
| `pm2 restart feed-inventory`         | Restart the app                |
| `pm2 stop feed-inventory`            | Stop the app                   |
| `pm2 delete feed-inventory`          | Remove from PM2 process list   |
| `pm2 list`                           | Show all PM2 processes         |
| `pm2 logs feed-inventory`            | Tail live logs                 |
| `pm2 logs feed-inventory --lines 50` | View last 50 lines             |
| `pm2 flush feed-inventory`           | Clear old log files            |
| `pm2 save`                           | Save process list for auto-restart |

---

## Environment Variables

The backend reads configuration from `D:\DataFeedInventory\backend/.env`:

```env
# PostgreSQL (Aurora) connection
DB_HOST=aurora-serverless-ods-policy-postgres-cluster-hfx-instance-1.ckhyoqkr8blc.us-east-1.rds.amazonaws.com
DB_PORT=5432
DB_NAME=PolicyODS
DB_USER=cs_esi_shrd_nonprod
DB_PASSWORD=<actual password>
DB_SCHEMA=stage
DB_SSL=true
PORT=5050
```

> **Never commit `.env` to source control.** The `.gitignore` excludes it. The deploy script preserves it across deployments.

---

## Troubleshooting

### Error: `bind EACCES null:5000`

Port 5000 is reserved by IIS/System (PID 4) on this server. Ensure all configs use **port 5050**:
- `ecosystem.config.cjs` → `PORT: 5050`
- `backend/.env` → `PORT=5050`
- `web.config` → `http://localhost:5050/{R:1}`

### Error: `Bad Request - Invalid Hostname` (HTTP 400)

IIS site binding has a specific hostname set. Fix:
1. Open IIS Manager → select the feed-inventory site → **Bindings**
2. Edit the port 2468 binding → **clear the Host name field** → OK

### PM2 shows `cluster` mode instead of `fork`

Delete and re-add:
```powershell
pm2 stop feed-inventory
pm2 delete feed-inventory
pm2 start ecosystem.config.cjs
```

### App restarts repeatedly (high restart count ↺)

Check logs: `pm2 logs feed-inventory --lines 50`
Common causes: missing `.env`, wrong port, database unreachable.

### SPA routes return 404

Express serves `index.html` for all non-API routes. If 404s occur:
- Verify `dist/index.html` exists at `D:\DataFeedInventory\dist\`
- Check that `backend/server.js` has the SPA fallback route

### Database connection errors

- Verify the server can reach the Aurora endpoint on port 5432
- Check credentials in `backend/.env`
- Ensure SSL is enabled (`DB_SSL=true`)

---

## Useful Commands

```powershell
# Check what port the app is listening on
netstat -ano | findstr :5050

# Check if IIS is running
Get-Service W3SVC

# Test Express directly (bypass IIS)
Invoke-WebRequest http://localhost:5050/api/feeds

# Test through IIS
Invoke-WebRequest http://localhost:2468/api/feeds

# View PM2 ecosystem config on server
cat D:\DataFeedInventory\ecosystem.config.cjs

# View current .env on server
cat D:\DataFeedInventory\backend\.env
```

---

## Repository Structure

```
feed-trust-dashboard/
├── src/                     # React frontend source
│   ├── api/                 # API client (feedApi.ts)
│   ├── components/          # React components
│   │   └── ui/              # shadcn/ui components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities
│   └── routes/              # TanStack Router file-based routes
├── backend/                 # Express API server
│   ├── controllers/         # Route handlers
│   ├── routes/              # Express route definitions
│   ├── sql/                 # Database DDL scripts
│   ├── db.js                # PostgreSQL connection pool
│   ├── server.js            # Express entry point
│   └── .env.example         # Environment variable template
├── ecosystem.config.cjs     # PM2 process configuration
├── web.config               # IIS reverse proxy configuration
├── vite.config.ts           # Vite dev config
├── vite.config.prod.ts      # Vite SPA production build config
├── package.ps1              # Build & package script (dev machine)
├── deploy-server.ps1        # Deployment script (server)
└── DEPLOYMENT.md            # This document
```

require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");
const feedRoutes = require("./routes/feeds");

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Disable caching for API responses ────────────────────────────────
app.use("/api", (_req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});

// ── API Routes ───────────────────────────────────────────────────────
app.use("/api/feeds", feedRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Serve SPA static files in production ─────────────────────────────
const distPath = path.join(__dirname, "..", "dist");
app.use(express.static(distPath));

// SPA fallback: serve index.html for all non-API routes
app.get("*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ── Start ────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

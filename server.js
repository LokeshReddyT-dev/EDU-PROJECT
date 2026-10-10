// server.js — EduPocket Unified Server (Local & Production Backend)
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Import API handlers
import healthHandler from "./api/health.js";
import authHandler from "./api/auth.js";
import syncHandler from "./api/sync.js";
import curriculumHandler from "./api/curriculum.js";
import questionsHandler from "./api/questions.js";
import teacherHandler from "./api/teacher.js";
import parentHandler from "./api/parent.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Global CORS & Security Headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Student-Id, X-Device-Id");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// Helper to adapt Vercel Serverless Handlers to Express
const adapt = (handler) => async (req, res) => {
  try {
    await handler(req, res);
  } catch (err) {
    console.error(`[API Error] ${req.method} ${req.url}:`, err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error", details: err.message });
    }
  }
};

// API Endpoints
app.all("/api/health", adapt(healthHandler));
app.all("/api/auth", adapt(authHandler));
app.all("/api/sync", adapt(syncHandler));
app.all("/api/curriculum", adapt(curriculumHandler));
app.all("/api/questions", adapt(questionsHandler));
app.all("/api/teacher", adapt(teacherHandler));
app.all("/api/parent", adapt(parentHandler));

// Serve Static Assets
app.use(express.static(__dirname, {
  maxAge: "1h",
  setHeaders: (res, filePath) => {
    if (filePath.endsWith("sw.js")) {
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Service-Worker-Allowed", "/");
    } else if (filePath.endsWith("manifest.json")) {
      res.setHeader("Content-Type", "application/manifest+json");
    }
  }
}));

// Fallback: SPA entry for non-API routes
app.use((req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "API endpoint not found", path: req.path });
  }
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start Server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`====================================================`);
  console.log(`🎒 EduPocket Backend & Frontend Server is Running!`);
  console.log(`🌐 Local URL:   http://localhost:${PORT}`);
  console.log(`📡 API Health:  http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});

export default app;

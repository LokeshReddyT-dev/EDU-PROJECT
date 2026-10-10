// api/health.js — Health check endpoint
// GET /api/health

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  res.status(200).json({
    status: "ok",
    service: "EduPocket Backend API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    region: process.env.VERCEL_REGION || "unknown",
  });
}

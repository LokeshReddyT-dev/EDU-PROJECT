// api/_lib/cors.js
// CORS middleware helper for Vercel serverless functions

const ALLOWED_ORIGINS = [
  "http://localhost:8080",
  "http://localhost:3000",
  "https://edupocket.vercel.app",
  process.env.ALLOWED_ORIGIN,
].filter(Boolean);

export function setCorsHeaders(req, res) {
  const origin = req.headers.origin;

  if (ALLOWED_ORIGINS.includes(origin) || process.env.NODE_ENV === "development") {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*"); // Open for hackathon demo
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Student-Id, X-Device-Id");
  res.setHeader("Access-Control-Max-Age", "86400");
}

export function handleCors(req, res) {
  setCorsHeaders(req, res);
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return true; // Caller should return early
  }
  return false;
}

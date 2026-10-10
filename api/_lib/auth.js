// api/_lib/auth.js
// Simple token-based auth for teacher/parent protected routes
// Uses a signed token stored in Vercel KV

import { getKV } from "./kv.js";

const TEACHER_PIN = process.env.TEACHER_PIN || "teacher123";
const PARENT_PIN = process.env.PARENT_PIN || "parent456";
const TOKEN_TTL = 60 * 60 * 8; // 8 hours in seconds

function generateToken() {
  return (
    Math.random().toString(36).slice(2) +
    Date.now().toString(36) +
    Math.random().toString(36).slice(2)
  );
}

export async function createSession(role, pin) {
  if (role === "teacher" && pin !== TEACHER_PIN) return null;
  if (role === "parent" && pin !== PARENT_PIN) return null;

  const token = generateToken();
  const kv = await getKV();
  await kv.set(`session:${token}`, JSON.stringify({ role, createdAt: Date.now() }));
  // Set TTL if supported (Vercel KV supports it)
  try {
    await kv.expire(`session:${token}`, TOKEN_TTL);
  } catch (_) {}

  return token;
}

export async function verifySession(req) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) return null;

  const kv = await getKV();
  const raw = await kv.get(`session:${token}`);
  if (!raw) return null;

  try {
    return typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return null;
  }
}

export async function requireRole(req, res, allowedRoles) {
  const session = await verifySession(req);
  if (!session || !allowedRoles.includes(session.role)) {
    res.status(401).json({ error: "Unauthorized. Please log in." });
    return null;
  }
  return session;
}

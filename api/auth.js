// api/auth.js — Login endpoint for Teacher and Parent roles
// POST /api/auth  { role: "teacher"|"parent", pin: "..." }
// Returns: { token, role, expiresIn }

import { handleCors } from "./_lib/cors.js";
import { createSession } from "./_lib/auth.js";

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const { role, pin } = req.body || {};

  if (!role || !pin) {
    return res.status(400).json({ error: "Both 'role' and 'pin' fields are required." });
  }

  if (!["teacher", "parent"].includes(role)) {
    return res.status(400).json({ error: "role must be 'teacher' or 'parent'." });
  }

  try {
    const token = await createSession(role, String(pin));
    if (!token) {
      return res.status(401).json({ error: "Invalid PIN. Please try again." });
    }

    return res.status(200).json({
      success: true,
      token,
      role,
      expiresIn: 28800, // 8 hours in seconds
      message: `Welcome, ${role === "teacher" ? "Teacher" : "Parent"}!`,
    });
  } catch (err) {
    console.error("[auth] Error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
}

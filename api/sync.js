// api/sync.js — Student progress sync endpoint
// POST /api/sync   — Receives a batch of offline sync events from a device
// GET  /api/sync?studentId=s1 — Returns sync status for a student

import { handleCors } from "./_lib/cors.js";
import { getKV } from "./_lib/kv.js";

// POST body schema:
// {
//   deviceId: string,
//   studentId: string,
//   studentName: string,
//   studentClass: string,
//   items: [
//     {
//       type: "quiz_score" | "lesson_complete" | "question_asked",
//       chapterId?: string,
//       chapterTitle?: string,
//       score?: number,
//       total?: number,
//       question?: string,
//       timestamp: number
//     }
//   ]
// }

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  const kv = await getKV();

  // ── GET: fetch sync status for a student ──────────────────────────────────
  if (req.method === "GET") {
    const { studentId } = req.query;
    if (!studentId) {
      return res.status(400).json({ error: "studentId query param is required." });
    }

    const profileRaw = await kv.get(`student:${studentId}:profile`);
    const profile = profileRaw
      ? typeof profileRaw === "string" ? JSON.parse(profileRaw) : profileRaw
      : null;

    const quizCount = await kv.llen(`student:${studentId}:quiz_scores`) || 0;
    const lessonCount = await kv.llen(`student:${studentId}:lessons`) || 0;

    return res.status(200).json({
      studentId,
      profile,
      quizScoresCount: quizCount,
      lessonsCompletedCount: lessonCount,
      lastSyncAt: profile?.lastSyncAt || null,
    });
  }

  // ── POST: receive offline sync batch ─────────────────────────────────────
  if (req.method === "POST") {
    const { deviceId, studentId, studentName, studentClass, items } = req.body || {};

    if (!studentId || !deviceId) {
      return res.status(400).json({ error: "deviceId and studentId are required." });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "items array must be non-empty." });
    }

    const syncedAt = new Date().toISOString();
    let processed = 0;
    const errors = [];

    for (const item of items) {
      try {
        const itemWithMeta = {
          ...item,
          studentId,
          studentName,
          studentClass,
          deviceId,
          syncedAt,
        };

        switch (item.type) {
          case "quiz_score":
            await kv.lpush(
              `student:${studentId}:quiz_scores`,
              JSON.stringify(itemWithMeta)
            );
            // Also push to class-level list for teacher dashboard
            await kv.lpush(
              `class:${studentClass}:quiz_scores`,
              JSON.stringify(itemWithMeta)
            );
            break;

          case "lesson_complete":
            await kv.lpush(
              `student:${studentId}:lessons`,
              JSON.stringify(itemWithMeta)
            );
            await kv.lpush(
              `class:${studentClass}:lessons`,
              JSON.stringify(itemWithMeta)
            );
            break;

          case "question_asked":
            await kv.lpush(
              `teacher:inbox`,
              JSON.stringify({ ...itemWithMeta, answered: false, answeredAt: null })
            );
            break;

          default:
            errors.push({ item, reason: "Unknown item type" });
        }
        processed++;
      } catch (e) {
        errors.push({ item, reason: e.message });
      }
    }

    // Update student profile summary
    await kv.hset(`student:${studentId}:profile`, {
      studentId,
      studentName,
      studentClass,
      deviceId,
      lastSyncAt: syncedAt,
    });

    return res.status(200).json({
      success: true,
      processed,
      failed: errors.length,
      errors: errors.length > 0 ? errors : undefined,
      syncedAt,
      message: `✅ Synced ${processed} item(s) successfully.`,
    });
  }

  return res.status(405).json({ error: "Method not allowed." });
}

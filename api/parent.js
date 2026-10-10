// api/parent.js — Parent view API
// GET /api/parent?studentId=s1 — Fetch learning summary for a child
// Requires parent authentication token

import { handleCors } from "./_lib/cors.js";
import { getKV } from "./_lib/kv.js";
import { requireRole } from "./_lib/auth.js";

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed. Use GET." });
  }

  const session = await requireRole(req, res, ["parent", "teacher"]);
  if (!session) return;

  const kv = await getKV();
  const { studentId } = req.query;

  if (!studentId) {
    return res.status(400).json({ error: "studentId query param is required." });
  }

  try {
    const [profileRaw, rawQuizzes, rawLessons] = await Promise.all([
      kv.hgetall(`student:${studentId}:profile`),
      kv.lrange(`student:${studentId}:quiz_scores`, 0, 49),
      kv.lrange(`student:${studentId}:lessons`, 0, 49),
    ]);

    const parseList = (raw) =>
      raw
        .map((r) => {
          try {
            return typeof r === "string" ? JSON.parse(r) : r;
          } catch {
            return null;
          }
        })
        .filter(Boolean);

    const quizzes = parseList(rawQuizzes);
    const lessons = parseList(rawLessons);

    // Compute stats
    const quizAvg =
      quizzes.length > 0
        ? Math.round(
            quizzes.reduce((acc, q) => acc + (q.score / (q.total || 10)) * 100, 0) /
              quizzes.length
          )
        : null;

    // Recent activity timeline
    const timeline = [
      ...quizzes.map((q) => ({
        type: "quiz",
        title: `Quiz: ${q.chapterTitle || "Chapter Quiz"}`,
        detail: `Score: ${q.score}/${q.total} (${Math.round((q.score / (q.total || 10)) * 100)}%)`,
        date: q.syncedAt,
      })),
      ...lessons.map((l) => ({
        type: "lesson",
        title: `Completed: ${l.chapterTitle || l.chapterId}`,
        detail: "Chapter completed ✅",
        date: l.syncedAt,
      })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 20);

    // Recommendations based on weak areas
    const weakChapters = quizzes
      .filter((q) => (q.score / (q.total || 10)) * 100 < 60)
      .map((q) => q.chapterTitle || q.chapterId)
      .filter(Boolean);
    const uniqueWeak = [...new Set(weakChapters)].slice(0, 3);

    return res.status(200).json({
      studentId,
      profile: profileRaw,
      summary: {
        lessonsCompleted: lessons.length,
        quizzesTaken: quizzes.length,
        quizAverage: quizAvg,
        lastActivity: timeline[0]?.date || null,
      },
      timeline,
      recommendations:
        uniqueWeak.length > 0
          ? uniqueWeak.map((ch) => ({
              chapter: ch,
              reason: "Quiz score below 60% — recommend revision",
            }))
          : [{ chapter: "All chapters", reason: "Great performance! Keep it up 🎉" }],
    });
  } catch (err) {
    console.error("[parent] Error:", err);
    return res.status(500).json({ error: "Failed to fetch student data." });
  }
}

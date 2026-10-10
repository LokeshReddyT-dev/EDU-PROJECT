// api/teacher.js — Teacher Dashboard analytics API
// GET /api/teacher?class=Class+8 — Aggregated class performance data
// Requires teacher authentication token

import { handleCors } from "./_lib/cors.js";
import { getKV } from "./_lib/kv.js";
import { requireRole } from "./_lib/auth.js";

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed. Use GET." });
  }

  const session = await requireRole(req, res, ["teacher"]);
  if (!session) return;

  const kv = await getKV();
  const { className = "Class 8", limit = "100" } = req.query;
  const limitNum = Math.min(parseInt(limit, 10) || 100, 500);

  try {
    // ── Fetch raw data ──────────────────────────────────────────────────────
    const [rawQuizzes, rawLessons, rawInbox] = await Promise.all([
      kv.lrange(`class:${className}:quiz_scores`, 0, limitNum - 1),
      kv.lrange(`class:${className}:lessons`, 0, limitNum - 1),
      kv.lrange("teacher:inbox", 0, 99),
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
    const inbox = parseList(rawInbox).filter((q) => q.studentClass === className);

    // ── Aggregate per-student ────────────────────────────────────────────────
    const studentsMap = {};

    for (const q of quizzes) {
      if (!studentsMap[q.studentId]) {
        studentsMap[q.studentId] = {
          studentId: q.studentId,
          studentName: q.studentName || "Unknown",
          studentClass: q.studentClass,
          quizScores: [],
          lessonsCompleted: 0,
          questionsAsked: 0,
          lastActivity: null,
        };
      }
      const st = studentsMap[q.studentId];
      st.quizScores.push({ score: q.score, total: q.total, date: q.syncedAt });
      if (!st.lastActivity || q.syncedAt > st.lastActivity) {
        st.lastActivity = q.syncedAt;
      }
    }

    for (const l of lessons) {
      if (!studentsMap[l.studentId]) {
        studentsMap[l.studentId] = {
          studentId: l.studentId,
          studentName: l.studentName || "Unknown",
          studentClass: l.studentClass,
          quizScores: [],
          lessonsCompleted: 0,
          questionsAsked: 0,
          lastActivity: null,
        };
      }
      studentsMap[l.studentId].lessonsCompleted += 1;
      if (!studentsMap[l.studentId].lastActivity || l.syncedAt > studentsMap[l.studentId].lastActivity) {
        studentsMap[l.studentId].lastActivity = l.syncedAt;
      }
    }

    for (const q of inbox) {
      if (studentsMap[q.studentId]) {
        studentsMap[q.studentId].questionsAsked += 1;
      }
    }

    // ── Compute quiz averages ─────────────────────────────────────────────────
    const students = Object.values(studentsMap).map((st) => {
      const avg =
        st.quizScores.length > 0
          ? Math.round(
              (st.quizScores.reduce((acc, s) => acc + (s.score / (s.total || 10)) * 100, 0) /
                st.quizScores.length)
            )
          : null;
      return { ...st, quizAverage: avg, totalQuizzesTaken: st.quizScores.length };
    });

    // ── Class-level summary ────────────────────────────────────────────────────
    const studentCount = students.length;
    const quizAverages = students.filter((s) => s.quizAverage !== null).map((s) => s.quizAverage);
    const classAverage =
      quizAverages.length > 0
        ? Math.round(quizAverages.reduce((a, b) => a + b, 0) / quizAverages.length)
        : null;

    // Chapter popularity
    const chapterHits = {};
    for (const l of lessons) {
      const key = l.chapterTitle || l.chapterId || "Unknown";
      chapterHits[key] = (chapterHits[key] || 0) + 1;
    }
    const topChapters = Object.entries(chapterHits)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([title, count]) => ({ title, studentsCompleted: count }));

    // ── Build response ──────────────────────────────────────────────────────
    return res.status(200).json({
      class: className,
      summary: {
        totalStudents: studentCount,
        classQuizAverage: classAverage,
        totalLessonsCompleted: lessons.length,
        totalQuizzesTaken: quizzes.length,
        pendingQuestions: inbox.filter((q) => !q.answered).length,
        totalQuestions: inbox.length,
        topChapters,
      },
      students,
      recentQuestions: inbox.slice(0, 10),
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[teacher] Error:", err);
    return res.status(500).json({ error: "Failed to fetch dashboard data." });
  }
}

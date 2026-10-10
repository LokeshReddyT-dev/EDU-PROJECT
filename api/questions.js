// api/questions.js — Teacher Inbox: student questions submitted offline
// GET  /api/questions         — Get all pending questions (teacher auth required)
// POST /api/questions         — Submit a question (from student device, no auth)
// PUT  /api/questions/[id]    — Mark question as answered (teacher auth)

import { handleCors } from "./_lib/cors.js";
import { getKV } from "./_lib/kv.js";
import { requireRole } from "./_lib/auth.js";

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  const kv = await getKV();

  // ── POST: Student submits a question ─────────────────────────────────────
  if (req.method === "POST") {
    const { studentId, studentName, studentClass, chapterId, chapterTitle, question } =
      req.body || {};

    if (!studentId || !question) {
      return res.status(400).json({ error: "studentId and question are required." });
    }
    if (!question.trim() || question.trim().length < 5) {
      return res.status(400).json({ error: "Question is too short." });
    }

    const id = `q_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const questionRecord = {
      id,
      studentId,
      studentName: studentName || "Anonymous",
      studentClass: studentClass || "Unknown",
      chapterId: chapterId || null,
      chapterTitle: chapterTitle || "General",
      question: question.trim(),
      answer: null,
      answered: false,
      answeredAt: null,
      createdAt: new Date().toISOString(),
    };

    await kv.lpush("teacher:inbox", JSON.stringify(questionRecord));

    return res.status(201).json({
      success: true,
      questionId: id,
      message: "Your question has been sent to the teacher! 📬",
    });
  }

  // ── GET: Teacher fetches all inbox questions ──────────────────────────────
  if (req.method === "GET") {
    const session = await requireRole(req, res, ["teacher"]);
    if (!session) return;

    const { filter = "all", limit = "50" } = req.query;
    const limitNum = Math.min(parseInt(limit, 10) || 50, 200);

    const raw = await kv.lrange("teacher:inbox", 0, limitNum - 1);
    const questions = raw
      .map((r) => {
        try {
          return typeof r === "string" ? JSON.parse(r) : r;
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    const filtered =
      filter === "unanswered"
        ? questions.filter((q) => !q.answered)
        : filter === "answered"
        ? questions.filter((q) => q.answered)
        : questions;

    return res.status(200).json({
      total: filtered.length,
      filter,
      questions: filtered,
    });
  }

  // ── PUT: Teacher answers a question ──────────────────────────────────────
  if (req.method === "PUT") {
    const session = await requireRole(req, res, ["teacher"]);
    if (!session) return;

    const { questionId, answer } = req.body || {};
    if (!questionId || !answer) {
      return res.status(400).json({ error: "questionId and answer are required." });
    }

    // Read all, find + update, rewrite list
    const raw = await kv.lrange("teacher:inbox", 0, -1);
    const questions = raw
      .map((r) => {
        try {
          return typeof r === "string" ? JSON.parse(r) : r;
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    const idx = questions.findIndex((q) => q.id === questionId);
    if (idx === -1) {
      return res.status(404).json({ error: "Question not found." });
    }

    questions[idx] = {
      ...questions[idx],
      answer: answer.trim(),
      answered: true,
      answeredAt: new Date().toISOString(),
    };

    // Rebuild list (delete + re-push)
    await kv.del("teacher:inbox");
    for (let i = questions.length - 1; i >= 0; i--) {
      await kv.lpush("teacher:inbox", JSON.stringify(questions[i]));
    }

    // Also store the answer so student can fetch it
    await kv.set(
      `question:${questionId}:answer`,
      JSON.stringify({ answer: questions[idx].answer, answeredAt: questions[idx].answeredAt })
    );

    return res.status(200).json({
      success: true,
      message: "Answer saved and will sync to the student device.",
      question: questions[idx],
    });
  }

  return res.status(405).json({ error: "Method not allowed." });
}

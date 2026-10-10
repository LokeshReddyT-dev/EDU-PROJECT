// js/api-client.js — EduPocket Backend API Client
// Handles all communication with the /api backend when online.
// Queues requests offline and replays them when connectivity is restored.

const API_BASE = (typeof window !== "undefined" && (window.EDUPOCKET_API_BASE || localStorage.getItem("edupocket_api_url"))) || "/api";

class EduApiClient {
  constructor() {
    this.authToken = localStorage.getItem("edupocket_auth_token") || null;
    this.authRole = localStorage.getItem("edupocket_auth_role") || null;
    this._syncInProgress = false;
  }

  // ── Auth Header ───────────────────────────────────────────────────────────
  _headers(extra = {}) {
    const h = { "Content-Type": "application/json", ...extra };
    if (this.authToken) h["Authorization"] = `Bearer ${this.authToken}`;
    return h;
  }

  // ── Core fetch wrapper ────────────────────────────────────────────────────
  async _fetch(path, options = {}) {
    const url = `${API_BASE}${path}`;
    try {
      const res = await fetch(url, {
        headers: this._headers(),
        ...options,
        headers: { ...this._headers(), ...(options.headers || {}) },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      return { ok: true, data, status: res.status };
    } catch (err) {
      return { ok: false, error: err.message, data: null };
    }
  }

  // ── Health check ──────────────────────────────────────────────────────────
  async ping() {
    return this._fetch("/health");
  }

  // ── Authentication ────────────────────────────────────────────────────────
  async login(role, pin) {
    const result = await this._fetch("/auth", {
      method: "POST",
      body: JSON.stringify({ role, pin }),
    });
    if (result.ok && result.data?.token) {
      this.authToken = result.data.token;
      this.authRole = role;
      localStorage.setItem("edupocket_auth_token", this.authToken);
      localStorage.setItem("edupocket_auth_role", role);
    }
    return result;
  }

  logout() {
    this.authToken = null;
    this.authRole = null;
    localStorage.removeItem("edupocket_auth_token");
    localStorage.removeItem("edupocket_auth_role");
  }

  isAuthenticated() {
    return !!this.authToken;
  }

  // ── Curriculum ────────────────────────────────────────────────────────────
  async getCurriculumPacks(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return this._fetch(`/curriculum${params ? `?${params}` : ""}`);
  }

  async getCurriculumPack(id) {
    return this._fetch(`/curriculum?id=${encodeURIComponent(id)}`);
  }

  // ── Sync ──────────────────────────────────────────────────────────────────
  // Pushes queued offline items to the server.
  // Takes syncQueue items from the store and batch-posts them.
  async pushSyncQueue(syncQueue, studentProfile) {
    if (this._syncInProgress || !syncQueue || syncQueue.length === 0) return null;
    this._syncInProgress = true;

    try {
      const items = syncQueue.map((entry) => ({
        type: entry.type,
        chapterId: entry.chapterId || null,
        chapterTitle: entry.chapterTitle || null,
        score: entry.score !== undefined ? entry.score : null,
        total: entry.total !== undefined ? entry.total : null,
        question: entry.question || null,
        timestamp: entry.timestamp || Date.now(),
      }));

      const result = await this._fetch("/sync", {
        method: "POST",
        body: JSON.stringify({
          deviceId: this._getDeviceId(),
          studentId: studentProfile?.id || "unknown",
          studentName: studentProfile?.name || "Unknown",
          studentClass: studentProfile?.class || "Unknown",
          items,
        }),
      });

      return result;
    } finally {
      this._syncInProgress = false;
    }
  }

  async getSyncStatus(studentId) {
    return this._fetch(`/sync?studentId=${encodeURIComponent(studentId)}`);
  }

  // ── Questions ─────────────────────────────────────────────────────────────
  async submitQuestion(payload) {
    // payload: { studentId, studentName, studentClass, chapterId, chapterTitle, question }
    return this._fetch("/questions", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async getTeacherInbox(filter = "all") {
    return this._fetch(`/questions?filter=${filter}`);
  }

  async answerQuestion(questionId, answer) {
    return this._fetch("/questions", {
      method: "PUT",
      body: JSON.stringify({ questionId, answer }),
    });
  }

  // ── Teacher Dashboard ─────────────────────────────────────────────────────
  async getTeacherDashboard(className = "Class 8") {
    return this._fetch(`/teacher?class=${encodeURIComponent(className)}`);
  }

  // ── Parent View ───────────────────────────────────────────────────────────
  async getParentView(studentId) {
    return this._fetch(`/parent?studentId=${encodeURIComponent(studentId)}`);
  }

  // ── Utility ───────────────────────────────────────────────────────────────
  _getDeviceId() {
    let id = localStorage.getItem("edupocket_device_id");
    if (!id) {
      id = "dev_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem("edupocket_device_id", id);
    }
    return id;
  }

  // ── Smart Sync: called when app comes online ──────────────────────────────
  // Accepts the app's store instance to read + clear sync queue.
  async smartSync(store) {
    if (!store) return { ok: false, error: "No store provided" };

    const queue = store.state?.syncQueue || [];
    if (queue.length === 0) {
      return { ok: true, data: { message: "Nothing to sync", processed: 0 } };
    }

    const profile = store.getActiveProfile?.();
    const result = await this.pushSyncQueue(queue, profile);

    if (result?.ok) {
      store.clearSyncQueue?.();
    }

    return result;
  }
}

// Export a singleton
window.eduApi = new EduApiClient();

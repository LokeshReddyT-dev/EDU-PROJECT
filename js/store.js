// State Management and Storage for EduPocket
// Offline-first architecture using LocalStorage and memory state

const STORAGE_KEY = "edupocket_store_v1";

const INITIAL_PROFILES = [
  {
    id: "s1",
    name: "Ravi Kumar",
    displayName: "Ravi",
    avatar: "👦",
    class: "Class 8",
    grade: 8,
    language: "te",
    pin: "1234",
    streakDays: 3,
    lessonsCompleted: 4,
    quizAverage: 80,
    learningTimeMinutes: 260,
    history: [
      { chapterId: "c8-sci-ch3", title: "Photosynthesis", progress: 65, date: "Today" },
      { chapterId: "c8-sci-ch1", title: "Crop Production", progress: 100, date: "Yesterday" }
    ],
    quizScores: [
      { quizTitle: "Photosynthesis Quiz", score: 8, total: 10, percent: 80, date: "Today" },
      { quizTitle: "Crop Management", score: 9, total: 10, percent: 90, date: "Yesterday" }
    ],
    achievements: ["first_quiz", "streak_3", "curious_learner"]
  },
  {
    id: "s2",
    name: "Anjali Devi",
    displayName: "Anjali",
    avatar: "👩",
    class: "Class 8",
    grade: 8,
    language: "te",
    pin: "2222",
    streakDays: 5,
    lessonsCompleted: 6,
    quizAverage: 92,
    learningTimeMinutes: 340,
    history: [
      { chapterId: "c8-sci-ch6", title: "Cell Structure", progress: 85, date: "Today" }
    ],
    quizScores: [
      { quizTitle: "Cell Biology", score: 10, total: 10, percent: 100, date: "Today" }
    ],
    achievements: ["first_quiz", "streak_3", "lessons_5", "quiz_master"]
  },
  {
    id: "s3",
    name: "Sita Sharma",
    displayName: "Sita",
    avatar: "👧",
    class: "Class 7",
    grade: 7,
    language: "en",
    pin: "3333",
    streakDays: 2,
    lessonsCompleted: 3,
    quizAverage: 74,
    learningTimeMinutes: 180,
    history: [
      { chapterId: "c8-math-ch4", title: "Fractions & Decimals", progress: 50, date: "Today" }
    ],
    quizScores: [
      { quizTitle: "Fractions Basics", score: 7, total: 10, percent: 70, date: "2 days ago" }
    ],
    achievements: ["first_quiz"]
  },
  {
    id: "s4",
    name: "Arjun Singh",
    displayName: "Arjun",
    avatar: "👦",
    class: "Class 6",
    grade: 6,
    language: "hi",
    pin: "4444",
    streakDays: 1,
    lessonsCompleted: 1,
    quizAverage: 65,
    learningTimeMinutes: 90,
    history: [],
    quizScores: [],
    achievements: []
  }
];

const INITIAL_SYNC_QUEUE = [
  {
    id: "sync_1",
    studentId: "s1",
    studentName: "Ravi",
    actionType: "quiz",
    description: "Ravi completed Science Quiz (Score: 8/10)",
    timestamp: "Just now",
    synced: false
  },
  {
    id: "sync_2",
    studentId: "s3",
    studentName: "Sita",
    actionType: "lesson",
    description: "Sita completed Chapter 2 Lesson Content",
    timestamp: "10 mins ago",
    synced: false
  },
  {
    id: "sync_3",
    studentId: "s4",
    studentName: "Arjun",
    actionType: "question",
    description: "Arjun added question to Ask Teacher List",
    timestamp: "25 mins ago",
    synced: false
  }
];

const INITIAL_TEACHER_QUESTIONS = [
  {
    id: "tq_1",
    studentName: "Ravi Kumar",
    studentAvatar: "👦",
    studentClass: "Class 8",
    question: "Why does the sky appear blue during daytime?",
    questionTe: "పగటివేళ ఆకాశం ఎందుకు నీలిరంగులో కనిపిస్తుంది?",
    status: "waiting", // "waiting" or "answered"
    timestamp: "Today 10:15 AM",
    answer: null,
    sourceLesson: "Light & Atmosphere (Un-downloaded Pack)"
  },
  {
    id: "tq_2",
    studentName: "Arjun Singh",
    studentAvatar: "👦",
    studentClass: "Class 6",
    question: "Why does the moon change its shape every night?",
    questionTe: "ప్రతి రాత్రి చంద్రుడు ఎందుకు తన ఆకారాన్ని మార్చుకుంటాడు?",
    status: "waiting",
    timestamp: "Yesterday 4:20 PM",
    answer: null,
    sourceLesson: "Astronomy Basics"
  },
  {
    id: "tq_3",
    studentName: "Sita Sharma",
    studentAvatar: "👧",
    studentClass: "Class 7",
    question: "What is Newton's First Law of Motion with an everyday example?",
    questionTe: "న్యూటన్ మొదటి నియమానికి దైనందిన ఉదాహరణ ఏమిటి?",
    status: "answered",
    timestamp: "2 days ago",
    answer: "An object remains at rest unless acted upon by an external unbalanced force (like a football resting until kicked).",
    sourceLesson: "Force & Motion"
  }
];

class EduStore {
  constructor() {
    this.state = this.loadState();
    this.listeners = [];
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Could not load from localStorage:", e);
    }

    return {
      connectionMode: "offline", // "online" or "offline" (defaults to offline as requested by prompt scenario or easily toggled)
      activeStudentId: "s1",
      currentLanguage: "te", // Starts in Telugu / English as prioritized
      currentView: "landing", // landing, dashboard, packs, lesson, chat, search, quiz, teacher, parent
      activePackId: "class8-science-te",
      activeChapterId: "c8-sci-ch3",
      packMode: "full", // "lite" or "full"
      profiles: INITIAL_PROFILES,
      syncQueue: INITIAL_SYNC_QUEUE,
      teacherQuestions: INITIAL_TEACHER_QUESTIONS,
      downloadedPackIds: ["class8-science-te", "class8-science-en", "class8-math-en"],
      deviceCapacityMB: 200,
      searchHistory: ["Photosynthesis", "Fractions", "Newton laws"],
      weakTopics: [
        { topic: "Photosynthesis", topicTe: "కిరణజన్య సంయోగక్రియ", score: 42, studentsCount: 14, severity: "critical" },
        { topic: "Fractions & Decimals", topicTe: "భిన్నాలు", score: 48, studentsCount: 12, severity: "warning" },
        { topic: "Force and Motion", topicTe: "బలం మరియు చలనం", score: 55, studentsCount: 9, severity: "warning" }
      ],
      mostAskedQuestions: [
        { q: "What is photosynthesis?", count: 14, topic: "Science" },
        { q: "Why does the moon change shape?", count: 9, topic: "Astronomy" },
        { q: "What is Newton's First Law?", count: 7, topic: "Physics" }
      ]
    };
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn("Could not save to localStorage:", e);
    }
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this.state));
  }

  // Connection Simulation
  setConnectionMode(mode) {
    this.state.connectionMode = mode;
    this.saveState();
  }

  isOnline() {
    return this.state.connectionMode === "online";
  }

  // Active Learner
  getActiveStudent() {
    return this.state.profiles.find(p => p.id === this.state.activeStudentId) || this.state.profiles[0];
  }

  setActiveStudent(studentId) {
    this.state.activeStudentId = studentId;
    const student = this.getActiveStudent();
    if (student && student.language) {
      this.state.currentLanguage = student.language;
    }
    this.saveState();
  }

  addStudent(newStudent) {
    const id = "s_" + Date.now();
    const student = {
      id,
      name: newStudent.name,
      displayName: newStudent.name.split(" ")[0],
      avatar: newStudent.avatar || "🧑",
      class: newStudent.class || "Class 8",
      grade: parseInt(newStudent.class) || 8,
      language: newStudent.language || this.state.currentLanguage,
      pin: newStudent.pin || "0000",
      streakDays: 1,
      lessonsCompleted: 0,
      quizAverage: 0,
      learningTimeMinutes: 10,
      history: [],
      quizScores: [],
      achievements: []
    };
    this.state.profiles.push(student);
    this.state.activeStudentId = id;
    this.saveState();
    return student;
  }

  // Language
  setLanguage(lang) {
    this.state.currentLanguage = lang;
    const student = this.getActiveStudent();
    if (student) {
      student.language = lang;
    }
    this.saveState();
  }

  // Navigation
  setView(view, params = {}) {
    this.state.currentView = view;
    if (params.packId) this.state.activePackId = params.packId;
    if (params.chapterId) this.state.activeChapterId = params.chapterId;
    this.saveState();
  }

  // Storage and Packs
  isPackDownloaded(packId) {
    return this.state.downloadedPackIds.includes(packId);
  }

  downloadPack(packId) {
    if (!this.state.downloadedPackIds.includes(packId)) {
      this.state.downloadedPackIds.push(packId);
      this.saveState();
    }
  }

  deletePack(packId) {
    this.state.downloadedPackIds = this.state.downloadedPackIds.filter(id => id !== packId);
    this.saveState();
  }

  getStorageStats() {
    let usedMB = 0;
    const packs = window.CURRICULUM_PACKS || [];
    packs.forEach(pack => {
      if (this.state.downloadedPackIds.includes(pack.id)) {
        usedMB += (this.state.packMode === "lite" ? pack.liteSizeMB : pack.fullSizeMB);
      }
    });
    const totalMB = this.state.deviceCapacityMB;
    const availableMB = Math.max(0, totalMB - usedMB);
    return {
      usedMB,
      availableMB,
      totalMB,
      percentage: Math.round((usedMB / totalMB) * 100)
    };
  }

  togglePackMode(mode) {
    this.state.packMode = mode;
    this.saveState();
  }

  // Sync Queue
  addSyncItem(actionType, description) {
    const student = this.getActiveStudent();
    const item = {
      id: "sync_" + Date.now(),
      studentId: student.id,
      studentName: student.displayName,
      actionType,
      description,
      timestamp: "Just now",
      synced: false
    };
    this.state.syncQueue.unshift(item);
    this.saveState();
    return item;
  }

  clearSyncQueue() {
    this.state.syncQueue = [];
    this.saveState();
  }

  syncAllProgress() {
    // Merges sync items to teacher dashboard
    this.state.syncQueue.forEach(item => {
      item.synced = true;
    });
    this.saveState();
  }

  // Record Quiz Result
  recordQuizScore(chapterId, quizTitle, score, total) {
    const student = this.getActiveStudent();
    const percent = Math.round((score / total) * 100);
    const record = {
      quizTitle,
      chapterId,
      score,
      total,
      percent,
      date: "Just now"
    };

    student.quizScores.unshift(record);

    // Calculate new average
    const totalScores = student.quizScores.reduce((acc, q) => acc + q.percent, 0);
    student.quizAverage = Math.round(totalScores / student.quizScores.length);

    // Check achievements
    if (!student.achievements.includes("first_quiz")) {
      student.achievements.push("first_quiz");
    }
    if (percent >= 80 && !student.achievements.includes("quiz_master")) {
      student.achievements.push("quiz_master");
    }

    // Queue for sync
    this.addSyncItem(
      "quiz",
      `${student.displayName} completed ${quizTitle} (Score: ${score}/${total} - ${percent}%)`
    );

    this.saveState();
    return record;
  }

  // Record Lesson Reading Progress
  updateLessonProgress(chapterId, progressPercent) {
    const student = this.getActiveStudent();
    const existing = student.history.find(h => h.chapterId === chapterId);
    if (existing) {
      existing.progress = Math.max(existing.progress, progressPercent);
      existing.date = "Just now";
    } else {
      student.history.unshift({
        chapterId,
        title: "Lesson " + chapterId,
        progress: progressPercent,
        date: "Just now"
      });
    }

    if (progressPercent >= 100) {
      student.lessonsCompleted += 1;
      this.addSyncItem("lesson", `${student.displayName} completed lesson ${chapterId}`);
      if (student.lessonsCompleted >= 5 && !student.achievements.includes("lessons_5")) {
        student.achievements.push("lessons_5");
      }
    }

    this.saveState();
  }

  // Questions for Teacher
  addQuestionForTeacher(questionText, sourceLesson = "Curriculum") {
    const student = this.getActiveStudent();
    const item = {
      id: "tq_" + Date.now(),
      studentName: student.name,
      studentAvatar: student.avatar,
      studentClass: student.class,
      question: questionText,
      status: "waiting",
      timestamp: "Just now",
      answer: null,
      sourceLesson
    };
    this.state.teacherQuestions.unshift(item);

    // Add to sync queue as well
    this.addSyncItem(
      "question",
      `${student.displayName} added question: "${questionText.substring(0, 35)}..."`
    );

    this.saveState();
    return item;
  }

  answerTeacherQuestion(questionId, answerText) {
    const item = this.state.teacherQuestions.find(q => q.id === questionId);
    if (item) {
      item.status = "answered";
      item.answer = answerText;
      item.answeredAt = "Just now";
      this.saveState();
    }
  }
}

window.eduStore = new EduStore();

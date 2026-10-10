// EduPocket Main Application Controller
// Orchestrates views, offline routing, shared devices, quizzes, and sync

class EduApp {
  constructor() {
    this.container = document.getElementById("main-view-container");
    this.store = window.eduStore;
    this.ai = window.offlineAI;
    this.demo = window.demoGuide;
    this.i18n = window.I18N;

    this.currentQuizState = {
      chapterId: null,
      currentQuestionIndex: 0,
      selectedAnswer: null,
      isAnswerChecked: false,
      score: 0,
      answersHistory: []
    };

    this.init();
  }

  init() {
    // Register Service Worker for offline PWA
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("./sw.js").then((reg) => {
        console.log("[PWA] Service Worker registered:", reg.scope);
      }).catch((err) => {
        console.warn("[PWA] Service Worker registration failed:", err);
      });
    }

    // Subscribe to store updates
    this.store.subscribe((state) => {
      this.updateHeaderUI(state);
      this.updateBannerUI(state);
    });

    // Bind Global UI Events
    this.bindGlobalEvents();

    // Initial render
    this.updateHeaderUI(this.store.state);
    this.updateBannerUI(this.store.state);
    this.renderCurrentView();

    // Render Demo Guide floating controller
    if (this.demo) {
      this.demo.render();
    }
  }

  t(key) {
    const lang = this.store.state.currentLanguage || "en";
    const dict = this.i18n[lang] || this.i18n.en;
    return dict[key] || this.i18n.en[key] || key;
  }

  bindGlobalEvents() {
    // Simulator Connection Toggles
    const btnOnline = document.getElementById("sim-btn-online");
    const btnOffline = document.getElementById("sim-btn-offline");
    if (btnOnline && btnOffline) {
      btnOnline.onclick = () => {
        this.store.setConnectionMode("online");
        this.triggerFullSyncAnimation();
      };
      btnOffline.onclick = () => {
        this.store.setConnectionMode("offline");
        this.showNotification("🔴 Switched to Offline Mode. All learning runs 100% locally.", "warning");
      };
    }

    // Navigation buttons
    document.querySelectorAll(".nav-link-btn").forEach((btn) => {
      btn.onclick = () => {
        const view = btn.getAttribute("data-view");
        this.navigateTo(view);
      };
    });

    // Brand link
    const brandHome = document.getElementById("brand-home-link");
    if (brandHome) {
      brandHome.onclick = (e) => {
        e.preventDefault();
        this.navigateTo("landing");
      };
    }

    // Language Selector
    const langSelect = document.getElementById("global-lang-select");
    if (langSelect) {
      langSelect.value = this.store.state.currentLanguage;
      langSelect.onchange = (e) => {
        this.store.setLanguage(e.target.value);
        this.updateStaticTranslations();
        this.renderCurrentView();
        this.showNotification(`Language changed to: ${e.target.options[e.target.selectedIndex].text}`, "success");
      };
    }

    // Profiles Modal & Quick Pass Tablet
    const btnOpenProfiles = document.getElementById("btn-open-profiles");
    const btnQuickPass = document.getElementById("btn-quick-pass-tablet");
    const btnCloseProfiles = document.getElementById("btn-close-profiles");
    const profilesModal = document.getElementById("profiles-modal");

    if (btnOpenProfiles) btnOpenProfiles.onclick = () => this.openProfilesModal();
    if (btnQuickPass) btnQuickPass.onclick = () => this.openProfilesModal(true);
    if (btnCloseProfiles && profilesModal) {
      btnCloseProfiles.onclick = () => profilesModal.classList.remove("open");
      profilesModal.onclick = (e) => {
        if (e.target === profilesModal) profilesModal.classList.remove("open");
      };
    }

    // Add Student Form Toggle
    const btnToggleAdd = document.getElementById("btn-toggle-add-student");
    const addStudentForm = document.getElementById("add-student-form");
    if (btnToggleAdd && addStudentForm) {
      btnToggleAdd.onclick = () => {
        addStudentForm.style.display = addStudentForm.style.display === "none" ? "flex" : "none";
      };
      addStudentForm.onsubmit = (e) => {
        e.preventDefault();
        const name = document.getElementById("new-student-name").value;
        const cls = document.getElementById("new-student-class").value;
        const avatar = document.getElementById("new-student-avatar").value;
        const pin = document.getElementById("new-student-pin").value || "1234";

        if (name.trim()) {
          this.store.addStudent({ name, class: cls, avatar, pin });
          this.showNotification(`Student profile created for ${name}!`, "success");
          profilesModal.classList.remove("open");
          addStudentForm.reset();
          addStudentForm.style.display = "none";
          this.renderCurrentView();
        }
      };
    }

    // Sync Drawer
    const btnOpenSync = document.getElementById("btn-open-sync");
    const btnCloseSync = document.getElementById("btn-close-sync");
    const syncOverlay = document.getElementById("sync-drawer-overlay");
    const btnDrawerSync = document.getElementById("btn-drawer-sync-action");

    if (btnOpenSync) btnOpenSync.onclick = () => this.openSyncDrawer();
    if (btnCloseSync && syncOverlay) {
      btnCloseSync.onclick = () => syncOverlay.classList.remove("open");
      syncOverlay.onclick = (e) => {
        if (e.target === syncOverlay) syncOverlay.classList.remove("open");
      };
    }
    if (btnDrawerSync) {
      btnDrawerSync.onclick = () => {
        if (!this.store.isOnline()) {
          this.showNotification("Cannot synchronize while offline. Switch connection mode to Online first.", "warning");
        } else {
          this.triggerFullSyncAnimation();
        }
      };
    }
  }

  updateStaticTranslations() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      el.textContent = this.t(key);
    });
  }

  updateHeaderUI(state) {
    const student = this.store.getActiveStudent();
    const avatarEl = document.getElementById("header-student-avatar");
    const nameEl = document.getElementById("header-student-name");
    if (avatarEl && student) avatarEl.textContent = student.avatar;
    if (nameEl && student) nameEl.textContent = student.displayName;

    // Update active nav button
    document.querySelectorAll(".nav-link-btn").forEach((btn) => {
      if (btn.getAttribute("data-view") === state.currentView) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Sync button counter
    const pendingCount = state.syncQueue.filter(i => !i.synced).length;
    const syncDot = document.getElementById("header-sync-dot");
    const syncText = document.getElementById("header-sync-text");
    if (syncDot) {
      syncDot.className = pendingCount > 0 ? "sync-dot-badge" : "sync-dot-badge all-synced";
    }
    if (syncText) {
      syncText.textContent = pendingCount > 0 ? `${pendingCount} Sync` : "Synced ✓";
    }

    // Language Select
    const langSelect = document.getElementById("global-lang-select");
    if (langSelect && langSelect.value !== state.currentLanguage) {
      langSelect.value = state.currentLanguage;
    }
  }

  updateBannerUI(state) {
    const banner = document.getElementById("global-connection-banner");
    const badge = document.getElementById("banner-status-badge");
    const msg = document.getElementById("banner-message-text");
    const btnOnline = document.getElementById("sim-btn-online");
    const btnOffline = document.getElementById("sim-btn-offline");

    if (state.connectionMode === "offline") {
      banner.className = "offline-global-banner mode-offline";
      badge.textContent = "🔴 " + this.t("offlineMode");
      msg.textContent = this.t("offlineBannerMsg");
      if (btnOnline) btnOnline.className = "";
      if (btnOffline) btnOffline.className = "active-offline";
    } else {
      banner.className = "offline-global-banner mode-online";
      badge.textContent = "🟢 " + this.t("online");
      msg.textContent = this.t("onlineBannerMsg");
      if (btnOnline) btnOnline.className = "active-online";
      if (btnOffline) btnOffline.className = "";
    }
  }

  navigateTo(view, params = {}) {
    this.store.setView(view, params);
    this.renderCurrentView();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  renderCurrentView() {
    const view = this.store.state.currentView;
    switch (view) {
      case "landing":
        this.renderLandingView();
        break;
      case "dashboard":
        this.renderDashboardView();
        break;
      case "packs":
        this.renderPacksView();
        break;
      case "lesson":
        this.renderLessonView();
        break;
      case "chat":
        this.renderChatView();
        break;
      case "search":
        this.renderSearchView();
        break;
      case "quiz":
        this.renderQuizView();
        break;
      case "teacher":
        this.renderTeacherView();
        break;
      case "parent":
        this.renderParentView();
        break;
      default:
        this.renderLandingView();
    }
  }

  // ==========================================================================
  // VIEW 1: LANDING PAGE
  // ==========================================================================
  renderLandingView() {
    this.container.innerHTML = `
      <!-- Hero Section -->
      <section class="hero-section" aria-label="Hero Overview">
        <div class="hero-content">
          <div class="hero-status-pill">
            <span class="status-dot-pulse"></span>
            <span>🟢 ${this.t("offlineLearningReady")}</span>
          </div>
          <h1 class="hero-title">
            Learn Anywhere.<br>
            <span class="highlight-text">Even Without Internet.</span>
          </h1>
          <p class="hero-subtitle">
            EduPocket is an offline-first AI classroom that helps students learn, search lessons, take quizzes, and track progress even when internet connectivity is unreliable.
          </p>
          <div class="hero-actions">
            <button type="button" class="btn btn-primary btn-lg" id="hero-btn-start">
              🚀 ${this.t("startLearning")}
            </button>
            <button type="button" class="btn btn-outline btn-lg" id="hero-btn-demo">
              ▶ ${this.t("exploreDemo")}
            </button>
          </div>
        </div>

        <div class="hero-mockup-wrapper">
          <div class="mockup-tablet">
            <img src="assets/images/hero-illustration.jpg" alt="Student using EduPocket offline tablet in a village school" class="mockup-image">
            <div class="mockup-offline-tag">
              <span>🟢 Offline Mode Active</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Problem Section -->
      <section class="problem-section" aria-label="The Connectivity Problem">
        <div class="section-header-center">
          <span class="section-badge">The Rural Reality</span>
          <h2 class="section-title">What happens when the internet disappears?</h2>
          <p class="section-desc">Students in low-connectivity areas fall behind when digital education assumes 24/7 high-speed cloud access.</p>
        </div>

        <div class="problem-grid">
          <div class="problem-card">
            <span class="problem-icon">❌</span>
            <h3>No Access to Online Tutors</h3>
            <p>Students can no longer get help when stuck on homework or complex textbook topics without connectivity.</p>
          </div>
          <div class="problem-card">
            <span class="problem-icon">⏳</span>
            <h3>Videos Fail to Load</h3>
            <p>Heavy streaming media buffers endlessly, frustrating learners and wasting battery on mobile devices.</p>
          </div>
          <div class="problem-card">
            <span class="problem-icon">🔌</span>
            <h3>Cloud AI Tools Go Dark</h3>
            <p>Traditional generative AI assistants require persistent cloud connections and fail completely offline.</p>
          </div>
          <div class="problem-card">
            <span class="problem-icon">🛑</span>
            <h3>Learning Comes to a Halt</h3>
            <p>Without offline-first architecture, students lose their streaks, confidence, and access to learning materials.</p>
          </div>
        </div>

        <div class="solution-bridge-banner">
          <div class="solution-bridge-text">
            <h3>EduPocket keeps learning available.</h3>
            <p>Download verified curriculum packs once, study anytime without signals, and auto-sync when back online.</p>
          </div>
          <button type="button" class="btn btn-accent btn-lg" id="bridge-btn-curriculum">
            Browse Packs 📦
          </button>
        </div>
      </section>

      <!-- Features Section (8 Cards) -->
      <section class="features-section" aria-label="Features">
        <div class="section-header-center">
          <span class="section-badge">Core Capabilities</span>
          <h2 class="section-title">Engineered for Low-Resource Environments</h2>
          <p class="section-desc">A complete educational ecosystem designed to thrive on shared tablets and low-bandwidth connections.</p>
        </div>

        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon-box">📥</div>
            <h3>Download & Learn Offline</h3>
            <p>Download verified curriculum packs and continue lessons, diagrams, and reading completely without internet.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon-box">🤖</div>
            <h3>Verified AI Assistant</h3>
            <p>Retrieval-first local AI answers questions from verified study materials and cites exact textbook sources.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon-box">🔎</div>
            <h3>Offline Search</h3>
            <p>Instant indexed search across all downloaded lessons, sections, and scientific glossaries without network calls.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon-box">📝</div>
            <h3>Offline Quizzes</h3>
            <p>Interactive practice quizzes with immediate feedback, detailed explanations, and offline score recording.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon-box">👥</div>
            <h3>Shared Device Learning</h3>
            <p>Multiple students share one tablet. Switch profiles with a simple PIN without mixing streaks or quiz records.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon-box">🌐</div>
            <h3>Local Languages</h3>
            <p>Learn seamlessly in English, Telugu (తెలుగు), and Hindi (हिंदी) with translated lessons and explanations.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon-box">🔄</div>
            <h3>Smart Sync</h3>
            <p>Offline quiz scores, completed chapters, and student questions queue locally and auto-sync when online.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon-box">👩‍🏫</div>
            <h3>Teacher Insights</h3>
            <p>Dedicated teacher dashboard reveals class average scores, student weak topics, and unanswered questions.</p>
          </div>
        </div>
      </section>

      <!-- Final Call to Action -->
      <section class="cta-section" aria-label="Call to Action">
        <h2>“The internet may be unavailable. Learning shouldn't be.”</h2>
        <p style="color:var(--text-muted); font-size:1.1rem; max-width:600px;">
          Experience how EduPocket bridges the educational divide for millions of rural students across the globe.
        </p>
        <div class="cta-buttons">
          <button type="button" class="btn btn-primary btn-lg" id="cta-btn-try">
            Try EduPocket Now 🚀
          </button>
          <button type="button" class="btn btn-outline btn-lg" id="cta-btn-demo">
            View Offline Demo ▶
          </button>
        </div>
      </section>
    `;

    // Event listeners
    document.getElementById("hero-btn-start").onclick = () => this.navigateTo("dashboard");
    document.getElementById("hero-btn-demo").onclick = () => {
      if (this.demo) {
        this.demo.isMinimized = false;
        this.demo.goToStep(0);
      }
    };
    document.getElementById("bridge-btn-curriculum").onclick = () => this.navigateTo("packs");
    document.getElementById("cta-btn-try").onclick = () => this.navigateTo("dashboard");
    document.getElementById("cta-btn-demo").onclick = () => {
      if (this.demo) {
        this.demo.isMinimized = false;
        this.demo.goToStep(0);
      }
    };
  }

  // ==========================================================================
  // VIEW 2: STUDENT DASHBOARD
  // ==========================================================================
  renderDashboardView() {
    const student = this.store.getActiveStudent();
    const storage = this.store.getStorageStats();
    const packs = window.CURRICULUM_PACKS || [];
    const activePack = packs.find(p => p.id === this.store.state.activePackId) || packs[0];
    const ch3 = activePack.chapters.find(c => c.id === "c8-sci-ch3") || activePack.chapters[0];

    const lang = this.store.state.currentLanguage;
    const chTitle = ch3 ? (typeof ch3.title === "object" ? (ch3.title[lang] || ch3.title.en) : ch3.title) : "Photosynthesis";

    this.container.innerHTML = `
      <div class="dashboard-view">
        <!-- Student Greeting Bar -->
        <div class="dashboard-greeting-bar">
          <div class="greeting-text">
            <h2>${student.avatar} Namaste, ${student.displayName}!</h2>
            <p>${student.class} • Preferred Language: ${student.language === "te" ? "తెలుగు" : student.language === "hi" ? "हिंदी" : "English"}</p>
          </div>
          <div class="greeting-stats">
            <div class="stat-pill">
              <span style="font-size:1.6rem;">🔥</span>
              <div>
                <div class="stat-num">${student.streakDays}</div>
                <div class="stat-label">${this.t("learningStreak")} (${this.t("days")})</div>
              </div>
            </div>
            <div class="stat-pill">
              <span style="font-size:1.6rem;">⏱️</span>
              <div>
                <div class="stat-num">${Math.round(student.learningTimeMinutes / 60)}h ${student.learningTimeMinutes % 60}m</div>
                <div class="stat-label">Learning Time</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Continue Learning Hero Card -->
        <div class="continue-hero-card">
          <div class="continue-info">
            <h4>${this.t("continueLearning")} • ${activePack.class} ${activePack.subject}</h4>
            <h3>Chapter ${ch3 ? ch3.number : 3} – ${chTitle}</h3>
            <div class="progress-bar-container">
              <div class="progress-bar-fill" style="width: 65%;"></div>
            </div>
            <div class="progress-stats-row">
              <span>${this.t("progress")}: 65%</span>
              <span>${this.t("verifiedCurriculum")}</span>
            </div>
          </div>
          <button type="button" class="btn btn-primary btn-lg" id="dash-btn-continue-reading">
            📖 Continue Reading
          </button>
        </div>

        <!-- 3-Column Metrics Grid -->
        <div class="dash-metrics-grid">
          <div class="metric-card">
            <div class="metric-card-header">
              <h4>${this.t("downloadedLessons")}</h4>
              <span class="metric-icon">📦</span>
            </div>
            <div class="metric-value-huge">${this.store.state.downloadedPackIds.length} Packs</div>
            <p style="font-size:0.85rem; color:var(--text-light);">26 total chapters available offline on this device.</p>
          </div>

          <div class="metric-card">
            <div class="metric-card-header">
              <h4>${this.t("quizProgress")}</h4>
              <span class="metric-icon">⭐</span>
            </div>
            <div class="metric-value-huge">${student.quizAverage}%</div>
            <p style="font-size:0.85rem; color:var(--text-light);">${student.quizScores.length} quizzes completed offline with verified scores.</p>
          </div>

          <div class="metric-card">
            <div class="metric-card-header">
              <h4>${this.t("storageUsed")}</h4>
              <span class="metric-icon">💾</span>
            </div>
            <div class="metric-value-huge">${storage.usedMB} MB</div>
            <p style="font-size:0.85rem; color:var(--text-light);">${storage.availableMB} MB available for more offline lessons.</p>
          </div>
        </div>

        <!-- Quick Actions Navigation Strip -->
        <h3 style="font-size:1.3rem; font-weight:800; color:var(--primary-deep); margin-top:8px;">Quick Study Tools</h3>
        <div class="quick-action-strip">
          <div class="quick-action-tile" id="dash-tile-lessons">
            <span class="quick-tile-icon">📖</span>
            <div class="quick-tile-info">
              <h5>Lesson Reader</h5>
              <p>Read verified chapters & diagrams</p>
            </div>
          </div>
          <div class="quick-action-tile" id="dash-tile-ai">
            <span class="quick-tile-icon">🤖</span>
            <div class="quick-tile-info">
              <h5>Ask EduPocket</h5>
              <p>Zero-hallucination offline AI</p>
            </div>
          </div>
          <div class="quick-action-tile" id="dash-tile-search">
            <span class="quick-tile-icon">🔎</span>
            <div class="quick-tile-info">
              <h5>Offline Search</h5>
              <p>Find definitions & topics</p>
            </div>
          </div>
          <div class="quick-action-tile" id="dash-tile-quiz">
            <span class="quick-tile-icon">📝</span>
            <div class="quick-tile-info">
              <h5>Practice Quiz</h5>
              <p>Test knowledge & earn badges</p>
            </div>
          </div>
        </div>

        <!-- Offline Achievements Bar -->
        <div class="card" style="margin-top:10px;">
          <h4 style="font-size:1.1rem; font-weight:800; color:var(--primary-deep); margin-bottom:14px;">
            Offline Achievements (${student.achievements.length}/5)
          </h4>
          <div style="display:flex; gap:12px; flex-wrap:wrap;">
            <span class="stat-pill" style="background:#fef3c7; color:#92400e;">🏆 First Quiz</span>
            <span class="stat-pill" style="background:#ffedd5; color:#9a3412;">🔥 3-Day Learning Streak</span>
            <span class="stat-pill" style="background:#e0e7ff; color:#3730a3;">📚 5 Lessons Completed</span>
            <span class="stat-pill" style="background:#f3e8ff; color:#6b21a8;">⭐ Quiz Master</span>
            <span class="stat-pill" style="background:#dcfce7; color:#166534;">🔍 Curious Learner</span>
          </div>
        </div>
      </div>
    `;

    document.getElementById("dash-btn-continue-reading").onclick = () => {
      this.navigateTo("lesson", { chapterId: "c8-sci-ch3" });
    };
    document.getElementById("dash-tile-lessons").onclick = () => {
      this.navigateTo("lesson", { chapterId: "c8-sci-ch3" });
    };
    document.getElementById("dash-tile-ai").onclick = () => this.navigateTo("chat");
    document.getElementById("dash-tile-search").onclick = () => this.navigateTo("search");
    document.getElementById("dash-tile-quiz").onclick = () => this.navigateTo("quiz", { chapterId: "c8-sci-ch3" });
  }

  // ==========================================================================
  // VIEW 3: CURRICULUM PACKS & STORAGE MANAGER
  // ==========================================================================
  renderPacksView() {
    const storage = this.store.getStorageStats();
    const packs = window.CURRICULUM_PACKS || [];
    const isOnline = this.store.isOnline();
    const packMode = this.store.state.packMode;

    this.container.innerHTML = `
      <div class="packs-view-container">
        <!-- Storage Dashboard Card -->
        <div class="storage-dashboard-card">
          <div class="storage-header-row">
            <div class="storage-title-area">
              <h3>💾 Device Storage Manager</h3>
              <p style="font-size:0.85rem; color:var(--text-light);">Optimized for budget rural tablets with limited memory storage.</p>
            </div>
            <div class="storage-mode-toggle">
              <button type="button" class="${packMode === "lite" ? "active-mode" : ""}" id="btn-toggle-lite">
                ${this.t("litePack")}
              </button>
              <button type="button" class="${packMode === "full" ? "active-mode" : ""}" id="btn-toggle-full">
                ${this.t("fullPack")}
              </button>
            </div>
          </div>

          <div class="storage-bar-wrapper">
            <div class="storage-bar">
              <div class="storage-fill-used" style="width: ${storage.percentage}%;"></div>
            </div>
            <div class="storage-stats-numbers">
              <span><strong>Used:</strong> ${storage.usedMB} MB (${storage.percentage}%)</span>
              <span><strong>Available:</strong> ${storage.availableMB} MB</span>
              <span><strong>Total Capacity:</strong> ${storage.totalMB} MB</span>
            </div>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="packs-filter-bar">
          <span style="font-weight:700; font-size:0.9rem; color:var(--text-muted);">Filter:</span>
          <button type="button" class="filter-btn active" data-filter="all">All Packs</button>
          <button type="button" class="filter-btn" data-filter="c8">Class 8</button>
          <button type="button" class="filter-btn" data-filter="science">Science</button>
          <button type="button" class="filter-btn" data-filter="math">Mathematics</button>
          <button type="button" class="filter-btn" data-filter="te">తెలుగు (Telugu)</button>
        </div>

        <!-- Packs Grid -->
        <div class="packs-grid" id="packs-card-grid">
          ${packs.map((pack) => {
            const isDownloaded = this.store.isPackDownloaded(pack.id);
            const size = packMode === "lite" ? pack.liteSizeMB : pack.fullSizeMB;
            const lang = this.store.state.currentLanguage;
            const subName = typeof pack.subjectName === "object" ? (pack.subjectName[lang] || pack.subjectName.en) : pack.subject;

            return `
              <div class="pack-card" data-pack-id="${pack.id}">
                <div class="pack-card-header">
                  <span class="pack-class-badge">${pack.class}</span>
                  <span class="pack-lang-badge">${pack.langName}</span>
                </div>
                <h3 class="pack-title">${pack.class} ${subName}</h3>
                <div class="pack-meta-row">
                  <span>📚 ${pack.chaptersCount} ${this.t("chapters")}</span>
                  <span>💾 ${size} MB</span>
                  <span>🏷️ ${pack.version}</span>
                </div>
                <div class="pack-status-indicator ${isDownloaded ? "downloaded" : "not-downloaded"}">
                  <span>${isDownloaded ? "✓ Available Offline" : "☁️ Cloud Storage Only"}</span>
                </div>
                <div class="pack-action-footer">
                  ${isDownloaded ? `
                    <button type="button" class="btn btn-primary btn-sm pack-open-btn" data-id="${pack.id}" style="flex:1;">
                      📖 Open Pack
                    </button>
                    <button type="button" class="btn btn-outline btn-sm pack-delete-btn" data-id="${pack.id}" title="Free device storage">
                      🗑️ Delete
                    </button>
                  ` : `
                    <button type="button" class="btn btn-secondary btn-sm pack-download-btn" data-id="${pack.id}" style="flex:1;">
                      ⬇️ Download Pack (${size} MB)
                    </button>
                  `}
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;

    // Bind Pack Actions
    document.getElementById("btn-toggle-lite").onclick = () => {
      this.store.togglePackMode("lite");
      this.renderPacksView();
    };
    document.getElementById("btn-toggle-full").onclick = () => {
      this.store.togglePackMode("full");
      this.renderPacksView();
    };

    // Download / Delete buttons
    document.querySelectorAll(".pack-download-btn").forEach((btn) => {
      btn.onclick = () => {
        const id = btn.getAttribute("data-id");
        if (!this.store.isOnline()) {
          this.showNotification("Cannot download new packs while in Offline Mode! Switch simulator to Online first.", "warning");
          return;
        }
        btn.textContent = "⏳ Downloading...";
        btn.disabled = true;
        setTimeout(() => {
          this.store.downloadPack(id);
          this.showNotification("✓ Curriculum pack downloaded and cached to local storage!", "success");
          this.renderPacksView();
        }, 800);
      };
    });

    document.querySelectorAll(".pack-delete-btn").forEach((btn) => {
      btn.onclick = () => {
        const id = btn.getAttribute("data-id");
        this.store.deletePack(id);
        this.showNotification("Pack removed from device storage.", "warning");
        this.renderPacksView();
      };
    });

    document.querySelectorAll(".pack-open-btn").forEach((btn) => {
      btn.onclick = () => {
        const id = btn.getAttribute("data-id");
        this.navigateTo("lesson", { packId: id, chapterId: "c8-sci-ch3" });
      };
    });
  }

  // ==========================================================================
  // VIEW 4: LESSON READER
  // ==========================================================================
  renderLessonView() {
    const packs = window.CURRICULUM_PACKS || [];
    const activePack = packs.find(p => p.id === "class8-science-te") || packs[0];
    const chapter = activePack.chapters.find(c => c.id === this.store.state.activeChapterId) || activePack.chapters[0];
    const lang = this.store.state.currentLanguage;

    const chTitle = typeof chapter.title === "object" ? (chapter.title[lang] || chapter.title.en) : chapter.title;
    const objectives = chapter.objectives[lang] || chapter.objectives.en || [];

    this.container.innerHTML = `
      <div class="lesson-view-container">
        <!-- Top Bar -->
        <div class="lesson-top-bar">
          <button type="button" class="btn btn-outline btn-sm" id="lesson-back-btn">
            ← ${this.t("backToLessons")}
          </button>
          <div class="verified-badge">
            <span>🛡️ ${this.t("verifiedCurriculum")}</span>
          </div>
          <div class="sim-toggle-pill">
            <button type="button" class="${lang === 'en' ? 'active-online' : ''}" id="btn-lesson-lang-en">English</button>
            <button type="button" class="${lang === 'te' ? 'active-online' : ''}" id="btn-lesson-lang-te">తెలుగు</button>
          </div>
        </div>

        <!-- Header Card -->
        <div class="lesson-header-card">
          <span style="font-size:0.85rem; font-weight:700; color:var(--primary); text-transform:uppercase;">
            ${activePack.class} ${activePack.subject} • Chapter ${chapter.number}
          </span>
          <h1 class="lesson-chapter-title">${chTitle}</h1>
          <p style="color:var(--text-light); font-size:0.9rem;">Estimated Read Time: ${chapter.readTime} • Offline Accessible</p>

          <div class="lesson-objectives-box">
            <h4>🎯 ${this.t("learningObjectives")}</h4>
            <ul>
              ${objectives.map(obj => `<li>${obj}</li>`).join("")}
            </ul>
          </div>
        </div>

        <!-- Sections -->
        ${chapter.sections.map((sec) => {
          const sTitle = typeof sec.title === "object" ? (sec.title[lang] || sec.title.en) : sec.title;
          const sContent = typeof sec.content === "object" ? (sec.content[lang] || sec.content.en) : sec.content;

          return `
            <div class="lesson-section-card">
              <h2 class="section-h3">${sTitle}</h2>
              <div class="section-body-text">${sContent}</div>
              ${sec.id === "sec2" ? `
                <div class="equation-box">
                  6CO₂ + 6H₂O + Sunlight —[Chlorophyll]→ C₆H₁₂O₆ (Glucose) + 6O₂ (Oxygen)
                </div>
              ` : ""}
            </div>
          `;
        }).join("")}

        <!-- Interactive SVG Diagram -->
        <div class="diagram-card">
          <h3 style="font-size:1.3rem; font-weight:800; color:var(--primary-deep); margin-bottom:12px;">
            🖼️ ${lang === "te" ? "కిరణజన్య సంయోగక్రియ విధానం మరియు పత్ర నిర్మాణం" : "Photosynthesis Process & Leaf Anatomy"}
          </h3>
          <div class="diagram-svg-container">
            <svg viewBox="0 0 600 320" width="100%" height="280" xmlns="http://www.w3.org/2000/svg">
              <!-- Background Sky/Ground -->
              <rect width="600" height="320" fill="#f0fdf4" rx="12"/>
              <!-- Sun -->
              <circle cx="90" cy="70" r="38" fill="#f59e0b" />
              <path d="M90 20 L90 5 M90 120 L90 135 M40 70 L25 70 M140 70 L155 70 M55 35 L42 22 M125 105 L138 118 M55 105 L42 118 M125 35 L138 22" stroke="#d97706" stroke-width="4" stroke-linecap="round"/>
              <text x="90" y="75" font-size="11" font-weight="bold" fill="#78350f" text-anchor="middle">Sunlight (Energy)</text>

              <!-- Leaf Shape -->
              <path d="M 220 220 C 200 90, 420 70, 490 180 C 420 260, 260 250, 220 220 Z" fill="#22c55e" stroke="#15803d" stroke-width="4"/>
              <!-- Main Leaf Vein -->
              <path d="M 220 220 Q 350 180 490 180" stroke="#166534" stroke-width="3" fill="none"/>
              <!-- Secondary Veins -->
              <path d="M 300 200 Q 330 140 370 115 M 360 190 Q 400 150 430 130 M 340 195 Q 360 240 400 245" stroke="#166534" stroke-width="2" fill="none"/>

              <!-- Stomata Insets / Arrows -->
              <!-- CO2 in -->
              <path d="M 220 80 L 290 130" stroke="#2563eb" stroke-width="3" stroke-dasharray="5,5" marker-end="url(#arrow)"/>
              <text x="220" y="70" font-size="12" font-weight="bold" fill="#1e40af">Carbon Dioxide (CO₂) IN</text>

              <!-- O2 out -->
              <path d="M 420 120 L 490 70" stroke="#059669" stroke-width="3" marker-end="url(#arrow)"/>
              <text x="440" y="60" font-size="12" font-weight="bold" fill="#065f46">Oxygen (O₂) RELEASED</text>

              <!-- Water in from stem -->
              <path d="M 160 270 L 225 225" stroke="#0284c7" stroke-width="4"/>
              <text x="140" y="295" font-size="12" font-weight="bold" fill="#0369a1">Water (H₂O) from Roots</text>

              <!-- Glucose label -->
              <rect x="330" y="170" width="130" height="32" rx="6" fill="#fef08a" stroke="#ca8a04"/>
              <text x="395" y="190" font-size="11" font-weight="bold" fill="#854d0e" text-anchor="middle">Glucose (C₆H₁₂O₆)</text>
            </svg>
          </div>
        </div>

        <!-- Glossary Terms -->
        <div class="terms-card">
          <h3 style="font-size:1.3rem; font-weight:800; color:var(--primary-deep);">
            📖 ${this.t("importantTerms")}
          </h3>
          <div class="terms-grid">
            ${chapter.terms.map(t => {
              const def = lang === "te" && t.definitionTe ? t.definitionTe : t.definition;
              return `
                <div class="term-item">
                  <div class="term-title">${t.term}</div>
                  <div class="term-desc">${def}</div>
                </div>
              `;
            }).join("")}
          </div>
        </div>

        <!-- Lesson Bottom Sticky Actions -->
        <div class="lesson-bottom-bar">
          <button type="button" class="btn btn-outline" id="btn-lesson-ask-ai">
            🤖 ${this.t("askAboutSection")}
          </button>
          <button type="button" class="btn btn-primary btn-lg" id="btn-lesson-quiz">
            📝 ${this.t("takeQuiz")}
          </button>
        </div>
      </div>
    `;

    document.getElementById("lesson-back-btn").onclick = () => this.navigateTo("dashboard");
    document.getElementById("btn-lesson-lang-en").onclick = () => {
      this.store.setLanguage("en");
      this.renderLessonView();
    };
    document.getElementById("btn-lesson-lang-te").onclick = () => {
      this.store.setLanguage("te");
      this.renderLessonView();
    };
    document.getElementById("btn-lesson-ask-ai").onclick = () => {
      this.navigateTo("chat");
    };
    document.getElementById("btn-lesson-quiz").onclick = () => {
      this.navigateTo("quiz", { chapterId: chapter.id });
    };
  }

  // ==========================================================================
  // VIEW 5: ASK EDUPOCKET AI (CHAT)
  // ==========================================================================
  renderChatView() {
    const student = this.store.getActiveStudent();
    const lang = this.store.state.currentLanguage;

    this.container.innerHTML = `
      <div class="chat-view-container">
        <!-- Banner -->
        <div class="chat-banner">
          <div class="chat-banner-text">
            <h3>🤖 ${this.t("askEduPocketTitle")}</h3>
            <p>${this.t("askEduPocketSubtitle")}</p>
          </div>
          <span class="banner-badge" style="background:#ecfdf5; color:#065f46; border:1px solid #a7f3d0;">
            ✓ ${this.t("aiConfidence")}
          </span>
        </div>

        <!-- Messages Area -->
        <div class="chat-messages-scroll" id="chat-messages-container">
          <div class="chat-message ai-msg">
            <div class="msg-avatar">🤖</div>
            <div class="msg-bubble">
              <p>
                ${lang === "te" 
                  ? `నమస్తే ${student.displayName}! నేను మీ ఆఫ్‌లైన్ ఎడ్యుపాకెట్ అసిస్టెంట్‌ని. మీరు డౌన్‌లోడ్ చేసుకున్న పాఠ్యపుస్తకాల ఆధారంగా మాత్రమే సమాధానాలు ఇస్తాను. అడగండి!`
                  : `Hello ${student.displayName}! I am your offline EduPocket assistant. I answer questions strictly using your downloaded curriculum materials. Ask away!`}
              </p>
            </div>
          </div>
        </div>

        <!-- Suggestions Pills -->
        <div class="chat-suggestions-bar">
          <button type="button" class="suggestion-pill" data-q="What is photosynthesis?">
            🌱 What is photosynthesis?
          </button>
          <button type="button" class="suggestion-pill" data-q="Which gas is used by plants during photosynthesis?">
            💨 Which gas is used by plants?
          </button>
          <button type="button" class="suggestion-pill" data-q="What are stomata?">
            🔬 What are stomata?
          </button>
          <button type="button" class="suggestion-pill" data-q="కిరణజన్య సంయోగక్రియ అంటే ఏమిటి?">
            🌿 కిరణజన్య సంయోగక్రియ అంటే ఏమిటి?
          </button>
          <button type="button" class="suggestion-pill" data-q="Why does the sky appear blue?">
            ❓ Why is the sky blue? (No-hallucination test)
          </button>
        </div>

        <!-- Input Bar -->
        <form class="chat-input-row" id="chat-form">
          <input type="text" id="chat-text-input" class="chat-input" placeholder="${this.t("aiInputPlaceholder")}" required autocomplete="off">
          <button type="submit" class="btn btn-primary" id="chat-send-btn">
            Send ➔
          </button>
        </form>
      </div>
    `;

    // Bind chat events
    const form = document.getElementById("chat-form");
    const input = document.getElementById("chat-text-input");
    form.onsubmit = (e) => {
      e.preventDefault();
      const val = input.value.trim();
      if (val) {
        this.askAIChat(val);
        input.value = "";
      }
    };

    document.querySelectorAll(".suggestion-pill").forEach((pill) => {
      pill.onclick = () => {
        const q = pill.getAttribute("data-q");
        this.askAIChat(q);
      };
    });
  }

  askAIChat(question) {
    const chatContainer = document.getElementById("chat-messages-container");
    if (!chatContainer) return;

    const student = this.store.getActiveStudent();
    const lang = this.store.state.currentLanguage;

    // Render Student User Bubble
    const userMsg = document.createElement("div");
    userMsg.className = "chat-message user-msg";
    userMsg.innerHTML = `
      <div class="msg-avatar">${student.avatar}</div>
      <div class="msg-bubble">
        <p>${question}</p>
      </div>
    `;
    chatContainer.appendChild(userMsg);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Run Offline Retrieval Search
    setTimeout(() => {
      const result = this.ai.searchCurriculum(question, { language: lang });
      const aiMsg = document.createElement("div");
      aiMsg.className = "chat-message ai-msg";

      if (result.found) {
        aiMsg.innerHTML = `
          <div class="msg-avatar">🤖</div>
          <div class="msg-bubble">
            <p><strong>${result.answer}</strong></p>
            <div class="ai-source-box">
              <strong>${this.t("sourceCurriculum")}</strong> ${result.source}
              <div style="font-size:0.75rem; color:#047857; margin-top:2px;">
                ✓ Confidence: ${result.confidenceScore}% (Verified Textbook Passage)
              </div>
            </div>
          </div>
        `;
      } else {
        // SAFE FALLBACK: "AI that knows when it doesn't know"
        aiMsg.innerHTML = `
          <div class="msg-avatar">🤖</div>
          <div class="msg-bubble">
            <p>${result.message || this.t("aiNotFound")}</p>
            <div class="ai-unfound-box">
              <p>⚠️ To maintain strict educational truth, EduPocket never invents or hallucinates answers.</p>
              <button type="button" class="btn btn-sm btn-accent" id="btn-save-to-teacher-${Date.now()}">
                📩 ${this.t("addToTeacherList")}
              </button>
            </div>
          </div>
        `;
      }

      chatContainer.appendChild(aiMsg);
      chatContainer.scrollTop = chatContainer.scrollHeight;

      // Bind "Add to Ask Teacher List" button if present
      const addTeacherBtn = aiMsg.querySelector("button[id^='btn-save-to-teacher']");
      if (addTeacherBtn) {
        addTeacherBtn.onclick = () => {
          this.store.addQuestionForTeacher(question);
          addTeacherBtn.disabled = true;
          addTeacherBtn.textContent = this.t("questionAddedToTeacher");
          this.showNotification("Saved to Teacher's Inbox for offline classroom review!", "success");
        };
      }
    }, 250);
  }

  // ==========================================================================
  // VIEW 6: OFFLINE SEARCH
  // ==========================================================================
  renderSearchView() {
    this.container.innerHTML = `
      <div class="search-view-container">
        <div class="search-header-box">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h2 style="font-size:1.6rem; font-weight:800; color:var(--primary-deep);">
              🔎 Offline Curriculum Search
            </h2>
            <span class="banner-badge" style="background:#fee2e2; color:#991b1b; border:1px solid #fecaca;">
              ${this.t("offlineSearchActive")}
            </span>
          </div>
          <div class="search-input-wrapper">
            <span class="search-icon-inside">🔍</span>
            <input type="text" id="global-search-input" class="big-search-input" placeholder="${this.t("searchPlaceholder")}" autofocus>
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <span style="font-size:0.85rem; color:var(--text-light); font-weight:600;">Popular searches:</span>
            <button type="button" class="suggestion-pill search-quick-pill" data-q="Photosynthesis">Photosynthesis</button>
            <button type="button" class="suggestion-pill search-quick-pill" data-q="Fractions">Fractions</button>
            <button type="button" class="suggestion-pill search-quick-pill" data-q="Stomata">Stomata</button>
            <button type="button" class="suggestion-pill search-quick-pill" data-q="కిరణజన్య సంయోగక్రియ">కిరణజన్య సంయోగక్రియ</button>
          </div>
        </div>

        <div class="search-results-list" id="search-results-container">
          <p style="text-align:center; color:var(--text-light); padding:30px;">
            Type a term or scientific topic above to search through all locally downloaded lessons.
          </p>
        </div>
      </div>
    `;

    const input = document.getElementById("global-search-input");
    const container = document.getElementById("search-results-container");

    const doSearch = (query) => {
      if (!query || query.trim().length === 0) {
        container.innerHTML = `<p style="text-align:center; color:var(--text-light); padding:30px;">Type a topic above to search.</p>`;
        return;
      }

      const results = this.ai.searchGlobalLessons(query, this.store.state.currentLanguage);
      if (results.length === 0) {
        container.innerHTML = `
          <div class="card" style="text-align:center; padding:36px;">
            <span style="font-size:2rem;">🔍</span>
            <h4 style="margin-top:8px; color:var(--primary-deep);">${this.t("noResults")}</h4>
            <p style="font-size:0.88rem; color:var(--text-light); margin-top:4px;">
              Make sure you have downloaded the relevant curriculum pack or check your spelling.
            </p>
          </div>
        `;
        return;
      }

      container.innerHTML = results.map(res => `
        <div class="search-result-card">
          <div class="result-breadcrumbs">${res.packClass} ${res.subject} → Chapter ${res.chapterNumber}</div>
          <h3 class="result-title">${res.chapterTitle} (${res.sectionTitle})</h3>
          <p class="result-snippet">${res.snippet}</p>
          <div>
            <button type="button" class="btn btn-sm btn-primary search-jump-btn" data-chap="${res.chapterId}">
              📖 Read Lesson
            </button>
          </div>
        </div>
      `).join("");

      container.querySelectorAll(".search-jump-btn").forEach(btn => {
        btn.onclick = () => {
          const chId = btn.getAttribute("data-chap");
          this.navigateTo("lesson", { chapterId: chId });
        };
      });
    };

    input.oninput = (e) => doSearch(e.target.value);
    document.querySelectorAll(".search-quick-pill").forEach(p => {
      p.onclick = () => {
        const q = p.getAttribute("data-q");
        input.value = q;
        doSearch(q);
      };
    });
  }

  // ==========================================================================
  // VIEW 7: OFFLINE QUIZZES
  // ==========================================================================
  renderQuizView() {
    const packs = window.CURRICULUM_PACKS || [];
    const activePack = packs.find(p => p.id === "class8-science-te") || packs[0];
    const chapter = activePack.chapters.find(c => c.id === (this.store.state.activeChapterId || "c8-sci-ch3")) || activePack.chapters[0];
    const quizList = chapter.quiz || [];
    const lang = this.store.state.currentLanguage;

    if (!this.currentQuizState.chapterId || this.currentQuizState.chapterId !== chapter.id) {
      this.currentQuizState = {
        chapterId: chapter.id,
        currentQuestionIndex: 0,
        selectedAnswer: null,
        isAnswerChecked: false,
        score: 0,
        answersHistory: []
      };
    }

    const state = this.currentQuizState;
    const isCompleted = state.currentQuestionIndex >= quizList.length;

    if (isCompleted) {
      // Completed Screen
      this.container.innerHTML = `
        <div class="quiz-view-container">
          <div class="quiz-complete-card">
            <span style="font-size:3rem;">🎉</span>
            <h2 style="font-size:2rem; font-weight:850; color:var(--primary-deep);">${this.t("quizComplete")}</h2>
            
            <div class="score-circle">
              <span class="score-circle-num">${state.score}/${quizList.length}</span>
              <span class="score-circle-label">${Math.round((state.score / quizList.length) * 100)}%</span>
            </div>

            <div class="banner-badge" style="background:#ecfdf5; color:#065f46; border:1px solid #a7f3d0; padding:8px 18px; font-size:0.95rem;">
              ${this.t("progressSavedOffline")}
            </div>

            <p style="color:var(--text-muted); max-width:480px;">
              Your score has been stored on this device. When internet becomes available, your progress will automatically sync to your teacher's dashboard.
            </p>

            <div style="display:flex; gap:12px; margin-top:8px;">
              <button type="button" class="btn btn-outline" id="quiz-btn-retake">
                🔄 ${this.t("retryQuiz")}
              </button>
              <button type="button" class="btn btn-primary" id="quiz-btn-back-lessons">
                📖 Back to Lessons
              </button>
            </div>
          </div>
        </div>
      `;

      document.getElementById("quiz-btn-retake").onclick = () => {
        this.currentQuizState.currentQuestionIndex = 0;
        this.currentQuizState.score = 0;
        this.currentQuizState.selectedAnswer = null;
        this.currentQuizState.isAnswerChecked = false;
        this.renderQuizView();
      };
      document.getElementById("quiz-btn-back-lessons").onclick = () => {
        this.navigateTo("lesson", { chapterId: chapter.id });
      };
      return;
    }

    // Active Question Screen
    const currentQ = quizList[state.currentQuestionIndex];
    const qText = lang === "te" && currentQ.questionTe ? currentQ.questionTe : currentQ.question;
    const options = lang === "te" && currentQ.optionsTe ? currentQ.optionsTe : currentQ.options;
    const explanation = lang === "te" && currentQ.explanationTe ? currentQ.explanationTe : currentQ.explanation;
    const letters = ["A", "B", "C", "D"];

    this.container.innerHTML = `
      <div class="quiz-view-container">
        <!-- Header -->
        <div class="quiz-header-card">
          <div>
            <span style="font-size:0.85rem; font-weight:700; color:var(--primary); text-transform:uppercase;">
              ${activePack.class} ${activePack.subject} • Chapter ${chapter.number} Quiz
            </span>
            <h3 style="font-size:1.2rem; font-weight:800; color:var(--primary-deep);">
              ${this.t("question")} ${state.currentQuestionIndex + 1} of ${quizList.length}
            </h3>
          </div>
          <div class="stat-pill" style="background:#eff6ff; color:#1d4ed8;">
            Score: ${state.score}
          </div>
        </div>

        <!-- Question Card -->
        <div class="quiz-card">
          <h2 class="quiz-question-title">${qText}</h2>
          
          <div class="quiz-options-list">
            ${options.map((opt, idx) => {
              let optClass = "quiz-option-btn";
              if (state.selectedAnswer === idx) optClass += " selected";
              if (state.isAnswerChecked) {
                if (idx === currentQ.correctIndex) optClass += " correct-state";
                else if (state.selectedAnswer === idx) optClass += " incorrect-state";
              }

              return `
                <button type="button" class="${optClass}" data-opt-idx="${idx}" ${state.isAnswerChecked ? "disabled" : ""}>
                  <span class="option-badge-letter">${letters[idx]}</span>
                  <span>${opt}</span>
                </button>
              `;
            }).join("")}
          </div>

          <!-- Feedback Box -->
          ${state.isAnswerChecked ? `
            <div class="quiz-feedback-box ${state.selectedAnswer === currentQ.correctIndex ? 'correct' : 'incorrect'}">
              <div style="font-weight:800; font-size:1.1rem;">
                ${state.selectedAnswer === currentQ.correctIndex ? this.t("correct") : this.t("incorrect")}
              </div>
              <p style="font-size:0.95rem; line-height:1.5;">${explanation}</p>
              <div class="feedback-review-link" id="feedback-review-btn">
                📖 ${this.t("reviewLesson")} ${currentQ.reviewSection}
              </div>
            </div>
          ` : ""}

          <!-- Actions -->
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px;">
            <button type="button" class="btn btn-outline" id="quiz-abort-btn">
              Back to Lessons
            </button>
            ${!state.isAnswerChecked ? `
              <button type="button" class="btn btn-primary" id="quiz-check-btn" ${state.selectedAnswer === null ? "disabled" : ""}>
                ${this.t("checkAnswer")}
              </button>
            ` : `
              <button type="button" class="btn btn-primary" id="quiz-next-btn">
                ${state.currentQuestionIndex === quizList.length - 1 ? this.t("finishQuiz") : this.t("nextQuestion")} ➔
              </button>
            `}
          </div>
        </div>
      </div>
    `;

    // Bind option selection
    document.querySelectorAll(".quiz-option-btn").forEach(btn => {
      btn.onclick = () => {
        if (!state.isAnswerChecked) {
          state.selectedAnswer = parseInt(btn.getAttribute("data-opt-idx"));
          this.renderQuizView();
        }
      };
    });

    const checkBtn = document.getElementById("quiz-check-btn");
    if (checkBtn) {
      checkBtn.onclick = () => {
        state.isAnswerChecked = true;
        if (state.selectedAnswer === currentQ.correctIndex) {
          state.score += 1;
        }
        this.renderQuizView();
      };
    }

    const nextBtn = document.getElementById("quiz-next-btn");
    if (nextBtn) {
      nextBtn.onclick = () => {
        state.currentQuestionIndex += 1;
        state.selectedAnswer = null;
        state.isAnswerChecked = false;

        // If completed now, record score in offline store
        if (state.currentQuestionIndex >= quizList.length) {
          this.store.recordQuizScore(chapter.id, `${chapter.number}: Photosynthesis Quiz`, state.score, quizList.length);
        }
        this.renderQuizView();
      };
    }

    const abortBtn = document.getElementById("quiz-abort-btn");
    if (abortBtn) {
      abortBtn.onclick = () => this.navigateTo("lesson", { chapterId: chapter.id });
    }

    const reviewBtn = document.getElementById("feedback-review-btn");
    if (reviewBtn) {
      reviewBtn.onclick = () => this.navigateTo("lesson", { chapterId: chapter.id });
    }
  }

  // ==========================================================================
  // VIEW 8: TEACHER DASHBOARD
  // ==========================================================================
  renderTeacherView() {
    const state = this.store.state;
    const students = state.profiles;
    const questions = state.teacherQuestions;
    const weakTopics = state.weakTopics;
    const mostAsked = state.mostAskedQuestions;

    this.container.innerHTML = `
      <div class="teacher-view-container">
        <!-- Overview Header -->
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div>
            <h2 style="font-size:1.8rem; font-weight:850; color:var(--primary-deep);">
              👩‍🏫 ${this.t("teacherDashboard")}
            </h2>
            <p style="font-size:0.95rem; color:var(--text-light);">
              Class 8 Science & Math • Village Zilla Parishad High School
            </p>
          </div>
          <button type="button" class="btn btn-outline" id="btn-teacher-sync-now">
            🔄 Refresh Sync Telemetry
          </button>
        </div>

        <!-- 4 Stat Boxes -->
        <div class="teacher-stats-row">
          <div class="teacher-stat-box">
            <span class="title">${this.t("totalStudents")}</span>
            <span class="num">32</span>
            <span style="font-size:0.8rem; color:var(--text-light);">Enrolled in Class 8 Roster</span>
          </div>
          <div class="teacher-stat-box">
            <span class="title">${this.t("activeToday")}</span>
            <span class="num" style="color:#059669;">24</span>
            <span style="font-size:0.8rem; color:#059669;">75% attendance today</span>
          </div>
          <div class="teacher-stat-box">
            <span class="title">${this.t("avgQuizScore")}</span>
            <span class="num" style="color:#2563eb;">76%</span>
            <span style="font-size:0.8rem; color:var(--text-light);">Across 4 Science chapters</span>
          </div>
          <div class="teacher-stat-box">
            <span class="title">${this.t("pendingSyncs")}</span>
            <span class="num" style="color:${state.syncQueue.length > 0 ? '#ef4444' : '#10b981'};">
              ${state.syncQueue.filter(i => !i.synced).length}
            </span>
            <span style="font-size:0.8rem; color:var(--text-light);">
              ${state.syncQueue.filter(i => !i.synced).length === 0 ? "All devices synchronized ✓" : "Waiting for teacher connectivity"}
            </span>
          </div>
        </div>

        <!-- Two Column Grid: Weak Topics & Most Asked Questions -->
        <div class="teacher-grid-two-col">
          <!-- Weak Topics Card -->
          <div class="card">
            <h3 style="font-size:1.25rem; font-weight:800; color:var(--primary-deep); margin-bottom:14px;">
              ⚠️ ${this.t("weakTopics")}
            </h3>
            <p style="font-size:0.85rem; color:var(--text-light); margin-bottom:16px;">
              Based on offline quiz question accuracy, identify chapters that need in-class chalkboard revision.
            </p>
            ${weakTopics.map(wt => `
              <div class="weak-topic-row">
                <div class="weak-topic-header">
                  <span>${wt.topic} (${wt.topicTe})</span>
                  <span style="color:#ef4444;">${wt.score}% mastery</span>
                </div>
                <div class="storage-bar" style="height:8px;">
                  <div class="weak-bar-fill" style="width: ${wt.score}%;"></div>
                </div>
                <span style="font-size:0.75rem; color:var(--text-light);">${wt.studentsCount} students made mistakes on this concept</span>
              </div>
            `).join("")}
          </div>

          <!-- Most Asked Questions Card -->
          <div class="card">
            <h3 style="font-size:1.25rem; font-weight:800; color:var(--primary-deep); margin-bottom:14px;">
              🔍 ${this.t("mostAskedQuestions")}
            </h3>
            <p style="font-size:0.85rem; color:var(--text-light); margin-bottom:16px;">
              Frequency of queries asked to EduPocket offline AI by students during study sessions.
            </p>
            <div style="display:flex; flex-direction:column; gap:12px;">
              ${mostAsked.map((item, idx) => `
                <div style="display:flex; align-items:center; justify-content:space-between; padding:12px; background:var(--surface-alt); border-radius:var(--radius-md);">
                  <div style="display:flex; align-items:center; gap:10px;">
                    <span style="font-weight:800; color:var(--primary); font-size:1.1rem;">#${idx + 1}</span>
                    <span style="font-weight:600; font-size:0.95rem;">${item.q}</span>
                  </div>
                  <span class="banner-badge" style="background:#dbeafe; color:#1e40af;">
                    ${item.count} queries
                  </span>
                </div>
              `).join("")}
            </div>
          </div>
        </div>

        <!-- Unanswered Questions for Teacher Inbox -->
        <div class="card">
          <h3 style="font-size:1.25rem; font-weight:800; color:var(--primary-deep); margin-bottom:12px;">
            📩 ${this.t("teacherInbox")}
          </h3>
          <p style="font-size:0.85rem; color:var(--text-light); margin-bottom:16px;">
            Questions students asked offline that could not be verified in the downloaded curriculum. Answer them here!
          </p>

          <div class="teacher-inbox-list">
            ${questions.map(q => `
              <div class="inbox-item-card">
                <div class="inbox-student-header">
                  <div class="student-tag-group">
                    <span style="font-size:1.4rem;">${q.studentAvatar}</span>
                    <span>${q.studentName} (${q.studentClass})</span>
                  </div>
                  <span class="inbox-status-badge ${q.status === 'answered' ? 'answered' : 'waiting'}">
                    ${q.status === 'answered' ? '✓ Answered' : '🟡 Waiting for Teacher'}
                  </span>
                </div>
                <div style="font-size:1.05rem; font-weight:700; color:var(--text-main);">
                  “${q.question}”
                </div>
                <div style="font-size:0.8rem; color:var(--text-light);">
                  Submitted ${q.timestamp} • Context: ${q.sourceLesson}
                </div>
                ${q.status === 'answered' ? `
                  <div style="padding:10px 14px; background:#ecfdf5; border-radius:var(--radius-md); font-size:0.9rem; color:#065f46; border-left:3px solid #10b981;">
                    <strong>Teacher Answer:</strong> ${q.answer}
                  </div>
                ` : `
                  <div style="display:flex; gap:8px; margin-top:6px;">
                    <input type="text" class="chat-input" id="input-teacher-ans-${q.id}" placeholder="Type your explanation for ${q.studentName.split(' ')[0]}..." style="font-size:0.85rem; padding:8px 12px;">
                    <button type="button" class="btn btn-sm btn-primary btn-submit-ans" data-qid="${q.id}">
                      Submit Answer
                    </button>
                  </div>
                `}
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Student Progress Roster -->
        <div class="card">
          <h3 style="font-size:1.25rem; font-weight:800; color:var(--primary-deep); margin-bottom:14px;">
            📋 ${this.t("studentRoster")}
          </h3>
          <div style="overflow-x:auto;">
            <table style="width:100%; border-collapse:collapse; text-align:left; font-size:0.9rem;">
              <thead>
                <tr style="border-bottom:2px solid var(--border); color:var(--text-light);">
                  <th style="padding:10px;">Student</th>
                  <th style="padding:10px;">Grade</th>
                  <th style="padding:10px;">Lessons Finished</th>
                  <th style="padding:10px;">Quiz Average</th>
                  <th style="padding:10px;">Streak</th>
                  <th style="padding:10px;">Status</th>
                </tr>
              </thead>
              <tbody>
                ${students.map(s => `
                  <tr style="border-bottom:1px solid var(--border);">
                    <td style="padding:12px; font-weight:700;">
                      <span style="font-size:1.2rem; margin-right:6px;">${s.avatar}</span>
                      ${s.name}
                    </td>
                    <td style="padding:12px;">${s.class}</td>
                    <td style="padding:12px;">${s.lessonsCompleted}</td>
                    <td style="padding:12px; font-weight:700; color:${s.quizAverage >= 80 ? '#059669' : '#2563eb'};">
                      ${s.quizAverage}%
                    </td>
                    <td style="padding:12px;">🔥 ${s.streakDays} Days</td>
                    <td style="padding:12px;">
                      <span class="banner-badge" style="background:#ecfdf5; color:#065f46;">Active</span>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    document.getElementById("btn-teacher-sync-now").onclick = () => {
      this.triggerFullSyncAnimation();
    };

    document.querySelectorAll(".btn-submit-ans").forEach(btn => {
      btn.onclick = () => {
        const qid = btn.getAttribute("data-qid");
        const input = document.getElementById(`input-teacher-ans-${qid}`);
        if (input && input.value.trim()) {
          this.store.answerTeacherQuestion(qid, input.value.trim());
          this.showNotification("Answer saved and queued for sync to student tablet!", "success");
          this.renderTeacherView();
        }
      };
    });
  }

  // ==========================================================================
  // VIEW 9: PARENT VIEW
  // ==========================================================================
  renderParentView() {
    const student = this.store.getActiveStudent();

    this.container.innerHTML = `
      <div class="dashboard-view" style="max-width:860px; margin:0 auto;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div>
            <h2 style="font-size:1.8rem; font-weight:850; color:var(--primary-deep);">
              👨‍👩‍👦 ${this.t("parentDashboard")}
            </h2>
            <p style="font-size:0.95rem; color:var(--text-light);">
              Simple weekly progress summary • Stored directly on this tablet
            </p>
          </div>
          <button type="button" class="btn btn-outline btn-sm" id="parent-btn-switch">
            Switch Child (${student.displayName})
          </button>
        </div>

        <!-- Weekly Summary Card -->
        <div class="card" style="padding:28px;">
          <div style="display:flex; align-items:center; gap:14px; margin-bottom:20px;">
            <span style="font-size:2.4rem;">${student.avatar}</span>
            <div>
              <h3 style="font-size:1.4rem; font-weight:800; color:var(--primary-deep);">${student.name}</h3>
              <p style="font-size:0.85rem; color:var(--text-light);">${student.class} • Weekly Learning Summary</p>
            </div>
          </div>

          <div class="dash-metrics-grid" style="margin-bottom:20px;">
            <div class="metric-card" style="background:var(--surface-alt);">
              <span class="metric-icon">⏱️</span>
              <div class="metric-value-huge">4 hrs 20m</div>
              <span style="font-size:0.85rem; color:var(--text-muted);">${this.t("learningTime")} this week</span>
            </div>
            <div class="metric-card" style="background:var(--surface-alt);">
              <span class="metric-icon">📚</span>
              <div class="metric-value-huge">${student.lessonsCompleted + 2}</div>
              <span style="font-size:0.85rem; color:var(--text-muted);">${this.t("lessonsCompleted")}</span>
            </div>
            <div class="metric-card" style="background:var(--surface-alt);">
              <span class="metric-icon">📝</span>
              <div class="metric-value-huge">${student.quizScores.length + 3}</div>
              <span style="font-size:0.85rem; color:var(--text-muted);">${this.t("quizzesCompleted")}</span>
            </div>
          </div>

          <!-- Weak Topic Alert Card -->
          <div style="background:#fffbeb; border:1px solid #fcd34d; border-radius:var(--radius-lg); padding:20px; display:flex; gap:14px; align-items:flex-start;">
            <span style="font-size:1.8rem;">💡</span>
            <div>
              <h4 style="color:#92400e; font-weight:800; font-size:1.1rem; margin-bottom:4px;">
                Focus Area: Fractions & Decimals
              </h4>
              <p style="color:#78350f; font-size:0.95rem; line-height:1.5;">
                “Your child is excelling in Science (Photosynthesis: 80%), but may need additional practice with Fractions. Review Chapter 4 math exercises together.”
              </p>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById("parent-btn-switch").onclick = () => this.openProfilesModal();
  }

  // ==========================================================================
  // SHARED DEVICE: PROFILES MODAL
  // ==========================================================================
  openProfilesModal(isPassTablet = false) {
    const modal = document.getElementById("profiles-modal");
    const container = document.getElementById("modal-profiles-list");
    if (!modal || !container) return;

    const profiles = this.store.state.profiles;
    const activeId = this.store.state.activeStudentId;

    container.innerHTML = profiles.map(p => `
      <div class="profile-card-item ${p.id === activeId ? 'active-current' : ''}" data-student-id="${p.id}">
        <span class="profile-card-avatar">${p.avatar}</span>
        <span class="profile-card-name">${p.displayName}</span>
        <span class="profile-card-class">${p.class}</span>
        ${p.id === activeId ? `<span style="font-size:0.7rem; color:#059669; font-weight:700;">Active</span>` : ''}
      </div>
    `).join("");

    container.querySelectorAll(".profile-card-item").forEach(card => {
      card.onclick = () => {
        const sid = card.getAttribute("data-student-id");
        this.store.setActiveStudent(sid);
        modal.classList.remove("open");
        const student = this.store.getActiveStudent();
        this.showNotification(`Switched to student ${student.name}! Session updated.`, "success");
        this.renderCurrentView();
      };
    });

    modal.classList.add("open");
  }

  // ==========================================================================
  // SYNC QUEUE DRAWER & SIMULATION
  // ==========================================================================
  openSyncDrawer() {
    const overlay = document.getElementById("sync-drawer-overlay");
    const container = document.getElementById("sync-items-container");
    const countEl = document.getElementById("drawer-sync-count");
    if (!overlay || !container) return;

    const queue = this.store.state.syncQueue;
    const pending = queue.filter(q => !q.synced).length;
    if (countEl) {
      countEl.textContent = pending > 0 ? `${pending} ${this.t("waitingToSync")}` : this.t("allSynced");
    }

    if (queue.length === 0) {
      container.innerHTML = `
        <p style="text-align:center; color:var(--text-light); padding:20px;">
          ${this.t("allSynced")}
        </p>
      `;
    } else {
      container.innerHTML = queue.map(item => `
        <div class="sync-item-card">
          <span class="sync-item-dot ${item.synced ? 'synced' : ''}"></span>
          <div style="flex:1;">
            <div class="sync-item-body">
              <strong>${item.studentName}:</strong> ${item.description}
            </div>
            <div class="sync-item-time">
              ${item.timestamp} • ${item.synced ? '✓ Synced' : '🔴 Queued offline'}
            </div>
          </div>
        </div>
      `).join("");
    }

    overlay.classList.add("open");
  }

  triggerFullSyncAnimation() {
    this.showNotification("🌐 Internet Connected. Synchronizing progress with school server...", "success");
    setTimeout(() => {
      this.store.syncAllProgress();
      this.showNotification("✓ All progress successfully synchronized to Teacher Dashboard!", "success");
      this.renderCurrentView();
    }, 1200);
  }

  // ==========================================================================
  // TOAST NOTIFICATIONS
  // ==========================================================================
  showNotification(msg, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = msg;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
}

// Instantiate on DOMContentLoaded
window.addEventListener("DOMContentLoaded", () => {
  window.eduApp = new EduApp();
});

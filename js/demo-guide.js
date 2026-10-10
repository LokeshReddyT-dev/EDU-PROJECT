// Hackathon 9-Step Demo Walkthrough Controller
// Directly implements Section 24 demo scenario

const DEMO_STEPS = [
  {
    step: 1,
    title: "Step 1: Online Mode & Download Pack",
    desc: "Ensure device is Online and download the 'Class 8 Science – Telugu' curriculum pack.",
    badge: "🟢 Online Ready",
    actionName: "Go to Curriculum Packs & Download",
    execute: (app) => {
      window.eduStore.setConnectionMode("online");
      window.eduStore.setView("packs");
      setTimeout(() => {
        const packCard = document.querySelector('[data-pack-id="class8-science-te"]');
        if (packCard) {
          packCard.scrollIntoView({ behavior: "smooth" });
          packCard.classList.add("highlight-pulse");
        }
      }, 300);
    }
  },
  {
    step: 2,
    title: "Step 2: Switch to Offline Mode",
    desc: "Demonstrate cutting off the internet. All learning continues locally without servers.",
    badge: "🔴 Offline Simulator",
    actionName: "Switch to Offline Mode",
    execute: (app) => {
      window.eduStore.setConnectionMode("offline");
      app.showNotification("🔴 Device is now completely Offline. Zero cloud dependencies.", "warning");
    }
  },
  {
    step: 3,
    title: "Step 3: Select Ravi's Profile",
    desc: "Pass the tablet to student Ravi on this shared rural device.",
    badge: "👦 Profile Switch",
    actionName: "Select Ravi's Profile",
    execute: (app) => {
      window.eduStore.setActiveStudent("s1"); // Ravi
      window.eduStore.setView("dashboard");
      app.showNotification("👦 Switched to student Ravi Kumar (Class 8). Session personalized.", "success");
    }
  },
  {
    step: 4,
    title: "Step 4: Offline Search 'Photosynthesis'",
    desc: "Search locally downloaded lessons for 'Photosynthesis' without internet.",
    badge: "🔎 Offline Search",
    actionName: "Run Offline Search",
    execute: (app) => {
      window.eduStore.setView("search");
      setTimeout(() => {
        const input = document.getElementById("global-search-input");
        if (input) {
          input.value = "Photosynthesis";
          input.dispatchEvent(new Event("input"));
        }
      }, 300);
    }
  },
  {
    step: 5,
    title: "Step 5: Ask EduPocket AI 'What is photosynthesis?'",
    desc: "Verified local passage retrieval with exact lesson source citation. Zero hallucination.",
    badge: "🤖 Offline AI Retrieval",
    actionName: "Ask 'What is photosynthesis?'",
    execute: (app) => {
      window.eduStore.setView("chat");
      setTimeout(() => {
        if (window.eduApp && window.eduApp.askAIChat) {
          window.eduApp.askAIChat("What is photosynthesis?");
        }
      }, 400);
    }
  },
  {
    step: 6,
    title: "Step 6: Ravi Takes Chapter Quiz (Score: 8/10)",
    desc: "Interactive offline quiz with immediate feedback and chapter section review references.",
    badge: "📝 Offline Quiz",
    actionName: "Open Photosynthesis Quiz",
    execute: (app) => {
      window.eduStore.setView("quiz", { chapterId: "c8-sci-ch3" });
    }
  },
  {
    step: 7,
    title: "Step 7: Check Local Sync Queue",
    desc: "View offline actions waiting in queue: '3 items waiting to sync'.",
    badge: "🔄 Sync Queue",
    actionName: "Open Sync Queue Drawer",
    execute: (app) => {
      app.openSyncDrawer();
    }
  },
  {
    step: 8,
    title: "Step 8: Reconnect & Auto-Sync",
    desc: "Switch back to Online Mode. The system automatically synchronizes progress with animations.",
    badge: "🟢 Auto-Sync Flow",
    actionName: "Connect & Synchronize Now",
    execute: (app) => {
      window.eduStore.setConnectionMode("online");
      app.triggerFullSyncAnimation();
    }
  },
  {
    step: 9,
    title: "Step 9: Open Teacher Dashboard",
    desc: "View class overview, Ravi's synced scores, weak topics (Photosynthesis 42%), and unanswered student questions.",
    badge: "👩‍🏫 Teacher Insights",
    actionName: "View Teacher Dashboard",
    execute: (app) => {
      window.eduStore.setView("teacher");
    }
  }
];

class DemoGuideController {
  constructor() {
    this.currentStepIndex = 0;
    this.isMinimized = false;
  }

  getCurrentStep() {
    return DEMO_STEPS[this.currentStepIndex];
  }

  next() {
    if (this.currentStepIndex < DEMO_STEPS.length - 1) {
      this.currentStepIndex++;
      this.render();
      this.executeCurrent();
    }
  }

  prev() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.render();
      this.executeCurrent();
    }
  }

  goToStep(index) {
    if (index >= 0 && index < DEMO_STEPS.length) {
      this.currentStepIndex = index;
      this.render();
      this.executeCurrent();
    }
  }

  executeCurrent() {
    const step = this.getCurrentStep();
    if (step && window.eduApp) {
      step.execute(window.eduApp);
    }
  }

  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
    this.render();
  }

  render() {
    let container = document.getElementById("demo-guide-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "demo-guide-container";
      container.className = "demo-guide-floating";
      document.body.appendChild(container);
    }

    const step = this.getCurrentStep();
    const total = DEMO_STEPS.length;
    const currentNum = this.currentStepIndex + 1;

    if (this.isMinimized) {
      container.innerHTML = `
        <button class="demo-minimized-btn" id="demo-guide-expand-btn" title="Expand Hackathon Demo Walkthrough">
          <span class="demo-icon">🚀</span>
          <span class="demo-pill-text">Demo Guide (${currentNum}/${total})</span>
          <span class="demo-arrow">▲</span>
        </button>
      `;
      document.getElementById("demo-guide-expand-btn").onclick = () => this.toggleMinimize();
      return;
    }

    container.innerHTML = `
      <div class="demo-guide-card">
        <div class="demo-guide-header">
          <div class="demo-header-left">
            <span class="demo-badge-pill">${step.badge}</span>
            <span class="demo-step-counter">Step ${currentNum} of ${total}</span>
          </div>
          <div class="demo-header-actions">
            <button class="demo-icon-btn" id="demo-guide-minimize-btn" title="Minimize">▼</button>
          </div>
        </div>
        <div class="demo-guide-body">
          <h4 class="demo-step-title">${step.title}</h4>
          <p class="demo-step-desc">${step.desc}</p>
        </div>
        <div class="demo-guide-footer">
          <div class="demo-nav-btns">
            <button class="btn btn-sm btn-outline" id="demo-prev-btn" ${this.currentStepIndex === 0 ? "disabled" : ""}>
              ← Prev
            </button>
            <button class="btn btn-sm btn-primary" id="demo-action-btn">
              ▶ Run: ${step.actionName}
            </button>
            <button class="btn btn-sm btn-outline" id="demo-next-btn" ${this.currentStepIndex === total - 1 ? "disabled" : ""}>
              Next →
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById("demo-guide-minimize-btn").onclick = () => this.toggleMinimize();
    document.getElementById("demo-action-btn").onclick = () => this.executeCurrent();
    const prevBtn = document.getElementById("demo-prev-btn");
    if (prevBtn) prevBtn.onclick = () => this.prev();
    const nextBtn = document.getElementById("demo-next-btn");
    if (nextBtn) nextBtn.onclick = () => this.next();
  }
}

window.demoGuide = new DemoGuideController();

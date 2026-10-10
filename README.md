# 🎒 EduPocket – The Internet-Free AI Classroom

> **Learn Anywhere. Even Without Internet.**  
> An offline-first educational Progressive Web Application (PWA) designed for students and teachers in low-connectivity and rural environments.

![EduPocket Hero Mockup](assets/images/hero-illustration.jpg)

---

## 📌 Problem Statement

Students in rural and low-connectivity communities frequently face disruptions in digital learning:
- **No access to online tutors** when studying after school hours.
- **Videos fail to load** and buffer endlessly over weak 2G/3G mobile networks.
- **Cloud-based AI assistants (ChatGPT, Gemini) go dark** when offline.
- **Learning streaks and confidence drop** due to unpredictable internet access.

EduPocket solves this by delivering a lightweight learning assistant that operates **completely without continuous internet access**.

---

## 🌟 Key Features

### 1. 100% Offline-First Architecture (PWA)
- Full service worker caching (`sw.js`) and Web App Manifest (`manifest.json`).
- Download curriculum packs when connectivity is available, then learn, search, and quiz completely offline.
- Stored locally using IndexedDB / LocalStorage. Zero network calls required during offline study sessions.

### 2. Retrieval-First AI: *“AI that knows when it doesn't know”*
- **Strict Grounding**: Uses local TF-IDF & keyword semantic retrieval over locally downloaded curriculum chunks.
- **Verified Citations**: Displays exact source citations:  
  `Source: Class 8 Science → Chapter 3: Photosynthesis in Plants (Section 1: What is Photosynthesis?)`
- **Zero Hallucination Guarantee**: When students ask questions outside downloaded curriculum (e.g., *"Why does the sky appear blue?"*), EduPocket safely responds:
  > *“I couldn't find this answer in your downloaded curriculum.”*
- **Add to Ask Teacher List**: One-click saving of unanswered questions to the Teacher's Inbox for offline classroom review.

### 3. Shared Device Management (*“Who's Learning Today?”*)
- Designed for rural schools and families sharing a single tablet:
  - 👦 **Ravi Kumar** (Class 8, Telugu/English)
  - 👩 **Anjali Devi** (Class 8, Telugu)
  - 👧 **Sita Sharma** (Class 7, English)
  - 👦 **Arjun Singh** (Class 6, Hindi)
- **Pass the Tablet**: Instantly lock session and switch learners without mixing streaks, notes, quiz scores, or sync queues.
- Simple 4-digit PIN authentication.

### 4. Interactive Offline Quizzes & Gamification
- Practice quizzes with immediate tactile feedback, correct answer reveals, and direct chapter review links.
- Offline achievement badges:
  - 🏆 First Quiz
  - 🔥 3-Day Learning Streak
  - 📚 5 Lessons Completed
  - ⭐ Quiz Master
  - 🔍 Curious Learner

### 5. Smart Sync & Connection Simulator
- Real-time **Online 🟢 / Offline 🔴 Simulator Toggle** on the top banner for instant testing and hackathon demonstrations.
- Offline actions accumulate in the **Sync Queue** (e.g., *"Ravi completed Science Quiz (Score: 8/10)"*).
- When internet returns: Triggers automated synchronization (`"Internet Connected ✓"` ➔ `"Synchronizing..."` ➔ `"✓ All progress synchronized"`).

### 6. Storage-Aware Curriculum Packs
- Real-time Device Storage Manager (*Used: 68 MB / Available: 132 MB*).
- Support for **Lite Packs** (Text + Diagrams) and **Full Packs** (Text + Diagrams + Audio) for budget devices.

### 7. Teacher & Parent Dashboards
- **Teacher Dashboard**: Class average quiz scores (76%), student attendance (24 active), weak topic detection (*Photosynthesis 42%*, *Fractions 48%*), most asked student questions, and inbox for offline student queries.
- **Parent View**: Weekly learning summary, study hours (4h 20m), and targeted practice advice.

---

## 🚀 Hackathon 9-Step Demo Walkthrough

1. **Step 1 (Online Mode)**: Ensure Online Mode 🟢 and inspect the Curriculum Packs manager.
2. **Step 2 (Cut Connection)**: Switch to Offline Mode 🔴 via the top banner simulator.
3. **Step 3 (Select Student)**: Open *"Who's Learning Today?"* and select student **Ravi**.
4. **Step 4 (Offline Search)**: Search for *"Photosynthesis"* or *"కిరణజన్య సంయోగక్రియ"*.
5. **Step 5 (Ask EduPocket AI)**: Ask *"What is photosynthesis?"* to verify cited answer, then test un-downloaded *"Why is the sky blue?"* to verify zero hallucination.
6. **Step 6 (Take Quiz)**: Complete the Photosynthesis Quiz (Score: 8/10) with immediate feedback.
7. **Step 7 (Inspect Sync Queue)**: Open the Sync Queue Drawer to see offline items queued locally.
8. **Step 8 (Auto-Sync)**: Switch simulator to Online Mode 🟢 and watch automatic progress synchronization.
9. **Step 9 (Teacher Insights)**: Open Teacher Mode to see Ravi's updated score and student queries.

---

## 🛠️ Technology Stack

- **Core**: Vanilla HTML5, CSS3, Modern JavaScript (ES6+)
- **Offline Storage**: IndexedDB & LocalStorage
- **Service Worker**: Cache-first asset caching & offline fallback
- **PWA**: Web App Manifest, mobile-first responsive layout
- **Languages Supported**: English, Telugu (తెలుగు), Hindi (हिंदी)

---

## 💻 How to Run Locally

1. Clone this repository:
   ```bash
   git clone https://github.com/LokeshReddyT-dev/EDU-PROJECT.git
   cd EDU-PROJECT
   ```

2. Start a local HTTP server:
   ```bash
   # Using Python
   python -m http.server 8080

   # Or using Node.js
   npx serve .
   ```

3. Open your browser at:
   ```
   http://localhost:8080
   ```

---

## 📄 License

MIT License. Designed with care for accessible education worldwide.

# ⚡ Weekend 90: 20 LPA Sprint Productivity Engine

> **A high-leverage weekend productivity cockpit designed for mid-level engineers (e.g. ADP Member Technical) targeting 20+ LPA Staff Backend & Applied AI roles without burnout.**

[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-purple?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🎯 The Philosophy

Transitioning from an enterprise maintenance role (~7.5 LPA) to a high-comp Staff/Senior Backend & Applied AI Engineer (20–25+ LPA) doesn't require 14-hour daily grinds. It requires **intentional, high-retention weekend interval sprints**:

1. **Monday – Friday:** Excel at your day job (e.g. ADP) + adhere to the **10-Minute No-AI Debugging Rule** before reaching for AI autocompletions.
2. **Saturday Morning (90 Mins):** Raw DSA coding muscle & backend fundamentals written entirely from memory with AI assistance turned off.
3. **Sunday Morning (90 Mins):** High-Level System Design (HLD), distributed architectures, and Applied AI / RAG implementations.
4. **Friday Afternoon:** Convert your weekday ships and bug fixes into quantifiable **Google XYZ-format** resume bullets inside the ADP Impact Studio.

---

## ✨ Key Features

### 🛡️ 1. Morning Dopamine Shield
- Guards deep work by gating the sprint station until distractions (social media feeds, smartphones) are cleared.
- Unlocks Block 1 with tactile audio feedback and visual focus state.

### ⏱️ 2. 90-Minute Focus Cockpit (Zero-Lag Persistent Timer)
- **Sequential Flow:** `Shield` ➔ `Block 1 (45m)` ➔ `Breather (5m)` ➔ `Block 2 (45m)` ➔ `Victory Journal`.
- **Persistent Tab Continuity:** Navigating between the Focus Studio, 20 LPA Roadmap, and ADP Studio never interrupts your timer—it keeps ticking in the background with a live countdown readout in the cockpit header.
- **Strict No-AI Callouts:** Prompts highlighting specific algorithmic loops or syntax to write from pure recall.
- **Interactive Execution Breakdown:** Step-by-step checklists that persist progress directly to `localStorage`.
- **Pattern Code References:** Formatted starter templates and reference patterns with one-click clipboard copying.

### 🎧 3. Built-in Web Audio Focus Synthesizer
- 100% offline procedural audio synthesizer running on the native Web Audio API (zero audio file downloads):
  - **🌧️ Rain / Brown Noise:** Filtered acoustic white/brown noise for ambient masking.
  - **🧠 40Hz Gamma Binaural Beats:** Dual-ear frequency synthesizer engineered for high-retention cognitive states.
  - **📻 Pink Noise:** Gentle balanced frequency curve for continuous deep coding.

### 📈 4. The 18-Month 20 LPA Salary Ladder & Curriculum
- Comprehensive 16-week structured milestone path across 3 core phases:
  - **Phase 1 (Weeks 1–6):** *Code Muscle & Backend Fluency* (Two Pointers, Async FastAPI, Indexing, Concurrency).
  - **Phase 2 (Weeks 7–12):** *Distributed Systems & RAG* (Redis Lua locks, Kafka partitioning, Hybrid Vector Search).
  - **Phase 3 (Weeks 13–16):** *20 LPA Bar-Raiser Clearance* (Multi-Agent handoffs, SSRF defense, RCA command).
- Interactive salary expectations, target interview formats, and week progress indicators.

### 💼 5. ADP Friday Impact Studio & Google XYZ Synthesizer
- Transforms routine enterprise tasks into senior-level resume talking points using Google's formula:  
  $$\text{Accomplished [X] as measured by [Y], by doing [Z]}$$
- Real-time live bullet generation preview.
- **Bulk Markdown Export:** "Copy All Bullets" button exports formatted Markdown ready for Word, Google Docs, or LaTeX/Overleaf.

### 🎨 6. Dual Cyberpunk Dark & Crisp Light Mode
- **Dark Mode:** Deep cyber cockpit (`#05060A`) with glowing neon cyan, flame orange, and emerald accents.
- **Light Mode:** High-contrast slate/white surfaces with crisp typography and accessible color palettes.
- Toggle between a constrained **Mobile Shell (430px)** and **Full-Screen Desktop Canvas** with one click.

### ⌨️ 7. Keyboard Ergonomics & Offline Persistence
- <kbd>Space</kbd>: Start or pause the active sprint timer (guarded against active text inputs).
- <kbd>Esc</kbd>: Instantly dismiss modals.
- **100% Offline-First:** All streak records, custom tasks, checked sub-steps, reflections, and resume bullets are persisted locally in `localStorage`.

---

## 🛠️ Tech Stack

- **Framework:** [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite 6](https://vitejs.dev/)
- **Styling:** [Tailwind CSS 3.4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Audio:** Web Audio API (native procedural synthesis)
- **Effects:** [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0 or higher)
- npm or pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sathya200401/Productivity-Engine.git
   cd Productivity-Engine
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```
   Outputs pre-compiled static assets to the `build/` directory.

5. **Preview production build locally:**
   ```bash
   node serve.js
   ```

---

## 🌐 Deployment

### Deploy to Netlify
The repository includes a ready-to-use [`netlify.toml`](./netlify.toml):

1. Push your changes to GitHub.
2. Log in to [Netlify](https://app.netlify.com/) and click **Add new site** ➔ **Import an existing project**.
3. Select this repository (`Productivity-Engine`).
4. Netlify will automatically detect `netlify.toml` with:
   - **Build command:** `npm run build`
   - **Publish directory:** `build`
5. Click **Deploy Site**.

### Deploy to Vercel
The repository also includes [`vercel.json`](./vercel.json) for instant SPA routing:

1. Import the repository in [Vercel](https://vercel.com/).
2. Set **Output Directory** to `build`.
3. Click **Deploy**.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).

# 🎯 AlgoQuest

> **Premium Interactive Algorithm Visualization Platform**

AlgoQuest is a cutting-edge, gamified web application designed to revolutionize how students and developers master algorithms and data structures. Built with a high-performance stack, it offers stunning visualizations, real-time code generation in multiple languages, and immersive learning experiences for complex LeetCode-style problems.

![AlgoQuest Status](https://img.shields.io/badge/Status-Live-brightgreen) ![License](https://img.shields.io/badge/License-MIT-blue) ![React](https://img.shields.io/badge/React-18.3.1-61dafb) ![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-3.4.1-38bdf8)

---

## ✨ Features

### 🧩 **Algorithm Library (16+ Modules)**

#### **Classic & Backtracking**
- **N-Queens Visualizer**: 3D interactive chessboard with realistic shadows, backtracking exploration, and a full solution gallery.
- **Word Ladder**: BFS-based word transformation explorer with a curated built-in dictionary and clean ladder output.

#### **Dynamic Programming (DP)**
- **LCS (Longest Common Subsequence)**: 2D table visualization with path reconstruction and multi-string support.
- **Coin Change**: Visualizing the decision tree and DP table for finding the minimum number of coins.
- **LIS (Longest Increasing Subsequence)**: Bar chart visualization with both O(n²) DP and O(n log n) Patience Sorting approaches.
- **Super Egg Drop**: Interactive DP table showing the optimal floor strategy for egg breaking.
- **0/1 Knapsack**: Item selection visualization with a DP heatmap and backtracking for optimal combinations.
- **Edit Distance (Levenshtein)**: Step-by-step matrix filling for string transformations (Insert/Delete/Replace).

#### **Graph & Pathfinding**
- **Dijkstra's Algorithm**: Weighted graph shortest path explorer with priority queue processing and edge relaxation animations.
- **Course Schedule (Topological Sort)**: Cycle detection and dependency resolution visualization using Kahn's algorithm.
- **Rotting Oranges**: BFS-based multisource infection simulation on a grid with time-step animations.

#### **Data Structures**
- **Trie (Prefix Tree)**: Dynamic tree visualization with word insertion, search, and real-time auto-completion engine.

#### **Arrays & Two Pointers**
- **Trapping Rain Water**: 2D elevation map visualization showing how water accumulates between bars.
- **Sliding Window Maximum**: Dynamic window movement over an array with monotonic queue tracking.
- **Merge Intervals**: Visualizing the overlap and merging process of time intervals.
- **Kth Largest Element (QuickSelect)**: Partitioning visualization showing the O(n) average-time selection process.

### 🎨 **Elite User Experience**
- **Dark/Light Mode Support**: Professional, glassmorphic themes optimized for deep work and high visibility.
- **Multi-language Code Generation**: Instant conversion of algorithm logic into clean **C++, Python, JavaScript, Java, and C#**.
- **Interactive Controls**: Play, pause, step-forward, and speed adjustment for every visualization.
- **Responsive Architecture**: Seamlessly fluid design from ultra-wide monitors to mobile devices.
- **Dynamic Dashboard**: Real-time stats and interactive cards for quick navigation.
- **Guided Learning Path**: XP, streaks, and unlocks to structure your practice.
- **Glossary**: Quick definitions for algorithms, data structures, and techniques.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0.0+)
- **npm** (v8.0.0+)

### Installation
1. **Clone the Repository**
   ```bash
   git clone https://github.com/hariteja-01/AlgoQuest.git
   cd AlgoQuest
   ```
2. **Install Dependencies**
   ```bash
   npm install
   ```
3. **Start Development**
   ```bash
   npm run dev
   ```
   Navigate to [http://localhost:5173](http://localhost:5173)

### Optional: Supabase Setup (Profiles + Feedback)
1. Copy .env.example to .env and add your Supabase keys.
2. Apply migrations in supabase/migrations using the Supabase CLI.

---

## 🏗️ Project Architecture

```
AlgoQuest/
├── 📁 public/                    # Optimized assets (AVIF/SVG)
├── 📁 src/
│   ├── 📁 components/           # Reusable UI & Visual Components
│   ├── 📁 context/              # Global State (Theme, Language)
│   ├── 📁 logic/                # Core Algorithm Engines & Codegen
│   │   ├── 📁 dijkstra/         # Graph logic
│   │   ├── 📁 knapsack/         # DP logic
│   │   ├── 📁 wordladder/       # BFS logic
│   │   └── ...                  # 16+ Algorithm engines
│   ├── 📁 pages/                # Main Application Views
│   ├── 🎯 App.tsx               # Router & Core Layout
│   └── 🎨 index.css             # Tailwind & Global Styles
├── 📁 supabase/                 # Supabase migrations
├── 📋 package.json              # Project Metadata
├── ⚙️ vite.config.ts           # Build System
└── 🎨 tailwind.config.js       # Design System
```

---

## 🛠️ Technology Stack

- **Frontend**: React 18 (Hooks, Context, Concurrent Mode)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS (JIT, Custom Tokens)
- **Animations**: Framer Motion (Orchestration, Layout Animations)
- **3D Graphics**: Three.js (WebGL, R3F Patterns)
- **Charts**: Recharts (Customized SVG components)
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Hari Teja Patnala**
- 🌐 GitHub: [@hariteja-01](https://github.com/hariteja-01)
- 💼 LinkedIn: [Connect](https://linkedin.com/in/hari-teja-patnala)
- 🌍 Portfolio: [Experience the Magic](https://app--hari-teja-patnala-portfolio-b08b17e9.base44.app/)

---

<div align="center">

**Made with ❤️ for the Developer Community**

[🌟 Star this repo](https://github.com/hariteja-01/AlgoQuest) • [🐛 Report Bug](https://github.com/hariteja-01/AlgoQuest/issues)

</div>

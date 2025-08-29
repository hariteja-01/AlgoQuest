# 🎯 AlgoQuest

> **Interactive Algorithm Visualization Platform**

AlgoQuest is a cutting-edge, interactive web application designed to revolutionize how students and developers learn algorithms and data structures. Built with modern web technologies, it offers stunning 3D visualizations, real-time code generation, and immersive learning experiences for fundamental computer science concepts.

![AlgoQuest Demo](https://img.shields.io/badge/Status-Live-brightgreen) ![License](https://img.shields.io/badge/License-MIT-blue) ![React](https://img.shields.io/badge/React-18.3.1-61dafb) ![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue)

---

## ✨ Features

### 🏰 **N-Queens Visualizer**
- **3D Interactive Chessboard**: Stunning 3D chess pieces with realistic shadows and lighting
- **Backtracking Algorithm Visualization**: Watch the algorithm explore and backtrack in real-time
- **Solution Gallery**: Browse through all possible solutions for different board sizes
- **Attack Pattern Visualization**: See queen attack patterns with animated highlights
- **Performance Analytics**: Real-time statistics on algorithm performance
- **Multi-size Support**: From 4×4 to 12×12 boards with optimized rendering

### 📊 **LCS (Longest Common Subsequence) Visualizer**
- **2D-4D Visualization Support**: From simple 2-string to complex multi-string comparisons
- **Dynamic Programming Table**: Interactive DP table with step-by-step execution
- **Path Reconstruction**: Visual backtracking to show the actual LCS
- **Space Optimization Views**: Compare space-optimized vs. standard implementations
- **Multi-String LCS**: Advanced visualizations for 3+ string comparisons
- **Algorithm Comparison**: Side-by-side performance comparisons

### 🌳 **Trie Data Structure Visualizer**
- **Interactive Tree Visualization**: Dynamic tree structure with smooth animations
- **Word Insertion/Search**: Real-time word operations with visual feedback
- **Auto-completion Engine**: Live suggestions as you type
- **Memory Analysis**: Visual representation of memory usage and optimization
- **Bulk Import/Export**: Load word lists and export trie structures
- **Performance Metrics**: Detailed analytics on search and insertion times

### 🎨 **User Experience Features**
- **Dark/Light Theme Support**: Professional themes optimized for extended use
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile
- **Multi-language Code Generation**: Real-time code in C++, Python, and JavaScript
- **Interactive Controls**: Intuitive UI with smooth animations and feedback
- **Educational Tooltips**: Contextual help and algorithm explanations
- **Export/Share Functionality**: Save configurations and share with others

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (v8.0.0 or higher) - Comes with Node.js
- **Git** - [Download here](https://git-scm.com/)

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

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   Navigate to [http://localhost:5173](http://localhost:5173) to start exploring!

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🏗️ Project Architecture

```
AlgoQuest/
├── 📁 public/                    # Static assets
│   ├── 🖼️ LOGO2.avif           # Main logo (AVIF format)
│   ├── 🖼️ icon.png             # Fallback icon
│   └── 🖼️ favicon-enhanced.svg  # Enhanced favicon
├── 📁 src/
│   ├── 📁 components/           # Reusable UI Components
│   │   ├── 🎯 AlgoQuestIcon.tsx # Animated logo component
│   │   ├── 🏰 ChessSquare.tsx   # N-Queens chess pieces
│   │   ├── 📊 DPTableVisualizer.tsx # LCS table visualization
│   │   ├── 🌳 TrieVisualizer.tsx # Trie structure display
│   │   ├── 🎨 ThemeToggle.tsx   # Dark/light mode toggle
│   │   ├── 📱 NavLayout.tsx     # Navigation layout
│   │   ├── 📱 SidebarLayout.tsx # Sidebar navigation
│   │   └── ✨ DynamicBackground.tsx # Animated backgrounds
│   ├── 📁 context/              # React Context Providers
│   │   └── 🌐 AppContext.tsx    # Global app state
│   ├── 📁 hooks/                # Custom React Hooks
│   │   └── 🎨 useTheme.ts       # Theme management
│   ├── 📁 lib/                  # Utility Functions
│   │   └── 🛠️ utils.ts          # Helper functions
│   ├── 📁 logic/                # Algorithm Implementations
│   │   ├── 📁 nqueens/          # N-Queens algorithm
│   │   │   ├── 🧠 engine.ts     # Core algorithm logic
│   │   │   └── 💻 codegen.ts    # Code generation
│   │   ├── 📁 lcs/              # LCS algorithm
│   │   │   ├── 🧠 engine.ts     # DP implementation
│   │   │   └── 💻 codegen.ts    # Multi-language code gen
│   │   └── 📁 trie/             # Trie data structure
│   │       ├── 🧠 engine.ts     # Trie operations
│   │       └── 💻 codegen.ts    # Code generation
│   ├── 📁 pages/                # Main Application Pages
│   │   ├── 🏠 Home.tsx          # Landing page
│   │   ├── 🏰 NQueens.tsx       # N-Queens visualizer
│   │   ├── 📊 LCS.tsx           # LCS visualizer
│   │   └── 🌳 Trie.tsx          # Trie visualizer
│   ├── 🎯 App.tsx               # Root application component
│   ├── 🚀 main.tsx              # Application entry point
│   ├── 🎨 index.css             # Global styles
│   └── 📝 types.ts              # TypeScript definitions
├── 📋 package.json              # Dependencies and scripts
├── ⚙️ vite.config.ts           # Vite configuration
├── 🎨 tailwind.config.js       # Tailwind CSS config
├── 📝 tsconfig.json            # TypeScript configuration
└── 📖 README.md                # Project documentation
```

---

## 🛠️ Technology Stack

### **Frontend Framework**
- **React 18.3.1** - Modern component-based UI library
- **TypeScript 5.5.3** - Type-safe JavaScript development
- **Vite 5.4.2** - Lightning-fast build tool and dev server

### **Styling & UI**
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Framer Motion 12.23.12** - Production-ready motion library
- **Lucide React 0.344.0** - Beautiful, customizable icons

### **Visualization & 3D**
- **Three.js 0.179.1** - 3D graphics and WebGL rendering
- **Recharts 3.1.2** - Composable charting library
- **Custom Canvas Animations** - Hand-crafted visualizations

### **Development Tools**
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing and optimization
- **React Hot Toast** - Elegant notifications
- **React Router DOM** - Client-side routing

### **Code Generation**
- **React Syntax Highlighter** - Beautiful syntax highlighting
- **Multi-language Support** - C++, Python, JavaScript generation
- **Real-time Compilation** - Live code updates

---

## 🎮 Usage Guide

### **N-Queens Solver**
1. **Select Board Size**: Choose from 4×4 to 12×12
2. **Place Queens**: Click squares or use auto-solve
3. **Watch Algorithm**: See backtracking in real-time
4. **Explore Solutions**: Browse all possible solutions
5. **View Code**: See implementation in your preferred language

### **LCS Visualizer**
1. **Input Strings**: Enter 2-4 strings for comparison
2. **Step Through**: Watch DP table fill step by step
3. **See Path**: Visual reconstruction of the LCS
4. **Compare Algorithms**: View different optimization approaches
5. **Export Results**: Save configurations and results

### **Trie Explorer**
1. **Build Trie**: Insert words one by one or bulk import
2. **Search Words**: Real-time search with visual feedback
3. **Auto-complete**: Type for instant suggestions
4. **Analyze Memory**: See memory usage patterns
5. **Export Structure**: Save trie for later use

---

## 🎯 Educational Value

### **Learning Objectives**
- **Algorithm Understanding**: Deep comprehension of classic algorithms
- **Complexity Analysis**: Time and space complexity visualization
- **Problem-Solving Skills**: Step-by-step problem decomposition
- **Code Implementation**: Real-world coding practices
- **Performance Optimization**: Understanding trade-offs and optimizations

### **Target Audience**
- **Computer Science Students** - Interactive learning for coursework
- **Coding Interview Preparation** - Practice with common algorithm questions
- **Educators & Teachers** - Visual teaching aids for complex concepts
- **Professional Developers** - Refresh knowledge and explore optimizations
- **Algorithm Enthusiasts** - Deep dive into algorithmic thinking

---

## 🚀 Deployment

### **Local Development**
```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run preview # Preview production build
npm run lint    # Run code linting
```

### **Production Deployment**
The application is optimized for deployment on:
- **Vercel** (Recommended)
- **Netlify**
- **GitHub Pages**
- **Any static hosting service**

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### **Getting Started**
1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/YOUR_USERNAME/AlgoQuest.git`
3. **Create** a branch: `git checkout -b feature/amazing-feature`
4. **Install** dependencies: `npm install`

### **Development Guidelines**
- Follow **TypeScript** best practices
- Use **Tailwind CSS** for styling
- Write **comprehensive tests** for new features
- Ensure **responsive design** across devices
- Add **proper documentation** for new components

### **Contribution Areas**
- 🐛 **Bug Fixes** - Help us squash bugs
- ✨ **New Features** - Add new algorithms or visualizations
- 📚 **Documentation** - Improve guides and comments
- 🎨 **UI/UX** - Enhance user experience
- ⚡ **Performance** - Optimize animations and rendering
- 🧪 **Testing** - Add unit and integration tests

### **Submitting Changes**
1. **Commit** your changes: `git commit -m 'Add amazing feature'`
2. **Push** to branch: `git push origin feature/amazing-feature`
3. **Open** a Pull Request with detailed description

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License - AlgoQuest
Copyright (c) 2025 Hari Teja Patnala

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software.
```

---

## 👨‍💻 Author

**Hari Teja Patnala**
- 🌐 GitHub: [@hariteja-01](https://github.com/hariteja-01)
- 💼 LinkedIn: [Connect with me](https://linkedin.com/in/hariteja-patnala)
- 📧 Email: [Contact](mailto:hariteja.patnala@example.com)
- 🌍 Portfolio: [Visit my portfolio](https://hariteja-portfolio.dev)

---

## 🙏 Acknowledgments

- **Algorithm Visualization Community** - Inspiration and best practices
- **React & TypeScript Teams** - Amazing development experience
- **Three.js Community** - 3D graphics capabilities
- **Open Source Contributors** - All the amazing libraries used
- **Educational Institutions** - Feedback and testing

---

## 📊 Project Stats

![GitHub repo size](https://img.shields.io/github/repo-size/hariteja-01/AlgoQuest)
![GitHub contributors](https://img.shields.io/github/contributors/hariteja-01/AlgoQuest)
![GitHub last commit](https://img.shields.io/github/last-commit/hariteja-01/AlgoQuest)
![GitHub issues](https://img.shields.io/github/issues/hariteja-01/AlgoQuest)
![GitHub pull requests](https://img.shields.io/github/issues-pr/hariteja-01/AlgoQuest)

---

## 🔮 Future Roadmap

### **Upcoming Features**
- 🌐 **Graph Algorithms** - Dijkstra, BFS, DFS visualizations
- 🔢 **Sorting Algorithms** - Interactive sorting comparisons
- 🌊 **Dynamic Programming** - More complex DP problems
- 🤖 **Machine Learning** - Basic ML algorithm visualizations
- 🎯 **Pathfinding** - A* and other pathfinding algorithms
- 👥 **Multiplayer Mode** - Collaborative problem solving
- 📱 **Mobile App** - Native iOS and Android applications
- 🌍 **Internationalization** - Multi-language support

### **Technical Improvements**
- ⚡ **WebAssembly** integration for performance-critical algorithms
- 🎮 **WebGL** optimizations for better 3D rendering
- 📊 **Advanced Analytics** - Learning progress tracking
- 🔄 **Real-time Collaboration** - Live sharing and editing
- 🎨 **Custom Themes** - User-created theme support

---

## 💡 Support

If you find AlgoQuest helpful, please consider:

⭐ **Starring** the repository
🐛 **Reporting** bugs and issues
💡 **Suggesting** new features
📢 **Sharing** with fellow developers
☕ **Supporting** the project

---

<div align="center">

**Made with ❤️ by [Hari Teja Patnala](https://github.com/hariteja-01)**

*Empowering learning through interactive visualization*

[🌟 Star this repo](https://github.com/hariteja-01/AlgoQuest) • [🐛 Report Bug](https://github.com/hariteja-01/AlgoQuest/issues) • [✨ Request Feature](https://github.com/hariteja-01/AlgoQuest/issues)

</div>

# AlgoQuest

AlgoQuest is a modern, interactive web application for visualizing and learning classic algorithms and data structures. It features beautiful, animated visualizations for Trie, N-Queens, Longest Common Subsequence (LCS), and more, with a focus on user experience, code clarity, and educational value.

---

## ✨ Features

- **Trie Visualizer**: Insert, search, and autocomplete words with animated Trie structure.
- **N-Queens Visualizer**: Place queens, maximize/minimize the board, and explore solutions interactively.
- **LCS Visualizer**: Step through the dynamic programming table and see code side-by-side.
- **Responsive UI**: Works on desktop and mobile, with dark/light theme support.
- **Code Display**: View the code for each algorithm in your chosen language.
- **Sample Data**: Quickly load sample words or board states.
- **Export/Import**: Save and load your data for continued exploration.

---

## 🚀 Getting Started

### 1. Clone the Repository

```
git clone https://github.com/hariteja-01/AlgoQuest.git
cd AlgoQuest
```

### 2. Install Dependencies

Make sure you have [Node.js](https://nodejs.org/) (v16+) and [npm](https://www.npmjs.com/) installed.

```
npm install
```

### 3. Launch the App Locally

```
npm run dev
```

This will start the Vite development server. Open [http://localhost:5173](http://localhost:5173) in your browser to use AlgoQuest.

---

## 🗂️ Project Structure

```
project/
├── src/
│   ├── components/      # Reusable UI components
│   ├── context/         # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── logic/           # Algorithm engines and code generators
│   ├── pages/           # Main visualizer pages (Trie, NQueens, LCS, Home)
│   ├── App.tsx          # App root
│   └── ...
├── public/              # Static assets
├── index.html           # Main HTML file
├── package.json         # Project metadata and scripts
├── tailwind.config.js   # Tailwind CSS config
├── vite.config.ts       # Vite config
└── ...
```

---

## 🛠️ Technologies Used

- **React** (TypeScript)
- **Vite** (build tool)
- **Tailwind CSS** (styling)
- **Framer Motion** (animations)
- **Lucide React** (icons)

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Commit and push (`git commit -m 'Add feature' && git push origin feature/your-feature`)
5. Open a Pull Request on GitHub

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🙋‍♂️ Contact

Created by [Hari Teja Patnala](https://github.com/hariteja-01). For questions, suggestions, or feedback, please open an issue or contact via GitHub.

---

## 💡 Special Notes

- For best experience, use the latest version of Chrome, Firefox, or Edge.
- If you encounter any issues, please check the Issues tab or open a new one.
- This project is for educational and demonstration purposes.

---

Enjoy exploring algorithms visually with **AlgoQuest**! 🚀

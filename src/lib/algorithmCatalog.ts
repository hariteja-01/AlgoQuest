import type { LucideIcon } from 'lucide-react';
import {
  Bug,
  Coins,
  Crown,
  Droplets,
  Egg,
  FileText,
  GitMerge,
  GraduationCap,
  Navigation,
  Package,
  PenTool,
  Route,
  SlidersHorizontal,
  Target,
  TrendingUp,
  TreePine,
} from 'lucide-react';

export type AlgorithmCategoryId =
  | 'graphs'
  | 'dynamic-programming'
  | 'arrays-intervals'
  | 'trees'
  | 'backtracking'
  | 'selection-heaps';

export type AlgorithmStatus = 'Active' | 'Learning' | 'Mastered';

export interface LeetCodeProblem {
  title: string;
  url: string;
  difficulty: 'Hard';
}

export interface AlgorithmCategory {
  id: AlgorithmCategoryId;
  label: string;
  description: string;
  leetcodeHard: LeetCodeProblem[];
}

export interface AlgorithmDashboardMeta {
  status: AlgorithmStatus;
  progress: number;
}

export interface AlgorithmMeta {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  path: string;
  color: string;
  icon: LucideIcon;
  category: AlgorithmCategoryId;
  highlights: string[];
  tagline: string;
  complexity: string;
  dashboard?: AlgorithmDashboardMeta;
}

export const algorithmCategories: AlgorithmCategory[] = [
  {
    id: 'graphs',
    label: 'Graphs',
    description: 'BFS, DFS, shortest paths, and topological ordering.',
    leetcodeHard: [
      { title: 'Alien Dictionary', url: 'https://leetcode.com/problems/alien-dictionary/', difficulty: 'Hard' },
      { title: 'Swim in Rising Water', url: 'https://leetcode.com/problems/swim-in-rising-water/', difficulty: 'Hard' },
      { title: 'Critical Connections in a Network', url: 'https://leetcode.com/problems/critical-connections-in-a-network/', difficulty: 'Hard' },
    ],
  },
  {
    id: 'dynamic-programming',
    label: 'Dynamic Programming',
    description: 'Optimal substructure, tabulation, and memoization.',
    leetcodeHard: [
      { title: 'Burst Balloons', url: 'https://leetcode.com/problems/burst-balloons/', difficulty: 'Hard' },
      { title: 'Regular Expression Matching', url: 'https://leetcode.com/problems/regular-expression-matching/', difficulty: 'Hard' },
      { title: 'Distinct Subsequences', url: 'https://leetcode.com/problems/distinct-subsequences/', difficulty: 'Hard' },
    ],
  },
  {
    id: 'arrays-intervals',
    label: 'Arrays & Intervals',
    description: 'Sliding windows, merging, and stack-based scans.',
    leetcodeHard: [
      { title: 'Trapping Rain Water', url: 'https://leetcode.com/problems/trapping-rain-water/', difficulty: 'Hard' },
      { title: 'Sliding Window Maximum', url: 'https://leetcode.com/problems/sliding-window-maximum/', difficulty: 'Hard' },
      { title: 'Largest Rectangle in Histogram', url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/', difficulty: 'Hard' },
    ],
  },
  {
    id: 'trees',
    label: 'Trees & Tries',
    description: 'Prefix structures, hierarchical search, and traversal.',
    leetcodeHard: [
      { title: 'Word Search II', url: 'https://leetcode.com/problems/word-search-ii/', difficulty: 'Hard' },
      { title: 'Palindrome Pairs', url: 'https://leetcode.com/problems/palindrome-pairs/', difficulty: 'Hard' },
      { title: 'Concatenated Words', url: 'https://leetcode.com/problems/concatenated-words/', difficulty: 'Hard' },
    ],
  },
  {
    id: 'backtracking',
    label: 'Backtracking',
    description: 'Search with pruning and constraint checks.',
    leetcodeHard: [
      { title: 'N-Queens', url: 'https://leetcode.com/problems/n-queens/', difficulty: 'Hard' },
      { title: 'Sudoku Solver', url: 'https://leetcode.com/problems/sudoku-solver/', difficulty: 'Hard' },
      { title: 'Expression Add Operators', url: 'https://leetcode.com/problems/expression-add-operators/', difficulty: 'Hard' },
    ],
  },
  {
    id: 'selection-heaps',
    label: 'Selection & Heaps',
    description: 'Order statistics, partitioning, and streaming medians.',
    leetcodeHard: [
      { title: 'Merge k Sorted Lists', url: 'https://leetcode.com/problems/merge-k-sorted-lists/', difficulty: 'Hard' },
      { title: 'Find Median from Data Stream', url: 'https://leetcode.com/problems/find-median-from-data-stream/', difficulty: 'Hard' },
      { title: 'Sliding Window Median', url: 'https://leetcode.com/problems/sliding-window-median/', difficulty: 'Hard' },
    ],
  },
];

export const algorithms: AlgorithmMeta[] = [
  {
    id: 'nqueens',
    title: 'N-Queens Visualizer',
    shortTitle: 'N-Queens',
    description: 'Interactive chessboard with backtracking algorithm visualization',
    path: '/nqueens',
    color: 'from-purple-500 to-pink-500',
    icon: Crown,
    category: 'backtracking',
    highlights: ['3D Chessboard', 'Solution Gallery', 'Attack Patterns', 'Performance Stats'],
    tagline: 'Backtracking Search',
    complexity: 'O(N!)',
    dashboard: { status: 'Active', progress: 85 },
  },
  {
    id: 'lcs',
    title: 'LCS Visualizer',
    shortTitle: 'LCS',
    description: 'Dynamic programming visualization for Longest Common Subsequence',
    path: '/lcs',
    color: 'from-blue-500 to-cyan-500',
    icon: FileText,
    category: 'dynamic-programming',
    highlights: ['2D-4D Support', 'Path Reconstruction', 'Space Optimization', 'Multi-String'],
    tagline: 'Dynamic Programming',
    complexity: 'O(m*n)',
    dashboard: { status: 'Learning', progress: 92 },
  },
  {
    id: 'trie',
    title: 'Trie Data Structure',
    shortTitle: 'Trie',
    description: 'Interactive prefix tree with search and auto-completion',
    path: '/trie',
    color: 'from-green-500 to-emerald-500',
    icon: TreePine,
    category: 'trees',
    highlights: ['Word Insertion', 'Auto-Complete', 'Memory Analysis', 'Bulk Import'],
    tagline: 'Tree Data Structure',
    complexity: 'O(m)',
    dashboard: { status: 'Mastered', progress: 100 },
  },
  {
    id: 'word-ladder',
    title: 'Word Ladder',
    shortTitle: 'Word Ladder',
    description: 'BFS word transformation with constellation graph visualization',
    path: '/word-ladder',
    color: 'from-amber-500 to-orange-500',
    icon: Route,
    category: 'graphs',
    highlights: ['BFS Search', 'Bi-directional', 'Dictionary Graph', 'Path Visualization'],
    tagline: 'Graph BFS',
    complexity: 'O(N*L*L)',
  },
  {
    id: 'trapping-water',
    title: 'Trapping Rain Water',
    shortTitle: 'Trapping Water',
    description: 'Interactive terrain with animated water filling using 4 algorithm approaches',
    path: '/trapping-water',
    color: 'from-cyan-500 to-sky-500',
    icon: Droplets,
    category: 'arrays-intervals',
    highlights: ['4 Approaches', 'Draggable Terrain', 'Water Physics', 'Stack Visualization'],
    tagline: 'Two Pointers + Stack',
    complexity: 'O(n)',
  },
  {
    id: 'rotting-oranges',
    title: 'Rotting Oranges',
    shortTitle: 'Rotting Oranges',
    description: 'Multi-source BFS infection simulator with wave propagation',
    path: '/rotting-oranges',
    color: 'from-red-500 to-orange-500',
    icon: Bug,
    category: 'graphs',
    highlights: ['Grid Editor', 'BFS Waves', 'Queue Tracking', 'Infection Animation'],
    tagline: 'Multi-Source BFS',
    complexity: 'O(R*C)',
  },
  {
    id: 'super-egg-drop',
    title: 'Super Egg Drop',
    shortTitle: 'Super Egg Drop',
    description: 'DP + binary search optimization with building and egg physics',
    path: '/super-egg-drop',
    color: 'from-amber-400 to-yellow-500',
    icon: Egg,
    category: 'dynamic-programming',
    highlights: ['3 DP Approaches', 'Building Viz', 'DP Table Animation', 'Binary Search'],
    tagline: 'DP Optimization',
    complexity: 'O(K*N*log N)',
  },
  {
    id: 'merge-intervals',
    title: 'Merge Intervals',
    shortTitle: 'Merge Intervals',
    description: 'Timeline-based interval merging with sorting animation',
    path: '/merge-intervals',
    color: 'from-emerald-500 to-teal-500',
    icon: GitMerge,
    category: 'arrays-intervals',
    highlights: ['Timeline Bars', 'Sort Animation', 'Merge Transitions', 'Interval Editor'],
    tagline: 'Sorting + Merging',
    complexity: 'O(n log n)',
  },
  {
    id: 'sliding-window',
    title: 'Sliding Window Max',
    shortTitle: 'Sliding Window',
    description: 'Monotonic deque visualization with sliding window animation',
    path: '/sliding-window',
    color: 'from-violet-500 to-purple-500',
    icon: SlidersHorizontal,
    category: 'arrays-intervals',
    highlights: ['Deque State', 'Window Highlight', 'Push/Pop Animation', 'Custom Input'],
    tagline: 'Monotonic Deque',
    complexity: 'O(n)',
  },
  {
    id: 'course-schedule',
    title: 'Course Schedule',
    shortTitle: 'Course Schedule',
    description: 'Topological sort with directed graph and cycle detection',
    path: '/course-schedule',
    color: 'from-sky-500 to-blue-500',
    icon: GraduationCap,
    category: 'graphs',
    highlights: ['Graph Visualization', 'Cycle Detection', 'In-Degree Tracking', 'BFS Processing'],
    tagline: 'Topological Sort',
    complexity: 'O(V+E)',
  },
  {
    id: 'coin-change',
    title: 'Coin Change',
    shortTitle: 'Coin Change',
    description: 'DP array filling with coin stacking and optimal combination display',
    path: '/coin-change',
    color: 'from-yellow-400 to-amber-500',
    icon: Coins,
    category: 'dynamic-programming',
    highlights: ['DP Array', 'Coin Animation', 'Optimal Path', 'Custom Denominations'],
    tagline: 'Unbounded DP',
    complexity: 'O(amount*coins)',
  },
  {
    id: 'lis',
    title: 'Longest Increasing Sub.',
    shortTitle: 'LIS',
    description: 'Bar chart with DP and patience sorting (binary search) approaches',
    path: '/lis',
    color: 'from-pink-500 to-rose-500',
    icon: TrendingUp,
    category: 'dynamic-programming',
    highlights: ['2 Approaches', 'Subsequence Highlight', 'Patience Sort', 'Tails Array'],
    tagline: 'Patience Sorting',
    complexity: 'O(n log n)',
  },
  {
    id: 'dijkstra',
    title: "Dijkstra's Shortest Path",
    shortTitle: 'Dijkstra',
    description: 'Weighted graph shortest path with priority queue and edge relaxation animation',
    path: '/dijkstra',
    color: 'from-teal-500 to-cyan-500',
    icon: Navigation,
    category: 'graphs',
    highlights: ['Graph Visualization', 'Edge Relaxation', 'Distance Table', 'Priority Queue'],
    tagline: 'Shortest Paths',
    complexity: 'O(E log V)',
  },
  {
    id: 'knapsack',
    title: '0/1 Knapsack',
    shortTitle: 'Knapsack',
    description: 'DP table filling with item selection and backtracking for optimal combination',
    path: '/knapsack',
    color: 'from-indigo-500 to-purple-500',
    icon: Package,
    category: 'dynamic-programming',
    highlights: ['DP Table', 'Item Cards', 'Backtracking', 'Custom Items'],
    tagline: '0/1 DP',
    complexity: 'O(n*W)',
  },
  {
    id: 'edit-distance',
    title: 'Edit Distance',
    shortTitle: 'Edit Distance',
    description: 'Levenshtein distance DP with operation backtracking and character comparison',
    path: '/edit-distance',
    color: 'from-orange-500 to-red-500',
    icon: PenTool,
    category: 'dynamic-programming',
    highlights: ['DP Matrix', 'Operation Trace', 'Insert/Delete/Replace', 'Custom Words'],
    tagline: 'Levenshtein DP',
    complexity: 'O(m*n)',
  },
  {
    id: 'kth-largest',
    title: 'Kth Largest Element',
    shortTitle: 'Kth Largest',
    description: 'QuickSelect partitioning with pivot animation and comparison counting',
    path: '/kth-largest',
    color: 'from-lime-500 to-green-500',
    icon: Target,
    category: 'selection-heaps',
    highlights: ['QuickSelect', 'Partition Viz', 'Pivot Highlight', 'O(n) Expected'],
    tagline: 'QuickSelect',
    complexity: 'O(n) expected',
  },
];

export const algorithmCategoryCounts = algorithms.reduce((acc, algorithm) => {
  acc[algorithm.category] = (acc[algorithm.category] ?? 0) + 1;
  return acc;
}, {} as Record<AlgorithmCategoryId, number>);

export const algorithmStats = {
  algorithmCount: algorithms.length,
  visualizationCount: algorithms.length,
  codeExampleCount: algorithms.length,
  learningPathCount: algorithmCategories.length,
};

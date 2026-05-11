import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface GlossaryTerm {
  term: string;
  category: string;
  definition: string;
  example?: string;
  complexity?: string;
}

const TERMS: GlossaryTerm[] = [
  {
    term: 'BFS',
    category: 'Graph',
    definition: 'Breadth-First Search explores nodes level by level using a queue. Guarantees shortest path in unweighted graphs.',
    example: 'Word Ladder, Rotting Oranges',
    complexity: 'O(V + E)',
  },
  {
    term: 'DFS',
    category: 'Graph',
    definition: 'Depth-First Search explores as far as possible along each branch before backtracking, typically implemented with a stack or recursion.',
    example: 'Course Schedule cycle detection',
    complexity: 'O(V + E)',
  },
  {
    term: 'Dynamic Programming',
    category: 'DP',
    definition: 'A method that breaks problems into overlapping subproblems and stores results (memoization/tabulation) to avoid redundant computation.',
    example: 'LCS, LIS, Coin Change, Knapsack',
  },
  {
    term: 'Memoization',
    category: 'DP',
    definition: 'Top-down DP strategy where computed results are cached in a hash map to prevent recalculation.',
    complexity: 'Varies',
  },
  {
    term: 'Tabulation',
    category: 'DP',
    definition: 'Bottom-up DP strategy that fills a table iteratively, computing smaller subproblems first.',
  },
  {
    term: 'Backtracking',
    category: 'Algorithm',
    definition: 'A systematic method of trying out possibilities and abandoning (backtracking) when constraints are violated.',
    example: 'N-Queens, Sudoku Solver',
  },
  {
    term: 'Trie',
    category: 'Data Structure',
    definition: 'A tree-like data structure where each node represents a character, enabling O(m) lookup for strings of length m.',
    example: 'Auto-complete, spell checker',
    complexity: 'O(m) per operation',
  },
  {
    term: 'Monotonic Deque',
    category: 'Data Structure',
    definition: 'A double-ended queue maintaining elements in monotonically increasing or decreasing order, enabling O(1) range max/min queries.',
    example: 'Sliding Window Maximum',
    complexity: 'O(n) amortized',
  },
  {
    term: 'Topological Sort',
    category: 'Graph',
    definition: 'Linear ordering of vertices in a DAG such that for every directed edge u→v, vertex u comes before v.',
    example: 'Course Schedule',
    complexity: 'O(V + E)',
  },
  {
    term: 'Dijkstra\'s Algorithm',
    category: 'Graph',
    definition: 'Greedy algorithm that finds shortest paths from a source to all other vertices in a weighted graph using a priority queue.',
    complexity: 'O(E log V)',
  },
  {
    term: 'LCS',
    category: 'DP',
    definition: 'Longest Common Subsequence — the longest sequence of characters that appear left-to-right (not necessarily contiguous) in both strings.',
    complexity: 'O(m·n)',
  },
  {
    term: 'LIS',
    category: 'DP',
    definition: 'Longest Increasing Subsequence — the longest strictly increasing subsequence within an array.',
    complexity: 'O(n log n) with patience sort',
  },
  {
    term: 'QuickSelect',
    category: 'Algorithm',
    definition: 'Selection algorithm based on QuickSort\'s partition step. Finds the k-th smallest element in O(n) expected time without full sorting.',
    complexity: 'O(n) expected, O(n²) worst',
  },
  {
    term: 'Priority Queue',
    category: 'Data Structure',
    definition: 'An abstract data type where each element has a priority and the highest priority element is dequeued first, typically implemented as a heap.',
    complexity: 'O(log n) insert/delete',
  },
  {
    term: 'Sliding Window',
    category: 'Algorithm',
    definition: 'Technique that maintains a window of elements and slides it across an array to compute properties without recomputing from scratch.',
    complexity: 'O(n)',
  },
  {
    term: 'Two Pointers',
    category: 'Algorithm',
    definition: 'Uses two index pointers moving toward each other or in the same direction to solve array problems in O(n).',
    example: 'Trapping Rain Water',
    complexity: 'O(n)',
  },
  {
    term: 'Edit Distance',
    category: 'DP',
    definition: 'Levenshtein distance — minimum number of single-character edits (insert, delete, substitute) to transform one string into another.',
    complexity: 'O(m·n)',
  },
  {
    term: 'Knapsack Problem',
    category: 'DP',
    definition: '0/1 Knapsack: maximize value selecting items with given weights without exceeding capacity. Each item can be chosen at most once.',
    complexity: 'O(n·W)',
  },
  {
    term: 'Union-Find',
    category: 'Data Structure',
    definition: 'Disjoint set union structure supporting near O(1) amortized union and find operations, useful for connectivity queries.',
    complexity: 'O(α(n)) per op',
  },
  {
    term: 'Amortized Analysis',
    category: 'Concept',
    definition: 'Averaging the time complexity of a sequence of operations to get a tighter bound when occasional expensive operations are rare.',
  },
  {
    term: 'Space Optimization',
    category: 'DP',
    definition: 'Reducing DP table space from O(m·n) to O(n) by noting that only the previous row is needed for many 2D DP solutions.',
    example: 'LCS space-optimized mode',
  },
];

const CATEGORIES = [...new Set(TERMS.map((t) => t.category))].sort();

const Glossary: React.FC = () => {
  const { theme } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return TERMS.filter((t) => {
      const matchSearch = !q || t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q);
      const matchCat = selectedCategory === 'All' || t.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [search, selectedCategory]);

  return (
    <div className={`min-h-screen px-4 py-10 transition-all ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm font-semibold text-purple-300">
            <BookOpen className="h-4 w-4" />
            Algorithm Glossary
          </div>
          <h1 className="text-3xl font-black">CS & Algorithm Concepts</h1>
          <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Quick reference for all terminology used across AlgoQuest.
          </p>
        </motion.div>

        {/* Search + filter */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <div className={`relative flex-1 rounded-2xl border ${theme === 'dark' ? 'border-gray-700 bg-gray-800/60' : 'border-gray-200 bg-white'}`}>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search terms…"
              className="w-full bg-transparent py-3 pl-10 pr-4 text-sm outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {['All', ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'border-blue-400 bg-blue-600 text-white'
                    : theme === 'dark'
                    ? 'border-gray-700 text-gray-400 hover:border-gray-500'
                    : 'border-gray-200 text-gray-600 hover:border-gray-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Terms */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <p className="text-center text-gray-500 py-12">No terms match your search.</p>
          )}
          {filtered.map((term, idx) => (
            <motion.div
              key={term.term}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className={`rounded-2xl border p-4 transition-all hover:shadow-lg ${
                theme === 'dark'
                  ? 'border-gray-700/60 bg-gray-800/40 hover:border-gray-600'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-bold text-base">{term.term}</h3>
                <span className={`flex-shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                  theme === 'dark' ? 'border-gray-600 text-gray-400' : 'border-gray-200 text-gray-500'
                }`}>
                  {term.category}
                </span>
              </div>
              <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {term.definition}
              </p>
              {(term.example || term.complexity) && (
                <div className="mt-2 flex flex-wrap gap-3">
                  {term.complexity && (
                    <span className="text-xs text-blue-400 font-mono">⏱ {term.complexity}</span>
                  )}
                  {term.example && (
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                      e.g. {term.example}
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Glossary;

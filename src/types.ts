export interface Position {
  row: number;
  col: number;
}

export interface Queen extends Position {
  id: string;
}

export interface NQueensState {
  n: number;
  queens: Queen[];
  solutions: Queen[][];
  currentSolution: number;
  isAnimating: boolean;
  showHints: boolean;
  searchStats: {
    nodesVisited: number;
    backtracks: number;
    branchingFactor: number;
  };
}

export interface LCSState {
  strings: string[];
  dpTable: number[][][];
  currentStep: Position[];
  lcsPath: Position[];
  isAnimating: boolean;
  spaceOptimized: boolean;
}

export interface TrieNode {
  id: string;
  char: string;
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;
  depth: number;
  x?: number;
  y?: number;
}

export interface TrieState {
  root: TrieNode;
  words: string[];
  currentSearch: string;
  searchResult: 'found' | 'not-found' | 'searching' | null;
  suggestions: string[];
  isAnimating: boolean;
  memoryUsage: number;
}

export type Language = 'cpp' | 'python' | 'javascript';

export interface CodeGeneration {
  language: Language;
  code: string;
  currentLine?: number;
}

export type Theme = 'light' | 'dark';

export interface AppState {
  theme: Theme;
  language: Language;
  currentPage: string;
}
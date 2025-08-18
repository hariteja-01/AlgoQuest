import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Upload, Download, Trash2, Eye, BarChart3 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TrieEngine } from '../logic/trie/engine';
import { generateTrieCode, generateTrieOperations } from '../logic/trie/codegen';
import CodeDisplay from '../components/CodeDisplay';
import { TrieNode } from '../types';

const Trie: React.FC = React.memo(() => {
  const { theme, language } = useApp();
  const [engine] = useState(() => new TrieEngine());
  const [words, setWords] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState('');
  const [searchWord, setSearchWord] = useState('');
  const [searchResult, setSearchResult] = useState<'found' | 'not-found' | 'searching' | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationPath, setAnimationPath] = useState<TrieNode[]>([]);
  const [memoryStats, setMemoryStats] = useState({ nodes: 1, edges: 0, bytes: 100 });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const vizContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    engine.calculateLayout();
    updateMemoryStats();
  }, [words]);

  const updateMemoryStats = useCallback(() => {
    const stats = engine.getMemoryUsage();
    setMemoryStats(stats);
  }, [engine]);

  const insertWord = useCallback(async (word: string) => {
    if (!word || words.includes(word.toLowerCase())) return;
    setIsAnimating(true);
    const { path } = engine.insert(word.toLowerCase());
    // Animate insertion
    for (let i = 0; i < path.length; i++) {
      setAnimationPath(path.slice(0, i + 1));
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    setWords(prev => [...prev, word.toLowerCase()]);
    setCurrentWord('');
    setAnimationPath([]);
    setIsAnimating(false);
    updateMemoryStats();
  }, [engine, words, updateMemoryStats]);

  const searchForWord = useCallback(async (word: string) => {
    if (!word) return;
    setIsAnimating(true);
    setSearchResult('searching');
    const { found, path, failedAt } = engine.search(word.toLowerCase());
    // Animate search
    for (let i = 0; i < path.length; i++) {
      setAnimationPath(path.slice(0, i + 1));
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    if (failedAt) {
      // Animate failure
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    setSearchResult(found ? 'found' : 'not-found');
    setAnimationPath([]);
    setIsAnimating(false);
  }, [engine]);

  const getPrefixSuggestions = useCallback(async (prefix: string) => {
    if (!prefix) {
      setSuggestions([]);
      return;
    }
    const { hasPrefix, suggestions: prefixSuggestions } = engine.startsWith(prefix.toLowerCase());
    setSuggestions(hasPrefix ? prefixSuggestions : []);
  }, [engine]);

  const insertSampleWords = useCallback(() => {
    const samples = ['hello', 'world', 'help', 'hero', 'her', 'he', 'tree', 'trie', 'try'];
    samples.forEach(word => {
      if (!words.includes(word)) {
        engine.insert(word);
        setWords(prev => [...prev, word]);
      }
    });
    updateMemoryStats();
  }, [engine, words, updateMemoryStats]);

  const clearTrie = useCallback(() => {
    setWords([]);
    setSuggestions([]);
    setSearchResult(null);
    setAnimationPath([]);
    updateMemoryStats();
  }, [updateMemoryStats]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const fileWords = content.split(/[\n,\s]+/).filter(word => word.length > 0);
      
      fileWords.forEach(word => {
        const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
        if (cleanWord && !words.includes(cleanWord)) {
          engine.insert(cleanWord);
        }
      });
      
      const uniqueWords = Array.from(new Set(fileWords.map(w => w.toLowerCase().replace(/[^a-z]/g, ''))))
        .filter(w => w.length > 0);
      setWords(prev => [...prev, ...uniqueWords.filter(w => !prev.includes(w))]);
      updateMemoryStats();
    };
    reader.readAsText(file);
  }, [engine, words, updateMemoryStats]);

  const downloadWords = useCallback(() => {
    const blob = new Blob([words.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trie-words.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [words]);

  const TrieNodeComponent: React.FC<{ 
    node: TrieNode, 
    x: number, 
    y: number, 
    isInPath?: boolean,
    isActive?: boolean 
  }> = ({ node, x, y, isInPath = false, isActive = false }) => {
    return (
      <motion.g>
        <motion.circle
          cx={x}
          cy={y}
          r={isActive ? 25 : 20}
          className={`transition-all duration-300 ${
            isInPath
              ? 'fill-blue-500 stroke-blue-700'
              : node.isEndOfWord
                ? theme === 'dark'
                  ? 'fill-green-600 stroke-green-400'
                  : 'fill-green-500 stroke-green-700'
                : theme === 'dark'
                  ? 'fill-slate-600 stroke-slate-400'
                  : 'fill-slate-200 stroke-slate-400'
          }`}
          strokeWidth={2}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        />
        
        {node.char && (
          <motion.text
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className={`text-sm font-bold ${
              isInPath || node.isEndOfWord
                ? 'fill-white'
                : theme === 'dark'
                  ? 'fill-slate-300'
                  : 'fill-slate-700'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {node.char.toUpperCase()}
          </motion.text>
        )}

        {node.isEndOfWord && (
          <motion.circle
            cx={x + 15}
            cy={y - 15}
            r={5}
            className="fill-red-500"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          />
        )}
      </motion.g>
    );
  };

  const TrieVisualization: React.FC = () => {
    const renderNode = (node: TrieNode, x: number, y: number, level: number = 0): JSX.Element[] => {
      const elements: JSX.Element[] = [];
      const isInPath = animationPath.some(pathNode => pathNode.id === node.id);
      const isActive = animationPath.length > 0 && animationPath[animationPath.length - 1]?.id === node.id;

      // Render current node
      elements.push(
        <TrieNodeComponent
          key={node.id}
          node={node}
          x={x}
          y={y}
          isInPath={isInPath}
          isActive={isActive}
        />
      );

      // Render children
      const children = Array.from(node.children.values());
      const childSpacing = Math.max(60, 400 / Math.pow(2, level));
      const startX = x - (children.length - 1) * childSpacing / 2;

      children.forEach((child, index) => {
        const childX = startX + index * childSpacing;
        const childY = y + 80;
        
        // Draw edge
        const isEdgeInPath = isInPath && animationPath.some(pathNode => pathNode.id === child.id);
        elements.push(
          <motion.line
            key={`edge-${node.id}-${child.id}`}
            x1={x}
            y1={y + 20}
            x2={childX}
            y2={childY - 20}
            className={`transition-all duration-300 ${
              isEdgeInPath
                ? 'stroke-blue-500 stroke-4'
                : theme === 'dark'
                  ? 'stroke-slate-500 stroke-2'
                  : 'stroke-slate-400 stroke-2'
            }`}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: level * 0.1 }}
          />
        );

        // Recursively render child nodes
        elements.push(...renderNode(child, childX, childY, level + 1));
      });

      return elements;
    };

  return (
      <div className={`p-6 rounded-2xl backdrop-blur-sm ${
        theme === 'dark' ? 'bg-slate-800/60' : 'bg-white/80'
      } shadow-lg border border-slate-200/20`}>
        <h3 className={`text-lg font-semibold mb-4 flex items-center ${
          theme === 'dark' ? 'text-white' : 'text-slate-900'
        }`}>
          <Eye className="h-5 w-5 mr-2" />
          Trie Structure
        </h3>
        <div className="w-full h-96 overflow-auto" ref={el => (vizContainerRef.current = el)}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: 8 }}>
            <svg
              width="100%"
              height={400}
              viewBox="0 0 800 400"
              className={theme === 'dark' ? 'text-white' : 'text-slate-900'}
            >
              {renderNode(engine.root, 400, 50)}
            </svg>
          </div>
        </div>
      </div>
    );
  };







// --- Standalone, memoized, local-state, focus-stable input components ---
type WordInputProps = {
  onInsert: (word: string) => void;
  isAnimating: boolean;
  theme: string;
};
const WordInput = React.memo(function WordInput({ onInsert, isAnimating, theme }: WordInputProps) {
  const [localValue, setLocalValue] = useState("");
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value.toUpperCase());
  }, []);
  const handleInsert = useCallback(() => {
    if (localValue.trim()) {
      onInsert(localValue.trim());
      setLocalValue("");
    }
  }, [localValue, onInsert]);
  return (
    <div className={`p-6 rounded-2xl backdrop-blur-sm ${
      theme === 'dark' ? 'bg-slate-800/60' : 'bg-white/80'
    } shadow-lg border border-slate-200/20`}>
      <h3 className={`text-lg font-semibold mb-4 flex items-center ${
        theme === 'dark' ? 'text-white' : 'text-slate-900'
      }`}>
        <Plus className="h-5 w-5 mr-2" />
        Insert Word
      </h3>
      <div className="flex space-x-3">
        <input
          value={localValue}
          onChange={handleChange}
          onKeyDown={e => {
            if (e.key === 'Enter') handleInsert();
          }}
          autoComplete="off"
          style={{ textTransform: 'uppercase' }}
          className={`flex-1 px-3 py-2 rounded-lg border text-sm font-mono transition-all duration-200 ${
            theme === 'dark'
              ? 'bg-slate-700 border-slate-600 text-slate-200 focus:border-blue-500'
              : 'bg-white border-slate-300 text-slate-700 focus:border-blue-500'
          } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
          placeholder="Enter word..."
          disabled={isAnimating}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleInsert}
          disabled={isAnimating || !localValue}
          className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium disabled:opacity-50"
        >
          Insert
        </motion.button>
      </div>
    </div>
  );
});

type SearchInputProps = {
  value: string;
  onChange: (v: string) => void;
  onSearch: () => void;
  isAnimating: boolean;
  theme: string;
  searchResult: 'found' | 'not-found' | 'searching' | null;
  suggestions: string[];
  onSuggestionClick: (s: string) => void;
};
const SearchInput = React.memo(function SearchInput({ value, onChange, onSearch, isAnimating, theme, searchResult, suggestions, onSuggestionClick }: SearchInputProps) {
  const [localValue, setLocalValue] = useState("");
  useEffect(() => {
    if (value === "") setLocalValue("");
  }, [value]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value.toUpperCase());
  }, []);

  const handleSearch = useCallback(() => {
    if (localValue.trim()) {
      onChange(localValue.trim()); // notify parent only on submit
      onSearch();
    }
  }, [localValue, onChange, onSearch]);

  return (
    <div className={`p-6 rounded-2xl backdrop-blur-sm ${
      theme === 'dark' ? 'bg-slate-800/60' : 'bg-white/80'
    } shadow-lg border border-slate-200/20`}>
      <h3 className={`text-lg font-semibold mb-4 flex items-center ${
        theme === 'dark' ? 'text-white' : 'text-slate-900'
      }`}>
        <Search className="h-5 w-5 mr-2" />
        Search & Autocomplete
      </h3>
      <div className="space-y-4">
        <div className="flex space-x-3">
          <input
            value={localValue}
            onChange={handleChange}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            autoComplete="off"
            style={{ textTransform: 'uppercase' }}
            className={`flex-1 px-3 py-2 rounded-lg border transition-all duration-200 ${
              theme === 'dark'
                ? 'bg-slate-700 border-slate-600 text-slate-200 focus:border-blue-500'
                : 'bg-white border-slate-300 text-slate-700 focus:border-blue-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            placeholder="Enter word to search..."
            disabled={isAnimating}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSearch}
            disabled={isAnimating || !localValue}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium disabled:opacity-50"
          >
            Search
          </motion.button>
        </div>
        {/* Search Result */}
        <AnimatePresence>
          {searchResult && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-3 rounded-lg text-center font-medium ${
                searchResult === 'found'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  : searchResult === 'not-found'
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
              }`}
            >
              {searchResult === 'found' ? '✓ Word found!' : 
               searchResult === 'not-found' ? '✗ Word not found' : 
               '⌛ Searching...'}
            </motion.div>
          )}
        </AnimatePresence>
        {/* Suggestions */}
        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`border rounded-lg overflow-hidden ${
                theme === 'dark' ? 'border-slate-600' : 'border-slate-300'
              }`}
            >
              <div className={`px-3 py-2 text-sm font-medium ${
                theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'
              }`}>
                Suggestions ({suggestions.length})
              </div>
              <div className="max-h-32 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={suggestion}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => onSuggestionClick(suggestion)}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors ${
                      theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});


  const ManagementPanel: React.FC = () => (
    <div className={`p-6 rounded-2xl backdrop-blur-sm ${
      theme === 'dark' ? 'bg-slate-800/60' : 'bg-white/80'
    } shadow-lg border border-slate-200/20`}>
      <h3 className={`text-lg font-semibold mb-4 ${
        theme === 'dark' ? 'text-white' : 'text-slate-900'
      }`}>
        Management
      </h3>
      
      <div className="space-y-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={insertSampleWords}
          className={`w-full px-4 py-2 rounded-lg border transition-all duration-200 flex items-center justify-center space-x-2 ${
            theme === 'dark'
              ? 'border-slate-600 text-slate-300 hover:bg-slate-700'
              : 'border-slate-300 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Plus className="h-4 w-4" />
          <span>Insert Sample Words</span>
        </motion.button>

        <div className="flex space-x-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => fileInputRef.current?.click()}
            className={`flex-1 px-4 py-2 rounded-lg border transition-all duration-200 flex items-center justify-center space-x-2 ${
              theme === 'dark'
                ? 'border-slate-600 text-slate-300 hover:bg-slate-700'
                : 'border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Upload className="h-4 w-4" />
            <span>Upload</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={downloadWords}
            disabled={words.length === 0}
            className={`flex-1 px-4 py-2 rounded-lg border transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 ${
              theme === 'dark'
                ? 'border-slate-600 text-slate-300 hover:bg-slate-700'
                : 'border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </motion.button>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={clearTrie}
          className={`w-full px-4 py-2 rounded-lg border transition-all duration-200 flex items-center justify-center space-x-2 ${
            theme === 'dark'
              ? 'border-red-600 text-red-400 hover:bg-red-900/20'
              : 'border-red-300 text-red-600 hover:bg-red-50'
          }`}
        >
          <Trash2 className="h-4 w-4" />
          <span>Clear Trie</span>
        </motion.button>
      </div>
    </div>
  );

  const StatsPanel: React.FC = () => (
    <div className={`p-6 rounded-2xl backdrop-blur-sm ${
      theme === 'dark' ? 'bg-slate-800/60' : 'bg-white/80'
    } shadow-lg border border-slate-200/20`}>
      <h3 className={`text-lg font-semibold mb-4 flex items-center ${
        theme === 'dark' ? 'text-white' : 'text-slate-900'
      }`}>
        <BarChart3 className="h-5 w-5 mr-2" />
        Memory Statistics
      </h3>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>
            Words Stored
          </span>
          <span className={`font-mono ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
            {words.length}
          </span>
        </div>
        <div className="flex justify-between">
          <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>
            Total Nodes
          </span>
          <span className={`font-mono ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
            {memoryStats.nodes}
          </span>
        </div>
        <div className="flex justify-between">
          <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>
            Total Edges
          </span>
          <span className={`font-mono ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
            {memoryStats.edges}
          </span>
        </div>
        <div className="flex justify-between">
          <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>
            Est. Memory
          </span>
          <span className={`font-mono ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`}>
            {(memoryStats.bytes / 1024).toFixed(1)} KB
          </span>
        </div>
        
        {words.length > 0 && (
          <div className="pt-3 border-t border-slate-200/20">
            <div className="flex justify-between">
              <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Compression Ratio
              </span>
              <span className={`font-mono text-sm ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>
                {((words.reduce((acc, word) => acc + word.length, 0) / memoryStats.nodes) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const WordsList: React.FC = () => (
    <AnimatePresence>
      {words.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`p-6 rounded-2xl backdrop-blur-sm ${
            theme === 'dark' ? 'bg-slate-800/60' : 'bg-white/80'
          } shadow-lg border border-slate-200/20`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Stored Words ({words.length})
          </h3>
          
          <div className="max-h-40 overflow-y-auto">
            <div className="flex flex-wrap gap-2">
              {words.map((word, index) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    theme === 'dark'
                      ? 'bg-slate-700 text-slate-200'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {word}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // --- Handlers for input fields, memoized with useCallback ---


  // Insert handler: insert the word directly from input
  const handleWordInsert = useCallback((word: string) => {
    insertWord(word);
  }, [insertWord]);

  const handleSearchInputChange = useCallback((v: string) => {
    setSearchWord(v);
    getPrefixSuggestions(v);
  }, [getPrefixSuggestions]);

  const handleSearch = useCallback(() => {
    searchForWord(searchWord);
    setSearchWord("");
  }, [searchForWord, searchWord]);

  const handleSuggestionClick = useCallback((s: string) => {
    setSearchWord(s);
    setSuggestions([]);
  }, []);

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Trie Visualizer
          </h1>
          <p className={`text-lg ${
            theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Visualize Trie operations interactively
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
          <WordInput
            onInsert={handleWordInsert}
            isAnimating={isAnimating}
            theme={theme}
          />

          <SearchInput
            value={searchWord}
            onChange={handleSearchInputChange}
            onSearch={handleSearch}
            isAnimating={isAnimating}
            theme={theme}
            searchResult={searchResult}
            suggestions={suggestions}
            onSuggestionClick={handleSuggestionClick}
            />
            <ManagementPanel />
            <StatsPanel />
            <WordsList />
          </motion.div>

          {/* Center - Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-1"
          >
            <TrieVisualization />
          </motion.div>

          {/* Right Panel - Code */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <CodeDisplay
              code={generateTrieCode(language, generateTrieOperations(words))}
              language={language}
              title="Trie Implementation"
              className="h-full"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
});

export default Trie;
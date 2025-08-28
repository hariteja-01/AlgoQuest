import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Settings, Info, TrendingUp, Lightbulb, Maximize2, Minimize2, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NQueensEngine } from '../logic/nqueens/engine';
import { generateNQueensCode } from '../logic/nqueens/codegen';
import CodeDisplay from '../components/CodeDisplay';
import ChessSquare from '../components/ChessSquare';
import { Queen, Position } from '../types';

const NQueens: React.FC = () => {
  const { theme, language } = useApp();
  const [n, setN] = useState(8);
  const [queens, setQueens] = useState<Queen[]>([]);
  const [solutions, setSolutions] = useState<Queen[][]>([]);
  const [currentSolution, setCurrentSolution] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [attackSquares, setAttackSquares] = useState<Position[]>([]);
  const [engine, setEngine] = useState(() => new NQueensEngine(n));
  const [searchStats, setSearchStats] = useState({ nodesVisited: 0, backtracks: 0, branchingFactor: 0 });
  const [showDoubts, setShowDoubts] = useState(false);
  const [mode, setMode] = useState<'manual' | 'solve' | 'solutions'>('manual');
  const [showSolutionsModal, setShowSolutionsModal] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    const newEngine = new NQueensEngine(n);
    setEngine(newEngine);
    setQueens([]);
    setSolutions([]);
    setCurrentSolution(0);
    updateAttackSquares([]);
  }, [n]);

  const updateAttackSquares = useCallback((currentQueens: Queen[]) => {
    const attacks: Position[] = [];
    currentQueens.forEach(queen => {
      attacks.push(...engine.getAttackSquares(queen));
    });
    setAttackSquares(attacks);
  }, [engine]);

  const handleSquareClick = useCallback((row: number, col: number) => {
    if (isAnimating || mode !== 'manual') return;

    const existingQueen = queens.find(q => q.row === row && q.col === col);
    if (existingQueen) {
      const newQueens = queens.filter(q => q.id !== existingQueen.id);
      setQueens(newQueens);
      updateAttackSquares(newQueens);
      return;
    }

    const newPos: Position = { row, col };
    if (engine.isValidPlacement(queens, newPos)) {
      const newQueen: Queen = { ...newPos, id: `${row}-${col}` };
      const newQueens = [...queens, newQueen];
      setQueens(newQueens);
      updateAttackSquares(newQueens);
    }
  }, [isAnimating, mode, queens, engine, updateAttackSquares]);

  const handleSquareHover = useCallback((_row: number, _col: number) => {
    if (mode !== 'manual') return;
    // Hover logic is now handled locally in ChessSquare
  }, [mode]);

  const findAllSolutions = async () => {
    setMode('solve');
    setIsAnimating(true);
    
    const foundSolutions = engine.findAllSolutions();
    setSolutions(foundSolutions);
    setSearchStats(engine.getSearchStats());
    
    if (foundSolutions.length > 0) {
      setQueens(foundSolutions[0]);
      updateAttackSquares(foundSolutions[0]);
      setShowSolutionsModal(true); // Open solutions modal
    }
    
    setIsAnimating(false);
    if (foundSolutions.length > 0) {
      setMode('solutions');
    }
  };

  const reset = () => {
    setQueens([]);
    setSolutions([]);
    setCurrentSolution(0);
    setAttackSquares([]);
    setMode('manual');
    setSearchStats({ nodesVisited: 0, backtracks: 0, branchingFactor: 0 });
  };

  const nextSolution = () => {
    if (solutions.length === 0) return;
    const next = (currentSolution + 1) % solutions.length;
    setCurrentSolution(next);
    setQueens(solutions[next]);
    updateAttackSquares(solutions[next]);
  };

  const prevSolution = () => {
    if (solutions.length === 0) return;
    const prev = currentSolution === 0 ? solutions.length - 1 : currentSolution - 1;
    setCurrentSolution(prev);
    setQueens(solutions[prev]);
    updateAttackSquares(solutions[prev]);
  };

  const toggleMaximize = () => {
    setIsMaximized((prev) => !prev);
  };

  const Chessboard: React.FC = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`grid gap-1 p-4 rounded-2xl shadow-2xl backdrop-blur-sm ${
        theme === 'dark' ? 'bg-slate-800/80' : 'bg-white/90'
      }`}
      style={{
        gridTemplateColumns: `repeat(${n}, 1fr)`,
        width: isMaximized ? 'min(90vw, 90vh)' : `clamp(300px, ${Math.min(600, 50 * n)}px, 90vw)`,
        height: isMaximized ? 'min(90vw, 90vh)' : `clamp(300px, ${Math.min(600, 50 * n)}px, 90vw)`,
        aspectRatio: '1',
        margin: '0 auto',
        overflow: 'visible',
        transition: 'all 0.3s ease',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {Array.from({ length: n * n }, (_, i) => {
        const row = Math.floor(i / n);
        const col = i % n;
        const hasQueen = queens.some(q => q.row === row && q.col === col);
        const isUnderAttack = showHints && attackSquares.some(sq => sq.row === row && sq.col === col);
        const isHovered = false; // Local hover state in ChessSquare
        const wouldBeValid = showHints && !hasQueen && engine.isValidPlacement(queens, { row, col });

        return (
          <ChessSquare
            key={i}
            row={row}
            col={col}
            hasQueen={hasQueen}
            isUnderAttack={isUnderAttack}
            isHovered={isHovered}
            wouldBeValid={wouldBeValid}
            onClick={handleSquareClick}
            onHover={handleSquareHover}
            mode={mode}
            boardSize={n}
            theme={theme}
          />
        );
      })}
    </motion.div>
  );

  return (
    <div
      className={`min-h-screen px-4 sm:px-6 lg:px-8 py-6 ${
        isMaximized ? 'fixed inset-0 bg-black z-50 overflow-auto' : ''
      }`}
    >
      <div className={`max-w-7xl mx-auto ${isMaximized ? 'w-full h-full' : ''}`}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            N-Queens Visualizer
          </h1>
          <p className={`text-lg ${
            theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Solve the N-Queens problem interactively
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left Panel - Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-4"
          >
            {/* Board Size */}
            <div className={`p-6 rounded-2xl backdrop-blur-sm ${
              theme === 'dark' ? 'bg-slate-800/60' : 'bg-white/80'
            } shadow-lg border border-slate-200/20`}>
              <h3 className={`text-lg font-semibold mb-4 flex items-center ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                <Settings className="h-5 w-5 mr-2" />
                Configuration
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Board Size (N = {n})
                  </label>
                  <input
                    type="range"
                    min="4"
                    max="10"
                    value={n}
                    onChange={(e) => setN(parseInt(e.target.value))}
                    className="w-full"
                    disabled={isAnimating}
                  />
                  <div className={`flex justify-between text-xs mt-1 ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    <span>4</span>
                    <span>10</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="show-hints"
                    checked={showHints}
                    onChange={(e) => setShowHints(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="show-hints" className={`text-sm ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Show attack patterns & valid moves
                  </label>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className={`p-6 rounded-2xl backdrop-blur-sm ${
              theme === 'dark' ? 'bg-slate-800/60' : 'bg-white/80'
            } shadow-lg border border-slate-200/20`}>
              <h3 className={`text-lg font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                Controls
              </h3>
              
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={findAllSolutions}
                  disabled={isAnimating}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <Play className="h-4 w-4" />
                  <span>Find All Solutions</span>
                </motion.button>

                {solutions.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowSolutionsModal(true)}
                    className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium flex items-center justify-center space-x-2"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View All Solutions ({solutions.length})</span>
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={reset}
                  className={`w-full px-4 py-3 rounded-xl font-medium border transition-all duration-200 flex items-center justify-center space-x-2 ${
                    theme === 'dark'
                      ? 'border-slate-600 text-slate-300 hover:bg-slate-700'
                      : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Reset</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDoubts(!showDoubts)}
                  className={`w-full px-4 py-3 rounded-xl font-medium border transition-all duration-200 flex items-center justify-center space-x-2 ${
                    theme === 'dark'
                      ? 'border-slate-600 text-slate-300 hover:bg-slate-700'
                      : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Info className="h-4 w-4" />
                  <span>Why N=2,3 Fails?</span>
                </motion.button>
              </div>
            </div>

            {/* Statistics */}
            {searchStats.nodesVisited > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-2xl backdrop-blur-sm ${
                  theme === 'dark' ? 'bg-slate-800/60' : 'bg-white/80'
                } shadow-lg border border-slate-200/20`}
              >
                <h3 className={`text-lg font-semibold mb-4 flex items-center ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Search Statistics
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>
                      Nodes Visited
                    </span>
                    <span className={`font-mono ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                      {searchStats.nodesVisited.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>
                      Backtracks
                    </span>
                    <span className={`font-mono ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                      {searchStats.backtracks.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>
                      Solutions Found
                    </span>
                    <span className={`font-mono ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                      {solutions.length}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Solutions Navigator */}
            {solutions.length > 0 && mode === 'solutions' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-2xl backdrop-blur-sm ${
                  theme === 'dark' ? 'bg-slate-800/60' : 'bg-white/80'
                } shadow-lg border border-slate-200/20`}
              >
                <h3 className={`text-lg font-semibold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  Solutions ({solutions.length})
                </h3>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowSolutionsModal(true)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-medium flex items-center justify-center space-x-2"
                >
                  <span>View All Solutions</span>
                </motion.button>
              </motion.div>
            )}
          </motion.div>

          {/* Center - Chessboard */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`lg:col-span-3 ${isMaximized ? 'w-full h-full flex items-center justify-center' : ''}`}
          >
            <div className="space-y-4">
              <div className="relative">
                <button
                  onClick={toggleMaximize}
                  className="absolute top-2 right-2 bg-gray-800 text-white p-2 rounded-full shadow-lg z-10 flex items-center justify-center"
                  aria-label={isMaximized ? 'Minimize' : 'Maximize'}
                >
                  {isMaximized ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                </button>
                <Chessboard />
                
                {/* Status */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`mt-4 p-3 rounded-xl text-center backdrop-blur-sm ${
                    queens.length === n
                      ? 'bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800'
                      : theme === 'dark'
                        ? 'bg-slate-800/60 border border-slate-700/50'
                        : 'bg-white/80 border border-slate-200/50'
                  } shadow-lg`}
                >
                  {queens.length === n ? (
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-2xl">🎉</span>
                      <span className={`font-semibold ${
                        theme === 'dark' ? 'text-green-300' : 'text-green-700'
                      }`}>
                        Solution Found!
                      </span>
                    </div>
                  ) : (
                    <div className={theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>
                      Place {n - queens.length} more queen{n - queens.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </motion.div>
              </div>
              
              {/* N-Queens Analysis Panel */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl backdrop-blur-sm ${
                  theme === 'dark' ? 'bg-slate-800/60' : 'bg-white/80'
                } shadow-lg border border-slate-200/20`}
              >
                <h4 className={`text-sm font-semibold mb-3 ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  ♛ Board Analysis
                </h4>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className={`p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-slate-700/50' : 'bg-slate-50'
                  }`}>
                    <div className={`text-lg font-bold ${
                      theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                    }`}>
                      {n}×{n}
                    </div>
                    <div className={`text-xs ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      Board Size
                    </div>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-slate-700/50' : 'bg-slate-50'
                  }`}>
                    <div className={`text-lg font-bold ${
                      theme === 'dark' ? 'text-green-400' : 'text-green-600'
                    }`}>
                      {queens.length}/{n}
                    </div>
                    <div className={`text-xs ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      Queens Placed
                    </div>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-slate-700/50' : 'bg-slate-50'
                  }`}>
                    <div className={`text-lg font-bold ${
                      theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                    }`}>
                      {solutions.length}
                    </div>
                    <div className={`text-xs ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      Solutions Found
                    </div>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-slate-700/50' : 'bg-slate-50'
                  }`}>
                    <div className={`text-lg font-bold ${
                      queens.length === n
                        ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
                        : theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
                    }`}>
                      {queens.length === n ? '✓' : Math.round((queens.length / n) * 100) + '%'}
                    </div>
                    <div className={`text-xs ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      Progress
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Code Display - Full Width Below */}
        {!isMaximized && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <CodeDisplay
              code={generateNQueensCode(n, language)}
              language={language}
              title={`N-Queens Solution (N=${n})`}
              className="min-h-[400px]"
            />
          </motion.div>
        )}

        {/* Solutions Modal */}
        <AnimatePresence>
          {showSolutionsModal && solutions.length > 0 && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                onClick={() => setShowSolutionsModal(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className={`fixed inset-4 z-50 rounded-2xl backdrop-blur-sm ${
                  theme === 'dark' ? 'bg-slate-800/95' : 'bg-white/95'
                } shadow-2xl border border-slate-200/20 overflow-hidden`}
              >
                <div className="h-full flex flex-col">
                  {/* Modal Header */}
                  <div className={`p-6 border-b ${
                    theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <h2 className={`text-2xl font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-slate-900'
                      }`}>
                        All Solutions for {n}×{n} Board ({solutions.length} found)
                      </h2>
                      <button
                        onClick={() => setShowSolutionsModal(false)}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          theme === 'dark'
                            ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        ✕
                      </button>
                    </div>
                    
                    {/* Current Solution Navigator */}
                    <div className="flex items-center justify-center space-x-4 mt-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={prevSolution}
                        className={`px-4 py-2 rounded-lg ${
                          theme === 'dark' ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        ← Previous
                      </motion.button>
                      
                      <span className={`font-medium ${
                        theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                      }`}>
                        Solution {currentSolution + 1} of {solutions.length}
                      </span>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={nextSolution}
                        className={`px-4 py-2 rounded-lg ${
                          theme === 'dark' ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        Next →
                      </motion.button>
                    </div>
                  </div>

                  {/* Modal Content */}
                  <div className="flex-1 overflow-auto p-6">
                    <div className="grid lg:grid-cols-2 gap-8 h-full">
                      {/* Current Solution Display */}
                      <div className="flex flex-col items-center justify-center">
                        <h3 className={`text-lg font-semibold mb-4 ${
                          theme === 'dark' ? 'text-white' : 'text-slate-900'
                        }`}>
                          Current Solution
                        </h3>
                        <div
                          className={`grid gap-2 p-4 rounded-xl backdrop-blur-sm ${
                            theme === 'dark' ? 'bg-slate-700/50' : 'bg-slate-100/50'
                          }`}
                          style={{
                            gridTemplateColumns: `repeat(${n}, 1fr)`,
                            width: `min(400px, 80vw)`,
                            height: `min(400px, 80vw)`,
                            aspectRatio: '1'
                          }}
                        >
                          {Array.from({ length: n * n }, (_, i) => {
                            const row = Math.floor(i / n);
                            const col = i % n;
                            const hasQueen = queens.some(q => q.row === row && q.col === col);
                            return (
                              <div
                                key={i}
                                className={`aspect-square flex items-center justify-center text-lg rounded ${
                                  (row + col) % 2 === 0 ? 'bg-amber-100' : 'bg-amber-800'
                                }`}
                              >
                                {hasQueen && '👑'}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* All Solutions Grid */}
                      <div>
                        <h3 className={`text-lg font-semibold mb-4 ${
                          theme === 'dark' ? 'text-white' : 'text-slate-900'
                        }`}>
                          All Solutions
                        </h3>
                        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 max-h-96 overflow-auto">
                          {solutions.map((solution, idx) => (
                            <motion.button
                              key={idx}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setCurrentSolution(idx);
                                setQueens(solution);
                                updateAttackSquares(solution);
                              }}
                              className={`aspect-square rounded-lg border-2 transition-all duration-200 ${
                                idx === currentSolution
                                  ? 'border-blue-500 bg-blue-100 dark:bg-blue-900/30'
                                  : theme === 'dark'
                                    ? 'border-slate-600 hover:border-slate-500'
                                    : 'border-slate-300 hover:border-slate-400'
                              }`}
                            >
                              <div className={`grid gap-px p-1 h-full`} style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
                                {Array.from({ length: n * n }, (_, i) => {
                                  const row = Math.floor(i / n);
                                  const col = i % n;
                                  const hasQueen = solution.some(q => q.row === row && q.col === col);
                                  return (
                                    <div
                                      key={i}
                                      className={`aspect-square text-xs flex items-center justify-center ${
                                        (row + col) % 2 === 0 ? 'bg-amber-100' : 'bg-amber-800'
                                      }`}
                                    >
                                      {hasQueen && '👑'}
                                    </div>
                                  );
                                })}
                              </div>
                              <div className={`text-xs mt-1 ${
                                theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                              }`}>
                                #{idx + 1}
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Doubts Panel */}
        <AnimatePresence>
          {showDoubts && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`mt-8 p-6 rounded-2xl backdrop-blur-sm ${
                theme === 'dark' ? 'bg-slate-800/60' : 'bg-white/80'
              } shadow-lg border border-slate-200/20`}
            >
              <h3 className={`text-lg font-semibold mb-4 flex items-center ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                <Lightbulb className="h-5 w-5 mr-2" />
                Why N=2 and N=3 Have No Solutions
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className={`font-medium mb-2 ${
                    theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    N=2 Case
                  </h4>
                  <p className={`text-sm mb-3 ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    On a 2×2 board, any two queens will attack each other either horizontally, vertically, or diagonally.
                  </p>
                  <div className="grid grid-cols-2 gap-1 w-20 h-20 mx-auto">
                    <div className="bg-amber-100 flex items-center justify-center text-lg">👑</div>
                    <div className="bg-amber-800 flex items-center justify-center">❌</div>
                    <div className="bg-amber-100 flex items-center justify-center">❌</div>
                    <div className="bg-amber-800 flex items-center justify-center">❌</div>
                  </div>
                </div>
                
                <div>
                  <h4 className={`font-medium mb-2 ${
                    theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    N=3 Case
                  </h4>
                  <p className={`text-sm mb-3 ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    On a 3×3 board, placing any queen eliminates too many squares, making it impossible to place 3 non-attacking queens.
                  </p>
                  <div className="grid grid-cols-3 gap-1 w-24 h-24 mx-auto">
                    <div className="bg-amber-100 flex items-center justify-center text-sm">👑</div>
                    <div className="bg-amber-800 flex items-center justify-center text-xs opacity-50">❌</div>
                    <div className="bg-amber-100 flex items-center justify-center text-xs opacity-50">❌</div>
                    <div className="bg-amber-800 flex items-center justify-center text-xs opacity-50">❌</div>
                    <div className="bg-amber-100 flex items-center justify-center text-xs opacity-50">❌</div>
                    <div className="bg-amber-800 flex items-center justify-center text-xs opacity-50">❌</div>
                    <div className="bg-amber-100 flex items-center justify-center text-xs opacity-50">❌</div>
                    <div className="bg-amber-800 flex items-center justify-center text-xs opacity-50">❌</div>
                    <div className="bg-amber-100 flex items-center justify-center text-xs opacity-50">❌</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NQueens;
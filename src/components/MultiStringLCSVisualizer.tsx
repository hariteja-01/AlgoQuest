import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Grid3x3, BarChart3, Maximize2, Minimize2, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

interface MultiStringLCSVisualizerProps {
  dpTable: number[][][] | number[][];
  strings: string[];
  theme: string;
  lcsResult: string;
}

interface LayerData {
  matrix: number[][];
  title: string;
  description: string;
  highlightedCells?: Array<{row: number, col: number, type: 'match' | 'inherit'}>;
}

const MultiStringLCSVisualizer: React.FC<MultiStringLCSVisualizerProps> = ({
  dpTable,
  strings,
  theme,
  lcsResult
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentLayer, setCurrentLayer] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [viewMode, setViewMode] = useState<'layers' | 'progression' | 'comparison'>('layers');

  // Reset internal state when strings are empty or dpTable is reset
  useEffect(() => {
    if (strings.every(str => str === '') || dpTable.length === 0) {
      setCurrentLayer(0);
      setIsAnimating(false);
      setIsExpanded(false);
      setViewMode('layers');
    }
  }, [strings, dpTable]);

  // Helper function to compute LCS (simplified for visualization)
  const computeLCS = useCallback((str1: string, str2: string): string => {
    const m = str1.length, n = str2.length;
    const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i-1] === str2[j-1]) {
          dp[i][j] = dp[i-1][j-1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
        }
      }
    }

    // Reconstruct LCS
    let lcs = '';
    let i = m, j = n;
    while (i > 0 && j > 0) {
      if (str1[i-1] === str2[j-1]) {
        lcs = str1[i-1] + lcs;
        i--; j--;
      } else if (dp[i-1][j] > dp[i][j-1]) {
        i--;
      } else {
        j--;
      }
    }

    return lcs;
  }, []);

  const generatePairwiseMatrix = useCallback((str1: string, str2: string): number[][] => {
    const m = str1.length, n = str2.length;
    const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i-1] === str2[j-1]) {
          dp[i][j] = dp[i-1][j-1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
        }
      }
    }

    return dp;
  }, []);

  const generateResultMatrix = useCallback((allStrings: string[], result: string): number[][] => {
    // Create a meaningful result visualization matrix
    if (!result || result.length === 0) {
      return [[0]];
    }
    
    // Create a matrix showing how the result relates to each string
    const maxLen = Math.max(...allStrings.map(s => s.length), result.length);
    const matrix: number[][] = Array(result.length + 1).fill(null).map(() => Array(maxLen + 1).fill(0));
    
    // Fill matrix with meaningful values showing the progression
    for (let i = 1; i <= result.length; i++) {
      for (let j = 1; j <= maxLen; j++) {
        // Show incremental LCS length as we build the result
        matrix[i][j] = i;
      }
    }
    
    return matrix;
  }, []);

  // Process the data to create meaningful layers for visualization
  const layerData = useMemo((): LayerData[] => {
    if (strings.length === 2) {
      // For 2 strings, show the traditional DP table
      const matrix = Array.isArray(dpTable[0]) ? dpTable as number[][] : [];
      return [{
        matrix,
        title: 'LCS Dynamic Programming Table',
        description: `Computing LCS between "${strings[0]}" and "${strings[1]}"`
      }];
    }

    if (strings.length === 3) {
      // For 3 strings, create layers showing the progression
      const layers: LayerData[] = [];
      
      // First, show pairwise comparisons
      const matrix1 = generatePairwiseMatrix(strings[0], strings[1]);
      layers.push({
        matrix: matrix1,
        title: `Step 1: LCS("${strings[0]}", "${strings[1]}")`,
        description: `Finding common subsequences between first two strings`
      });

      const lcs12 = computeLCS(strings[0], strings[1]);
      const matrix2 = generatePairwiseMatrix(lcs12, strings[2]);
      layers.push({
        matrix: matrix2,
        title: `Step 2: LCS("${lcs12}", "${strings[2]}")`,
        description: `Finding LCS between intermediate result and third string`
      });

      // Show the final result analysis
      layers.push({
        matrix: generateResultMatrix(strings, lcsResult),
        title: 'Final Result Analysis',
        description: `Common subsequence "${lcsResult}" found across all ${strings.length} strings`
      });

      return layers;
    }

    // For 4+ strings, show progressive reduction
    const layers: LayerData[] = [];
    let currentStrings = [...strings];
    let step = 1;

    while (currentStrings.length > 1) {
      const str1 = currentStrings[0];
      const str2 = currentStrings[1];
      const lcs = computeLCS(str1, str2);
      
      layers.push({
        matrix: generatePairwiseMatrix(str1, str2),
        title: `Step ${step}: LCS("${str1}", "${str2}")`,
        description: `Result: "${lcs}" - Reducing ${currentStrings.length} strings to ${currentStrings.length - 1}`
      });

      currentStrings = [lcs, ...currentStrings.slice(2)];
      step++;
    }

    // Add final result
    layers.push({
      matrix: generateResultMatrix(strings, lcsResult),
      title: 'Final Multi-String LCS',
      description: `Found "${lcsResult}" as the longest common subsequence`
    });

    return layers;
  }, [dpTable, strings, lcsResult, computeLCS, generatePairwiseMatrix, generateResultMatrix]);

  const nextLayer = useCallback(() => {
    setCurrentLayer(prev => Math.min(prev + 1, layerData.length - 1));
  }, [layerData.length]);

  const prevLayer = useCallback(() => {
    setCurrentLayer(prev => Math.max(prev - 1, 0));
  }, []);

  const startAnimation = useCallback(() => {
    setIsAnimating(true);
    setCurrentLayer(0);
    
    const animate = (step: number) => {
      if (step < layerData.length) {
        setTimeout(() => {
          setCurrentLayer(step);
          animate(step + 1);
        }, 2000);
      } else {
        setIsAnimating(false);
      }
    };
    
    animate(0);
  }, [layerData.length]);

  const MatrixVisualization: React.FC<{ layer: LayerData }> = ({ layer }) => {
    const { matrix, title, description } = layer;
    
    if (!matrix || matrix.length === 0) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className={`text-center ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
            <Grid3x3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Computing matrix...</p>
          </div>
        </div>
      );
    }

    // Extract string labels from the current step
    const isResultMatrix = title.includes('Final');
    const str1 = isResultMatrix ? strings[0] : title.split('"')[1] || '';
    const str2 = isResultMatrix ? strings[1] : title.split('"')[3] || '';

    return (
      <div className="space-y-4">
        <div className="text-center">
          <h4 className={`text-lg font-semibold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            {title}
          </h4>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
          }`}>
            {description}
          </p>
        </div>

        <div className="overflow-auto max-h-96 flex justify-center">
          <div className="inline-block">
            <table className="border-collapse">
              <thead>
                <tr>
                  <th className={`w-8 h-8 text-xs font-bold ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  }`}></th>
                  <th className={`w-8 h-8 text-xs font-bold ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  }`}>ε</th>
                  {(str2 || '').split('').map((char, index) => (
                    <th key={index} className={`w-12 h-8 text-xs font-bold font-mono ${
                      theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      {char}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrix.map((row, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <th className={`w-8 h-8 text-xs font-bold font-mono ${
                      theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      {i === 0 ? 'ε' : (str1 || '')[i - 1] || ''}
                    </th>
                    {row.map((cell, j) => (
                      <motion.td
                        key={`${i}-${j}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: (i + j) * 0.02 }}
                        className={`
                          w-12 h-12 border-2 text-center font-mono text-sm font-bold
                          ${cell > 0 
                            ? theme === 'dark'
                              ? 'bg-gradient-to-br from-blue-600 to-purple-600 border-blue-400 text-white shadow-lg'
                              : 'bg-gradient-to-br from-blue-100 to-purple-100 border-blue-500 text-blue-800 shadow-md'
                            : theme === 'dark'
                              ? 'bg-slate-700 border-slate-500 text-slate-300'
                              : 'bg-slate-50 border-slate-300 text-slate-600'
                          }
                          transition-all duration-300 hover:scale-105 hover:z-10 relative
                          ${cell > 0 ? 'hover:shadow-xl' : ''}
                        `}
                      >
                        {cell}
                      </motion.td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Step explanation */}
        {!isResultMatrix && (
          <div className={`text-center text-xs p-3 rounded-lg ${
            theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
          }`}>
            <strong>Algorithm:</strong> If characters match, add 1 to diagonal value. Otherwise, take maximum of left or top cell.
          </div>
        )}
      </div>
    );
  };

  const ProgressionView: React.FC = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className={`text-lg font-semibold ${
          theme === 'dark' ? 'text-white' : 'text-slate-900'
        }`}>
          Multi-String LCS Progression
        </h4>
        <div className="flex items-center space-x-2">
          <button
            onClick={prevLayer}
            disabled={currentLayer === 0}
            className={`p-2 rounded-lg transition-all ${
              currentLayer === 0
                ? 'opacity-50 cursor-not-allowed'
                : theme === 'dark'
                  ? 'bg-slate-700 hover:bg-slate-600 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <span className={`text-sm px-3 ${
            theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
          }`}>
            {currentLayer + 1} / {layerData.length}
          </span>
          
          <button
            onClick={nextLayer}
            disabled={currentLayer === layerData.length - 1}
            className={`p-2 rounded-lg transition-all ${
              currentLayer === layerData.length - 1
                ? 'opacity-50 cursor-not-allowed'
                : theme === 'dark'
                  ? 'bg-slate-700 hover:bg-slate-600 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <button
            onClick={startAnimation}
            disabled={isAnimating}
            className={`p-2 rounded-lg transition-all ${
              theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                : 'bg-blue-500 hover:bg-blue-400 text-white'
            } ${isAnimating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentLayer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {layerData[currentLayer] && <MatrixVisualization layer={layerData[currentLayer]} />}
        </motion.div>
      </AnimatePresence>

      {/* Progress indicators */}
      <div className="flex justify-center space-x-2">
        {layerData.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentLayer(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentLayer
                ? theme === 'dark'
                  ? 'bg-blue-500'
                  : 'bg-blue-600'
                : theme === 'dark'
                  ? 'bg-slate-600'
                  : 'bg-slate-300'
            }`}
          />
        ))}
      </div>
    </div>
  );

  const ComparisonView: React.FC = () => (
    <div className="space-y-4">
      <h4 className={`text-lg font-semibold text-center mb-6 ${
        theme === 'dark' ? 'text-white' : 'text-slate-900'
      }`}>
        String Analysis & Common Characters
      </h4>
      
      <div className="grid gap-4">
        {strings.map((str, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-slate-700' : 'bg-slate-50'
            }`}
          >
            <div className={`text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
            }`}>
              String {index + 1}: {str}
            </div>
            <div className="flex flex-wrap gap-1">
              {str.split('').map((char, charIndex) => (
                <span
                  key={charIndex}
                  className={`px-2 py-1 rounded text-xs font-mono ${
                    lcsResult.includes(char)
                      ? theme === 'dark'
                        ? 'bg-green-600 text-white'
                        : 'bg-green-100 text-green-800'
                      : theme === 'dark'
                        ? 'bg-slate-600 text-slate-300'
                        : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {char}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {lcsResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg text-center ${
            theme === 'dark' 
              ? 'bg-gradient-to-r from-green-800 to-blue-800' 
              : 'bg-gradient-to-r from-green-100 to-blue-100'
          }`}
        >
          <div className={`text-lg font-bold ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Longest Common Subsequence
          </div>
          <div className={`text-2xl font-mono font-bold mt-2 ${
            theme === 'dark' ? 'text-green-400' : 'text-green-600'
          }`}>
            "{lcsResult}" (Length: {lcsResult.length})
          </div>
        </motion.div>
      )}
    </div>
  );

  return (
    <div className={`rounded-2xl backdrop-blur-sm ${
      theme === 'dark' ? 'bg-slate-800/60' : 'bg-white/80'
    } shadow-lg border border-slate-200/20`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200/20">
        <div>
          <h3 className={`text-base font-semibold flex items-center ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            <Layers className="h-4 w-4 mr-2" />
            Multi-String LCS Visualization
          </h3>
          <p className={`text-xs mt-1 ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
          }`}>
            {strings.length} strings • Progressive algorithm visualization
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* View mode selector */}
          <div className="flex rounded-lg overflow-hidden border border-slate-200/20">
            {[
              { mode: 'layers' as const, icon: Layers, label: 'Steps' },
              { mode: 'comparison' as const, icon: BarChart3, label: 'Analysis' }
            ].map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 text-xs flex items-center space-x-1 transition-all ${
                  viewMode === mode
                    ? theme === 'dark'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-500 text-white'
                    : theme === 'dark'
                      ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className="h-3 w-3" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-2 rounded-lg transition-all ${
              theme === 'dark'
                ? 'bg-slate-700 hover:bg-slate-600 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title={isExpanded ? "Minimize" : "Maximize"}
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={`p-4 ${isExpanded ? 'min-h-[70vh]' : 'min-h-[400px]'}`}>
        {viewMode === 'layers' && <ProgressionView />}
        {viewMode === 'comparison' && <ComparisonView />}
      </div>
    </div>
  );
};

export default MultiStringLCSVisualizer;

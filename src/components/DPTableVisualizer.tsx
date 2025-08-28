import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Minimize2 } from 'lucide-react';

interface DPTableVisualizerProps {
  dpTable: number[][];
  strings: string[];
  currentStep: { row: number; col: number; char?: string }[];
  theme: string;
  setCurrentStep: React.Dispatch<React.SetStateAction<{ row: number; col: number; char?: string }[]>>;
  lcsResult?: string;
}

const DPTableVisualizer: React.FC<DPTableVisualizerProps> = ({ dpTable = [[]], strings = ['', ''], currentStep, theme, setCurrentStep, lcsResult = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const renderPointer = (row: number, col: number) => {
    const isMatch = currentStep?.find(step => step.row === row && step.col === col)?.char;
    return isMatch ? (
      <div className="absolute top-1 right-1 flex items-start justify-end pointer-events-none">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      </div>
    ) : null;
  };

  return (
    <div className={`${isExpanded ? 'fixed inset-0 z-50 bg-black/80' : ''}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${
          isExpanded 
            ? 'fixed inset-4 bg-slate-900 rounded-2xl shadow-2xl' 
            : `p-4 rounded-2xl backdrop-blur-sm ${
                theme === 'dark' ? 'bg-slate-800/60' : 'bg-white/80'
              } shadow-lg border border-slate-200/20`
        }`}
      >
        {/* Header with maximize button */}
        <div className="flex items-center justify-between mb-3">
          <h3
            className={`text-base font-semibold ${
              theme === 'dark' || isExpanded ? 'text-white' : 'text-slate-900'
            }`}
          >
            Dynamic Programming Table
          </h3>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-1.5 rounded-md transition-all ${
              theme === 'dark' || isExpanded
                ? 'bg-slate-700 hover:bg-slate-600 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title={isExpanded ? "Minimize" : "Maximize"}
          >
            {isExpanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
          </button>
        </div>
        <div className={`${
          isExpanded 
            ? 'h-[calc(100vh-8rem)]' 
            : 'max-h-80'
        } overflow-auto mb-4`}>
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className={`p-1.5 border ${theme === 'dark' || isExpanded ? 'border-slate-600 text-white' : 'border-slate-300 text-slate-900'} text-xs`}></th>
                {["ε", ...strings[1]?.split("")].map((char, idx) => (
                  <th key={idx} className={`p-1.5 border ${theme === 'dark' || isExpanded ? 'border-slate-600 text-white' : 'border-slate-300 text-slate-900'} text-center text-xs font-mono`}>{char}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {["ε", ...strings[0]?.split("")].map((char1, i) => (
                <tr key={i}>
                  <th className={`p-1.5 border ${theme === 'dark' || isExpanded ? 'border-slate-600 text-white' : 'border-slate-300 text-slate-900'} text-center text-xs font-mono`}>{char1}</th>
                  {Array.from({ length: (dpTable[0]?.length || 0) }, (_, j) => (
                    <td
                      key={j}
                      className={`p-1.5 border text-center relative text-xs font-mono ${
                        theme === 'dark' || isExpanded ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    >
                      {typeof dpTable[i]?.[j] === 'number' ? dpTable[i][j] : ''}
                      {renderPointer(i, j)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>      {/* LCS Result Display */}
      {lcsResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl ${
            theme === 'dark' ? 'bg-gradient-to-r from-slate-700/80 to-slate-600/80' : 'bg-gradient-to-r from-blue-50 to-green-50'
          } border ${theme === 'dark' ? 'border-slate-500' : 'border-slate-200'}`}
        >
          <h4 className={`text-sm font-semibold mb-3 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            🎯 Longest Common Subsequence
          </h4>
          
          <div className={`p-3 rounded-lg text-center mb-3 ${
            theme === 'dark' ? 'bg-slate-800 border border-slate-600' : 'bg-white border border-slate-200'
          }`}>
            <div className={`text-lg font-mono font-bold tracking-wider ${
              theme === 'dark' ? 'text-green-400' : 'text-green-600'
            }`}>
              {lcsResult || 'No common subsequence'}
            </div>
            <div className={`text-xs mt-1 ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Length: {lcsResult.length}
            </div>
          </div>
          
          {strings.length === 2 && lcsResult && (
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className={`block text-xs font-medium mb-2 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  String 1: {strings[0]}
                </label>
                <div className="flex flex-wrap gap-1">
                  {strings[0].split('').map((char, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-1 rounded text-xs font-mono ${
                        lcsResult.includes(char)
                          ? theme === 'dark'
                            ? 'bg-green-900/50 text-green-300 border border-green-600'
                            : 'bg-green-100 text-green-700 border border-green-300'
                          : theme === 'dark'
                            ? 'bg-slate-700 text-slate-400 border border-slate-600'
                            : 'bg-slate-100 text-slate-600 border border-slate-300'
                      }`}
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <label className={`block text-xs font-medium mb-2 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  String 2: {strings[1]}
                </label>
                <div className="flex flex-wrap gap-1">
                  {strings[1].split('').map((char, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-1 rounded text-xs font-mono ${
                        lcsResult.includes(char)
                          ? theme === 'dark'
                            ? 'bg-green-900/50 text-green-300 border border-green-600'
                            : 'bg-green-100 text-green-700 border border-green-300'
                          : theme === 'dark'
                            ? 'bg-slate-700 text-slate-400 border border-slate-600'
                            : 'bg-slate-100 text-slate-600 border border-slate-300'
                      }`}
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
      
      {/* Additional LCS Analysis */}
      {lcsResult && strings.length === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-4 rounded-xl ${
            theme === 'dark' ? 'bg-slate-700/50' : 'bg-slate-50'
          }`}
        >
          <h5 className={`text-xs font-semibold mb-3 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            📈 Algorithm Analysis
          </h5>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div className={`p-2 rounded-lg ${
              theme === 'dark' ? 'bg-slate-800/50' : 'bg-white/50'
            }`}>
              <div className={`text-sm font-bold ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`}>
                O({strings[0]?.length || 0}×{strings[1]?.length || 0})
              </div>
              <div className={`text-xs ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Time Complexity
              </div>
            </div>
            
            <div className={`p-2 rounded-lg ${
              theme === 'dark' ? 'bg-slate-800/50' : 'bg-white/50'
            }`}>
              <div className={`text-sm font-bold ${
                theme === 'dark' ? 'text-green-400' : 'text-green-600'
              }`}>
                {Math.round((lcsResult.length / Math.max(strings[0]?.length || 1, strings[1]?.length || 1)) * 100)}%
              </div>
              <div className={`text-xs ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Similarity
              </div>
            </div>
            
            <div className={`p-2 rounded-lg ${
              theme === 'dark' ? 'bg-slate-800/50' : 'bg-white/50'
            }`}>
              <div className={`text-sm font-bold ${
                theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
              }`}>
                {dpTable.length}×{dpTable[0]?.length || 0}
              </div>
              <div className={`text-xs ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                DP Table Size
              </div>
            </div>
            
            <div className={`p-2 rounded-lg ${
              theme === 'dark' ? 'bg-slate-800/50' : 'bg-white/50'
            }`}>
              <div className={`text-sm font-bold ${
                theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
              }`}>
                {dpTable.length * (dpTable[0]?.length || 0)}
              </div>
              <div className={`text-xs ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Total Cells
              </div>
            </div>
          </div>
        </motion.div>
      )}
      </motion.div>
    </div>
  );
};

export default React.memo(DPTableVisualizer);

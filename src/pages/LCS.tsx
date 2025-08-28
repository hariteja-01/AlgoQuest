import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Plus, Minus, Settings, BarChart3 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LCSEngine } from '../logic/lcs/engine';
import { generateLCSCode } from '../logic/lcs/codegen';
import CodeDisplay from '../components/CodeDisplay';
import DPTableVisualizer from '../components/DPTableVisualizer';

const StringInputs = React.memo(({ strings, inputRefs, updateString, handleKeyDown, removeString, addString, isAnimating, theme }: {
  strings: string[];
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  updateString: (index: number, value: string) => void;
  handleKeyDown: (index: number, event: React.KeyboardEvent<HTMLInputElement>) => void;
  removeString: (index: number) => void;
  addString: () => void;
  isAnimating: boolean;
  theme: string;
}) => (
  <div className={`p-4 rounded-2xl backdrop-blur-sm ${
    theme === 'dark' ? 'bg-slate-800/60' : 'bg-white/80'
  } shadow-lg border border-slate-200/20`}>
    <h3 className={`text-base font-semibold mb-3 flex items-center ${
      theme === 'dark' ? 'text-white' : 'text-slate-900'
    }`}>
      <Settings className="h-4 w-4 mr-2" />
      Input Strings ({strings.length})
    </h3>
    <div className="space-y-3">
      {strings.map((_, index) => (
        <div key={index} className="flex items-center gap-2">
          <label className={`text-xs font-medium w-8 flex-shrink-0 ${
            theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
          }`}>
            S{index + 1}:
          </label>
          <input
            ref={el => (inputRefs.current[index] = el)}
            value={strings[index]}
            onChange={e => updateString(index, e.target.value)}
            onKeyDown={e => handleKeyDown(index, e)}
            autoComplete="off"
            style={{ textTransform: 'uppercase' }}
            className={`flex-1 min-w-0 px-2 py-1.5 rounded-md border text-xs font-mono transition-all duration-200 ${
              theme === 'dark'
                ? 'bg-slate-700 border-slate-600 text-slate-200 focus:border-blue-500'
                : 'bg-white border-slate-300 text-slate-700 focus:border-blue-500'
            } focus:outline-none focus:ring-1 focus:ring-blue-500/20`}
            placeholder={`String ${index + 1}`}
          />
          {strings.length > 2 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => removeString(index)}
              className={`p-1.5 rounded-md transition-all duration-200 flex-shrink-0 ${
                theme === 'dark'
                  ? 'text-red-400 hover:bg-red-900/20'
                  : 'text-red-500 hover:bg-red-50'
              }`}
              disabled={isAnimating}
            >
              <Minus className="h-3 w-3" />
            </motion.button>
          )}
        </div>
      ))}
      {strings.length < 4 && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={addString}
          disabled={isAnimating}
          className={`w-full px-3 py-2 rounded-md border-2 border-dashed transition-all duration-200 flex items-center justify-center space-x-2 text-xs ${
            theme === 'dark'
              ? 'border-slate-600 text-slate-400 hover:border-slate-500 hover:text-slate-300'
              : 'border-slate-300 text-slate-500 hover:border-slate-400 hover:text-slate-600'
          }`}
        >
          <Plus className="h-3 w-3" />
          <span>Add String</span>
        </motion.button>
      )}
    </div>
  </div>
));

const LCS: React.FC = () => {
  const { theme, language } = useApp();
  const [strings, setStrings] = useState(['', '']);
  const [dpTable, setDpTable] = useState<number[][]>([[]]);
  const [currentStep, setCurrentStep] = useState<{row: number, col: number, char?: string}[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [spaceOptimized, setSpaceOptimized] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(500);
  const [lcsResult, setLcsResult] = useState<string>('');
  const [currentAnimationStep, setCurrentAnimationStep] = useState<number>(0);
  const [currentSlice, setCurrentSlice] = useState(0);
  const engine = new LCSEngine(strings);
  const animationRef = useRef<number>(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const addString = () => {
    if (strings.length < 4) {
      setStrings([...strings, `STR${strings.length + 1}`]);
    }
  };

  const removeString = (index: number) => {
    if (strings.length > 2) {
      const newStrings = strings.filter((_, i) => i !== index);
      setStrings(newStrings);
    }
  };

  const validateStrings = () => {
    return strings.length >= 2 && strings.every(str => str.length > 0);
  };

  useEffect(() => {
    inputRefs.current.forEach((input) => {
      if (input) {
        input.addEventListener('focus', () => {
          input.setSelectionRange(input.value.length, input.value.length);
        });
      }
    });
  }, [strings]);

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (index < strings.length - 1) {
        inputRefs.current[index + 1]?.focus();
      } else {
        solveLCS();
      }
    }
  };

  const updateString = useCallback((index: number, value: string) => {
    const upperValue = value.toUpperCase();
    if (strings[index] !== upperValue) {
      const newStrings = [...strings];
      newStrings[index] = upperValue;
      setStrings(newStrings);
    }
  }, [strings]);

  const solveLCS = async () => {
    if (strings.length < 2 || strings.some(str => str.length === 0)) {
      setDpTable([[]]);
      setCurrentStep([]);
      return;
    }

    if (!validateStrings()) {
      alert('Please provide at least 2 valid strings.');
      return;
    }

    setIsAnimating(true);
    animationRef.current = 0;

    if (strings.length === 2) {
      const result = engine.solveTwoStrings(strings[0], strings[1]);
      setDpTable(result.dpTable);
      setLcsResult(result.lcs);

      // Animate filling the table
      const totalSteps = (strings[0].length + 1) * (strings[1].length + 1);
      const animateStep = () => {
        if (animationRef.current < totalSteps) {
          setCurrentAnimationStep(animationRef.current);
          animationRef.current++;
          requestAnimationFrame(animateStep);
        } else {
          setCurrentStep(result.path);
          setIsAnimating(false);
        }
      };

      requestAnimationFrame(animateStep);
    } else {
      const result = engine.solveMultipleStrings(strings);
      setDpTable(result.dpTable);
      setLcsResult(result.lcs);
      setCurrentStep([]);
      setIsAnimating(false);
    }
  };

  const reset = () => {
    setDpTable([]);
    setLcsResult('');
    setCurrentStep([]);
    setIsAnimating(false);
  };

  const Controls: React.FC = () => (
    <div className={`p-4 rounded-2xl backdrop-blur-sm ${
      theme === 'dark' ? 'bg-slate-800/60' : 'bg-white/80'
    } shadow-lg border border-slate-200/20`}>
      <h3 className={`text-base font-semibold mb-3 ${
        theme === 'dark' ? 'text-white' : 'text-slate-900'
      }`}>
        Controls
      </h3>
      
      <div className="space-y-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={solveLCS}
          disabled={isAnimating || strings.some(s => s.length === 0)}
          className="w-full px-3 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium disabled:opacity-50 flex items-center justify-center space-x-2 text-sm"
        >
          {isAnimating ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          <span>{isAnimating ? 'Computing...' : 'Solve LCS'}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={reset}
          className={`w-full px-3 py-2.5 rounded-lg font-medium border transition-all duration-200 flex items-center justify-center space-x-2 text-sm ${
            theme === 'dark'
              ? 'border-slate-600 text-slate-300 hover:bg-slate-700'
              : 'border-slate-300 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset</span>
        </motion.button>

        <div className="space-y-2 pt-2 border-t border-slate-200/20">
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Animation Speed: {animationSpeed}ms
            </label>
            <input
              type="range"
              min="100"
              max="1000"
              step="100"
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
              className="w-full"
              disabled={isAnimating}
            />
          </div>

          <div className="flex items-center space-x-3 mt-4">
            <input
              type="checkbox"
              id="space-optimized"
              checked={spaceOptimized}
              onChange={(e) => setSpaceOptimized(e.target.checked)}
              className="rounded"
              disabled={isAnimating}
            />
            <label htmlFor="space-optimized" className={`text-sm ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Space-optimized O(min(m,n))
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-4">
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
            LCS Visualizer
          </h1>
          <p className={`text-lg ${
            theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Dynamic programming visualization for Longest Common Subsequence
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left Panel - Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-4"
          >
            <StringInputs
              strings={strings}
              inputRefs={inputRefs}
              updateString={updateString}
              handleKeyDown={handleKeyDown}
              removeString={removeString}
              addString={addString}
              isAnimating={isAnimating}
              theme={theme}
            />
            <Controls />
          </motion.div>

          {/* Center - Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-3"
          >
            <DPTableVisualizer
              dpTable={strings.length > 2 ? dpTable[currentSlice] : dpTable}
              strings={strings}
              currentStep={currentStep}
              theme={theme}
              setCurrentStep={setCurrentStep}
              lcsResult={lcsResult}
            />
          </motion.div>
        </div>

        {/* Code Display - Full Width Below */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <CodeDisplay
            code={generateLCSCode(strings, language, spaceOptimized)}
            language={language}
            title={`LCS Solution (${strings.length} strings)${spaceOptimized ? ' - Space Optimized' : ''}`}
            className="min-h-[400px]"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default LCS;
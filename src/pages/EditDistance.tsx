import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, RotateCcw, Sparkles, Zap, PenTool } from 'lucide-react';
import { useApp } from '../context/AppContext';
import CodeDisplay from '../components/CodeDisplay';
import { EditDistanceEngine, EditDistanceStep } from '../logic/editdistance/engine';
import { generateEditDistanceCode } from '../logic/editdistance/codegen';

const EditDistance: React.FC = () => {
  const { theme, language } = useApp();
  const dark = theme === 'dark';

  const [word1, setWord1] = useState('horse');
  const [word2, setWord2] = useState('ros');
  const [steps, setSteps] = useState<EditDistanceStep[]>([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const engine = useMemo(() => new EditDistanceEngine(), []);

  const run = useCallback(() => {
    if (word1 && word2) {
      setSteps(engine.solve(word1, word2));
      setStepIdx(0);
      setPlaying(false);
    }
  }, [engine, word1, word2]);

  useEffect(() => { run(); }, [run]);

  useEffect(() => {
    if (playing && stepIdx < steps.length - 1) {
      timerRef.current = setTimeout(() => setStepIdx(i => i + 1), speed);
    } else if (stepIdx >= steps.length - 1) setPlaying(false);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [playing, stepIdx, steps.length, speed]);

  const current = steps[stepIdx] || steps[0];
  const dp = current?.dp ?? [];
  const code = generateEditDistanceCode(language);

  return (
    <div className={`min-h-screen px-4 py-6 sm:px-6 lg:px-8 ${dark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="mx-auto max-w-7xl flex flex-col gap-5">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl border p-5 shadow-xl backdrop-blur ${dark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/85'}`}>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-orange-400">
              <PenTool className="h-4 w-4" /> Edit Distance (LC #72)
            </div>
            <h1 className={`text-2xl font-black tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>
              Levenshtein Distance Visualizer
            </h1>
          </div>
          <div className="mt-4 flex gap-4 flex-wrap items-end">
            <label className="space-y-1 flex-1">
              <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Word 1</span>
              <input value={word1} onChange={e => setWord1(e.target.value.toLowerCase())}
                className={`w-full rounded-xl border px-3 py-2 text-sm font-mono ${dark ? 'border-white/10 bg-slate-950/70 text-white' : 'border-slate-200 bg-white text-slate-900'}`} />
            </label>
            <label className="space-y-1 flex-1">
              <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Word 2</span>
              <input value={word2} onChange={e => setWord2(e.target.value.toLowerCase())}
                className={`w-full rounded-xl border px-3 py-2 text-sm font-mono ${dark ? 'border-white/10 bg-slate-950/70 text-white' : 'border-slate-200 bg-white text-slate-900'}`} />
            </label>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr,320px] gap-5">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`rounded-3xl border p-5 shadow-xl ${dark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/85'}`}>
            {/* DP Table */}
            {dp.length > 0 && (
              <div className={`rounded-2xl border p-3 overflow-auto ${dark ? 'border-white/5 bg-slate-950/40' : 'border-slate-100 bg-slate-50'}`}>
                <table className="text-[11px] font-mono mx-auto">
                  <thead><tr>
                    <th className={`px-2 py-1 ${dark ? 'text-slate-500' : 'text-slate-400'}`}></th>
                    <th className={`px-2 py-1 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>∅</th>
                    {word2.split('').map((c, j) => (
                      <th key={j} className={`px-2 py-1 font-bold ${dark ? 'text-orange-300' : 'text-orange-600'}`}>{c}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {dp.map((row, r) => (
                      <tr key={r}>
                        <td className={`px-2 py-1 font-bold ${dark ? 'text-orange-300' : 'text-orange-600'}`}>
                          {r === 0 ? '∅' : word1[r - 1]}
                        </td>
                        {row.map((val, c) => (
                          <td key={c} className={`px-2 py-1.5 text-center border ${
                            current?.i === r && c === row.length - 1
                              ? 'bg-orange-500/20 border-orange-500 text-orange-300 font-bold'
                              : r === dp.length - 1 && c === row.length - 1 && current?.type === 'complete'
                              ? 'bg-green-500/20 border-green-500 text-green-300 font-black'
                              : dark ? 'border-slate-700/50 text-slate-300' : 'border-slate-200 text-slate-600'
                          }`}>{val}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Operations */}
            {current?.operations && current.operations.length > 0 && (
              <div className="mt-4">
                <h4 className={`text-xs font-semibold uppercase tracking-widest mb-2 ${dark ? 'text-orange-400' : 'text-orange-600'}`}>Operations</h4>
                <div className="flex gap-1.5 flex-wrap">
                  {current.operations.map((op, i) => {
                    const isEdit = !op.startsWith('Keep');
                    return (
                      <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.05 }}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold ${
                          isEdit ? (dark ? 'bg-orange-900/40 text-orange-300 border border-orange-700/30' : 'bg-orange-100 text-orange-700 border border-orange-200')
                          : dark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                        {op}
                      </motion.span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center gap-3 mt-4">
              <button onClick={() => { setStepIdx(0); setPlaying(false); }}
                className={`p-2 rounded-xl ${dark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                <RotateCcw className="h-4 w-4" />
              </button>
              <button onClick={() => setPlaying(!playing)}
                className="p-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              <button onClick={() => setStepIdx(i => Math.min(steps.length - 1, i + 1))}
                className={`p-2 rounded-xl ${dark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                <SkipForward className="h-4 w-4" />
              </button>
              <div className="flex-1" />
              <input type="range" min={100} max={1200} step={100} value={1300 - speed}
                onChange={e => setSpeed(1300 - Number(e.target.value))} className="w-24 accent-orange-500" />
              <span className={`text-xs font-mono ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{stepIdx + 1}/{steps.length}</span>
            </div>
            <div className={`h-1.5 rounded-full mt-3 ${dark ? 'bg-slate-800' : 'bg-slate-200'}`}>
              <motion.div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500"
                animate={{ width: `${steps.length > 1 ? (stepIdx / (steps.length - 1)) * 100 : 0}%` }} />
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={stepIdx} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className={`mt-3 p-3 rounded-xl text-sm ${dark ? 'bg-orange-950/30 text-orange-200 border border-orange-800/30' : 'bg-orange-50 text-orange-800 border border-orange-200'}`}>
                {current?.explanation}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className={`rounded-2xl border p-4 ${dark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/85'}`}>
              <h3 className={`text-xs font-semibold uppercase tracking-[0.2em] mb-3 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                <Zap className="h-3 w-3 inline mr-1" /> Info
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span className={`text-xs ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Word 1</span><span className={`text-xs font-mono font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>"{word1}"</span></div>
                <div className="flex justify-between"><span className={`text-xs ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Word 2</span><span className={`text-xs font-mono font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>"{word2}"</span></div>
                <div className="flex justify-between"><span className={`text-xs ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Result</span><span className={`text-xs font-bold ${dark ? 'text-orange-300' : 'text-orange-600'}`}>{current?.type === 'complete' ? dp[word1.length]?.[word2.length] ?? '...' : '...'}</span></div>
              </div>
            </motion.div>

            <div className={`rounded-2xl border p-4 ${dark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/85'}`}>
              <h3 className={`text-xs font-semibold uppercase tracking-[0.2em] mb-2 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                <Sparkles className="h-3 w-3 inline mr-1" /> Recurrence
              </h3>
              <p className={`text-xs leading-relaxed font-mono ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                if s1[i] == s2[j]: dp[i][j] = dp[i-1][j-1]
              </p>
              <p className={`text-xs leading-relaxed font-mono mt-1 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                else: 1 + min(insert, delete, replace)
              </p>
            </div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <CodeDisplay code={code} language={language} title="Edit Distance — O(mn) DP" currentLine={current?.highlightLine} />
        </motion.div>
      </div>
    </div>
  );
};

export default EditDistance;

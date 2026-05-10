import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, RotateCcw, Sparkles, Zap, SlidersHorizontal } from 'lucide-react';
import { useApp } from '../context/AppContext';
import CodeDisplay from '../components/CodeDisplay';
import { SlidingWindowEngine, SlidingWindowStep } from '../logic/slidingwindow/engine';
import { generateSlidingWindowCode } from '../logic/slidingwindow/codegen';

const SlidingWindow: React.FC = () => {
  const { theme, language } = useApp();
  const dark = theme === 'dark';

  const [nums, setNums] = useState([1, 3, -1, -3, 5, 3, 6, 7]);
  const [k, setK] = useState(3);
  const [steps, setSteps] = useState<SlidingWindowStep[]>([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const engine = useMemo(() => new SlidingWindowEngine(), []);

  const run = useCallback(() => {
    setSteps(engine.solve(nums, k));
    setStepIdx(0);
    setPlaying(false);
  }, [engine, nums, k]);

  useEffect(() => { run(); }, [run]);

  useEffect(() => {
    if (playing && stepIdx < steps.length - 1) {
      timerRef.current = setTimeout(() => setStepIdx(i => i + 1), speed);
    } else if (stepIdx >= steps.length - 1) setPlaying(false);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [playing, stepIdx, steps.length, speed]);

  const current = steps[stepIdx] || steps[0];
  const maxVal = Math.max(...nums.map(Math.abs), 1);
  const code = generateSlidingWindowCode(language);

  return (
    <div className={`min-h-screen px-4 py-6 sm:px-6 lg:px-8 ${dark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="mx-auto max-w-7xl flex flex-col gap-5">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl border p-5 shadow-xl backdrop-blur ${dark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/85'}`}>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-violet-400">
              <SlidersHorizontal className="h-4 w-4" /> Sliding Window Maximum
            </div>
            <h1 className={`text-2xl font-black tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>
              Monotonic Deque Visualizer
            </h1>
          </div>
          <div className="mt-4 flex gap-4 flex-wrap items-end">
            <label className="space-y-1">
              <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Array</span>
              <input value={nums.join(', ')} onChange={e => { const a = e.target.value.split(',').map(Number).filter(n => !isNaN(n)); if (a.length > 0) setNums(a); }}
                className={`w-60 rounded-xl border px-3 py-2 text-sm font-mono ${dark ? 'border-white/10 bg-slate-950/70 text-white' : 'border-slate-200 bg-white text-slate-900'}`} />
            </label>
            <label className="space-y-1">
              <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Window k</span>
              <input type="number" min={1} max={nums.length} value={k} onChange={e => setK(Math.max(1, Math.min(nums.length, Number(e.target.value))))}
                className={`w-16 rounded-xl border px-3 py-2 text-sm font-bold ${dark ? 'border-white/10 bg-slate-950/70 text-white' : 'border-slate-200 bg-white text-slate-900'}`} />
            </label>
            <button onClick={() => { const g = SlidingWindowEngine.generate(12); setNums(g.nums); setK(g.k); }}
              className={`px-3 py-2 rounded-xl text-xs font-semibold ${dark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
              Random
            </button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr,320px] gap-5">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`rounded-3xl border p-5 shadow-xl ${dark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/85'}`}>
            {/* Bar Chart */}
            <div className={`rounded-2xl border p-4 ${dark ? 'border-white/5 bg-slate-950/60' : 'border-slate-100 bg-slate-50'}`}>
              <div className="flex items-end justify-center gap-2 min-h-[220px] pb-4 relative">
                {/* Window highlight */}
                {current && current.windowStart !== undefined && (
                  <motion.div
                    className="absolute bottom-0 rounded-xl border-2 border-violet-400/50 bg-violet-500/10"
                    animate={{
                      left: `${(current.windowStart / nums.length) * 100}%`,
                      width: `${(Math.min(k, nums.length - current.windowStart) / nums.length) * 100}%`,
                      height: '100%',
                    }}
                    transition={{ type: 'spring', stiffness: 200 }} />
                )}

                {nums.map((n, i) => {
                  const barH = Math.max(8, (Math.abs(n) / maxVal) * 180);
                  const inWindow = current && i >= current.windowStart && i <= current.windowEnd;
                  const inDeque = current?.deque?.includes(i);

                  return (
                    <div key={i} className="flex flex-col items-center gap-1 relative z-10" style={{ minWidth: '32px', flex: 1 }}>
                      <motion.div
                        animate={{ height: barH }}
                        className={`w-full rounded-t-md ${
                          inDeque ? 'bg-gradient-to-t from-violet-600 to-violet-400 shadow-lg shadow-violet-500/30' :
                          inWindow ? (dark ? 'bg-gradient-to-t from-indigo-700 to-indigo-500' : 'bg-gradient-to-t from-indigo-300 to-indigo-200') :
                          dark ? 'bg-slate-700' : 'bg-slate-300'}`}>
                        <div className={`text-center text-[11px] font-bold -mt-5 ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{n}</div>
                      </motion.div>
                      <div className={`text-[9px] ${dark ? 'text-slate-600' : 'text-slate-400'}`}>{i}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Result array */}
            {current?.result && current.result.length > 0 && (
              <div className="flex gap-1.5 mt-3 flex-wrap">
                <span className={`text-xs font-semibold ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Result:</span>
                {current.result.map((v, i) => (
                  <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className={`px-2 py-0.5 rounded-lg text-xs font-bold ${dark ? 'bg-violet-900/40 text-violet-300' : 'bg-violet-100 text-violet-700'}`}>
                    {v}
                  </motion.span>
                ))}
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center gap-3 mt-4">
              <button onClick={() => { setStepIdx(0); setPlaying(false); }}
                className={`p-2 rounded-xl ${dark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                <RotateCcw className="h-4 w-4" />
              </button>
              <button onClick={() => setPlaying(!playing)}
                className="p-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg">
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              <button onClick={() => setStepIdx(i => Math.min(steps.length - 1, i + 1))}
                className={`p-2 rounded-xl ${dark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                <SkipForward className="h-4 w-4" />
              </button>
              <div className="flex-1" />
              <input type="range" min={100} max={1200} step={100} value={1300 - speed}
                onChange={e => setSpeed(1300 - Number(e.target.value))} className="w-24 accent-violet-500" />
              <span className={`text-xs font-mono ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{stepIdx + 1}/{steps.length}</span>
            </div>
            <div className={`h-1.5 rounded-full mt-3 ${dark ? 'bg-slate-800' : 'bg-slate-200'}`}>
              <motion.div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500"
                animate={{ width: `${steps.length > 1 ? (stepIdx / (steps.length - 1)) * 100 : 0}%` }} />
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={stepIdx} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className={`mt-3 p-3 rounded-xl text-sm ${dark ? 'bg-violet-950/30 text-violet-200 border border-violet-800/30' : 'bg-violet-50 text-violet-800 border border-violet-200'}`}>
                {current?.explanation}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            {/* Deque State */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className={`rounded-2xl border p-4 ${dark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/85'}`}>
              <h3 className={`text-xs font-semibold uppercase tracking-[0.2em] mb-2 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                Deque State
              </h3>
              <div className="flex gap-1 flex-wrap">
                {(current?.deque ?? []).map((idx, i) => (
                  <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className={`px-2 py-1 rounded-lg text-xs font-bold ${dark ? 'bg-violet-900/40 text-violet-300 border border-violet-700/30' : 'bg-violet-50 text-violet-700 border border-violet-200'}`}>
                    [{idx}]={nums[idx]}
                  </motion.div>
                ))}
                {(!current?.deque || current.deque.length === 0) && (
                  <span className={`text-xs ${dark ? 'text-slate-600' : 'text-slate-400'}`}>Empty</span>
                )}
              </div>
            </motion.div>

            <div className={`rounded-2xl border p-4 ${dark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/85'}`}>
              <h3 className={`text-xs font-semibold uppercase tracking-[0.2em] mb-2 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                <Sparkles className="h-3 w-3 inline mr-1" /> How It Works
              </h3>
              <p className={`text-xs leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                The deque stores indices in decreasing order of values. Front = current window max. When sliding, remove expired front elements and smaller back elements. O(n) total amortized!
              </p>
            </div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <CodeDisplay code={code} language={language} title="Sliding Window Maximum — Monotonic Deque" currentLine={current?.highlightLine} />
        </motion.div>
      </div>
    </div>
  );
};

export default SlidingWindow;

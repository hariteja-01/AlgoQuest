import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, RotateCcw, Sparkles, Zap, Target } from 'lucide-react';
import { useApp } from '../context/AppContext';
import CodeDisplay from '../components/CodeDisplay';
import { KthLargestEngine, KthLargestStep } from '../logic/kthlargest/engine';
import { generateKthLargestCode } from '../logic/kthlargest/codegen';

const KthLargest: React.FC = () => {
  const { theme, language } = useApp();
  const dark = theme === 'dark';

  const [nums, setNums] = useState([3, 2, 1, 5, 6, 4]);
  const [k, setK] = useState(2);
  const [steps, setSteps] = useState<KthLargestStep[]>([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const engine = useMemo(() => new KthLargestEngine(), []);

  const run = useCallback(() => {
    setSteps(engine.solve(nums, Math.min(k, nums.length)));
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
  const displayNums = current?.nums ?? nums;
  const maxVal = Math.max(...displayNums, 1);
  const code = generateKthLargestCode(nums, k, language);

  return (
    <div className={`min-h-screen px-4 py-6 sm:px-6 lg:px-8 ${dark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="mx-auto max-w-7xl flex flex-col gap-5">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl border p-5 shadow-xl backdrop-blur ${dark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/85'}`}>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-lime-400">
              <Target className="h-4 w-4" /> Kth Largest Element (LC #215)
            </div>
            <h1 className={`text-2xl font-black tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>
              QuickSelect Visualizer
            </h1>
          </div>
          <div className="mt-4 flex gap-4 flex-wrap items-end">
            <label className="space-y-1 flex-1">
              <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Array</span>
              <input value={nums.join(', ')} onChange={e => { const a = e.target.value.split(',').map(Number).filter(n => !isNaN(n)); if (a.length > 0) setNums(a); }}
                className={`w-full rounded-xl border px-3 py-2 text-sm font-mono ${dark ? 'border-white/10 bg-slate-950/70 text-white' : 'border-slate-200 bg-white text-slate-900'}`} />
            </label>
            <label className="space-y-1">
              <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${dark ? 'text-slate-400' : 'text-slate-500'}`}>K</span>
              <input type="number" min={1} max={nums.length} value={k} onChange={e => setK(Math.max(1, Math.min(nums.length, Number(e.target.value))))}
                className={`w-16 rounded-xl border px-3 py-2 text-sm font-bold ${dark ? 'border-white/10 bg-slate-950/70 text-white' : 'border-slate-200 bg-white text-slate-900'}`} />
            </label>
            <button onClick={() => { setNums(KthLargestEngine.generate(10)); setK(3); }}
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
              <div className="flex items-end justify-center gap-2 min-h-[240px] pb-4 relative">
                {/* Partition region highlight */}
                {current && current.left >= 0 && current.right >= 0 && (
                  <motion.div
                    className="absolute bottom-0 rounded-xl border-2 border-lime-400/30 bg-lime-500/5"
                    animate={{
                      left: `${(current.left / displayNums.length) * 100}%`,
                      width: `${((current.right - current.left + 1) / displayNums.length) * 100}%`,
                      height: '100%',
                    }} />
                )}

                {displayNums.map((n, i) => {
                  const barH = Math.max(12, (n / maxVal) * 200);
                  const isPivot = current?.highlightIndices?.includes(i);
                  const inRange = current && i >= current.left && i <= current.right;

                  return (
                    <div key={i} className="flex flex-col items-center gap-1 relative z-10" style={{ minWidth: '28px', flex: 1 }}>
                      <motion.div
                        animate={{ height: barH }}
                        className={`w-full rounded-t-md ${
                          isPivot ? 'bg-gradient-to-t from-lime-500 to-green-400 shadow-lg shadow-lime-500/30 ring-2 ring-lime-400' :
                          inRange ? (dark ? 'bg-gradient-to-t from-lime-800 to-lime-600' : 'bg-gradient-to-t from-lime-300 to-lime-200') :
                          dark ? 'bg-slate-700' : 'bg-slate-300'}`}>
                        <div className={`text-center text-[11px] font-bold -mt-5 ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{n}</div>
                      </motion.div>
                      <div className={`text-[9px] ${dark ? 'text-slate-600' : 'text-slate-400'}`}>{i}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 mt-4">
              <button onClick={() => { setStepIdx(0); setPlaying(false); run(); }}
                className={`p-2 rounded-xl ${dark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                <RotateCcw className="h-4 w-4" />
              </button>
              <button onClick={() => setPlaying(!playing)}
                className="p-2.5 rounded-xl bg-gradient-to-r from-lime-500 to-green-500 text-white shadow-lg">
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              <button onClick={() => setStepIdx(i => Math.min(steps.length - 1, i + 1))}
                className={`p-2 rounded-xl ${dark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                <SkipForward className="h-4 w-4" />
              </button>
              <div className="flex-1" />
              <input type="range" min={100} max={1500} step={100} value={1600 - speed}
                onChange={e => setSpeed(1600 - Number(e.target.value))} className="w-24 accent-lime-500" />
              <span className={`text-xs font-mono ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{stepIdx + 1}/{steps.length}</span>
            </div>
            <div className={`h-1.5 rounded-full mt-3 ${dark ? 'bg-slate-800' : 'bg-slate-200'}`}>
              <motion.div className="h-full rounded-full bg-gradient-to-r from-lime-500 to-green-500"
                animate={{ width: `${steps.length > 1 ? (stepIdx / (steps.length - 1)) * 100 : 0}%` }} />
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={stepIdx} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className={`mt-3 p-3 rounded-xl text-sm ${dark ? 'bg-lime-950/30 text-lime-200 border border-lime-800/30' : 'bg-lime-50 text-lime-800 border border-lime-200'}`}>
                {current?.explanation}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className={`rounded-2xl border p-4 ${dark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/85'}`}>
              <h3 className={`text-xs font-semibold uppercase tracking-[0.2em] mb-3 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                <Zap className="h-3 w-3 inline mr-1" /> Stats
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span className={`text-xs ${dark ? 'text-slate-500' : 'text-slate-400'}`}>K</span><span className={`text-xs font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>{k}</span></div>
                <div className="flex justify-between"><span className={`text-xs ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Array Size</span><span className={`text-xs font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>{nums.length}</span></div>
                <div className="flex justify-between"><span className={`text-xs ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Comparisons</span><span className={`text-xs font-bold ${dark ? 'text-lime-300' : 'text-lime-600'}`}>{current?.comparisons ?? 0}</span></div>
                <div className="flex justify-between"><span className={`text-xs ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Result</span><span className={`text-xs font-bold ${dark ? 'text-lime-300' : 'text-lime-600'}`}>{current?.result || '...'}</span></div>
              </div>
            </motion.div>

            <div className={`rounded-2xl border p-4 ${dark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/85'}`}>
              <h3 className={`text-xs font-semibold uppercase tracking-[0.2em] mb-2 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                <Sparkles className="h-3 w-3 inline mr-1" /> QuickSelect
              </h3>
              <p className={`text-xs leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                Partition array around a pivot. If pivot lands at position (n-k), that's the answer. Otherwise, recurse into the relevant half. Expected O(n) time — no need to fully sort!
              </p>
            </div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <CodeDisplay code={code} language={language} title="Kth Largest — QuickSelect" currentLine={current?.highlightLine} />
        </motion.div>
      </div>
    </div>
  );
};

export default KthLargest;

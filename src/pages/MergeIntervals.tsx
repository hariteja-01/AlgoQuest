import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, RotateCcw, Sparkles, Zap, GitMerge } from 'lucide-react';
import { useApp } from '../context/AppContext';
import CodeDisplay from '../components/CodeDisplay';
import { MergeIntervalsEngine, MergeStep } from '../logic/mergeintervals/engine';
import { generateMergeIntervalsCode } from '../logic/mergeintervals/codegen';

const PRESETS = [
  { key: 'random' as const, label: 'Random' },
  { key: 'overlapping' as const, label: 'Overlapping' },
  { key: 'disjoint' as const, label: 'Disjoint' },
  { key: 'nested' as const, label: 'Nested' },
];

const MergeIntervals: React.FC = () => {
  const { theme, language } = useApp();
  const dark = theme === 'dark';

  const [intervals, setIntervals] = useState(() => MergeIntervalsEngine.generate('overlapping', 7));
  const [steps, setSteps] = useState<MergeStep[]>([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const run = useCallback(() => {
    const engine = new MergeIntervalsEngine();
    setSteps(engine.solve(intervals));
    setStepIdx(0);
    setPlaying(false);
  }, [intervals]);

  useEffect(() => { run(); }, [run]);

  useEffect(() => {
    if (playing && stepIdx < steps.length - 1) {
      timerRef.current = setTimeout(() => setStepIdx(i => i + 1), speed);
    } else if (stepIdx >= steps.length - 1) setPlaying(false);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [playing, stepIdx, steps.length, speed]);

  const current = steps[stepIdx] || steps[0];
  const displayIntervals = current?.intervals ?? intervals;
  const merged = current?.merged ?? [];
  const maxVal = Math.max(...displayIntervals.flat(), ...merged.flat(), 1);
  const code = generateMergeIntervalsCode(language);

  return (
    <div className={`min-h-screen px-4 py-6 sm:px-6 lg:px-8 ${dark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="mx-auto max-w-7xl flex flex-col gap-5">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl border p-5 shadow-xl backdrop-blur ${dark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/85'}`}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-400">
                <GitMerge className="h-4 w-4" /> Merge Intervals
              </div>
              <h1 className={`text-2xl font-black tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>
                Interval Timeline Merger
              </h1>
            </div>
            <div className="flex gap-2 flex-wrap">
              {PRESETS.map(p => (
                <button key={p.key} onClick={() => setIntervals(MergeIntervalsEngine.generate(p.key, 7))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${dark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl border p-5 shadow-xl ${dark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/85'}`}>
          {/* Timeline */}
          <div className={`rounded-2xl border p-4 ${dark ? 'border-white/5 bg-slate-950/60' : 'border-slate-100 bg-slate-50'}`}>
            <h4 className={`text-xs font-semibold uppercase tracking-widest mb-3 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Input Intervals</h4>
            <div className="space-y-2 min-h-[140px]">
              {displayIntervals.map(([s, e], i) => (
                <motion.div key={i} layout
                  className="relative h-6"
                  animate={{ opacity: current?.currentIndex === i ? 1 : 0.7 }}>
                  <motion.div
                    animate={{ left: `${(s / maxVal) * 100}%`, width: `${((e - s) / maxVal) * 100}%` }}
                    className={`absolute h-full rounded-full ${
                      current?.currentIndex === i
                        ? 'bg-gradient-to-r from-yellow-400 to-amber-500 shadow-lg shadow-yellow-500/30'
                        : dark ? 'bg-gradient-to-r from-emerald-700 to-teal-600' : 'bg-gradient-to-r from-emerald-400 to-teal-400'}`}
                    style={{ minWidth: '20px' }}>
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow">
                      [{s},{e}]
                    </span>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {merged.length > 0 && (
              <>
                <h4 className={`text-xs font-semibold uppercase tracking-widest mb-3 mt-6 ${dark ? 'text-emerald-400' : 'text-emerald-600'}`}>Merged Result</h4>
                <div className="space-y-2">
                  {merged.map(([s, e], i) => (
                    <motion.div key={i} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} className="relative h-7">
                      <motion.div
                        style={{ left: `${(s / maxVal) * 100}%`, width: `${((e - s) / maxVal) * 100}%`, minWidth: '24px' }}
                        className="absolute h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400 shadow-lg shadow-green-500/20">
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow">
                          [{s},{e}]
                        </span>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <button onClick={() => { setStepIdx(0); setPlaying(false); run(); }}
              className={`p-2 rounded-xl ${dark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
              <RotateCcw className="h-4 w-4" />
            </button>
            <button onClick={() => setPlaying(!playing)}
              className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg">
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <button onClick={() => setStepIdx(i => Math.min(steps.length - 1, i + 1))}
              className={`p-2 rounded-xl ${dark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
              <SkipForward className="h-4 w-4" />
            </button>
            <div className="flex-1" />
            <input type="range" min={200} max={1500} step={100} value={1700 - speed}
              onChange={e => setSpeed(1700 - Number(e.target.value))} className="w-24 accent-emerald-500" />
            <span className={`text-xs font-mono ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{stepIdx + 1}/{steps.length}</span>
          </div>
          <div className={`h-1.5 rounded-full mt-3 ${dark ? 'bg-slate-800' : 'bg-slate-200'}`}>
            <motion.div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
              animate={{ width: `${steps.length > 1 ? (stepIdx / (steps.length - 1)) * 100 : 0}%` }} />
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={stepIdx} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className={`mt-3 p-3 rounded-xl text-sm ${dark ? 'bg-emerald-950/30 text-emerald-200 border border-emerald-800/30' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'}`}>
              {current?.explanation}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <CodeDisplay code={code} language={language} title="Merge Intervals — Sort & Scan" currentLine={current?.highlightLine} />
        </motion.div>
      </div>
    </div>
  );
};

export default MergeIntervals;

import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, RotateCcw, Sparkles, Zap, TrendingUp, BarChart3 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import CodeDisplay from '../components/CodeDisplay';
import { LISEngine, LISStep, LISApproach } from '../logic/lis/engine';
import { generateLISCode } from '../logic/lis/codegen';

const APPROACHES: { key: LISApproach; label: string; complexity: string; color: string }[] = [
  { key: 'dp', label: 'O(n²) DP', complexity: 'O(n²)', color: 'from-blue-500 to-indigo-500' },
  { key: 'patience', label: 'O(n log n) Patience', complexity: 'O(n log n)', color: 'from-emerald-500 to-teal-500' },
];

const LIS: React.FC = () => {
  const { theme, language } = useApp();
  const dark = theme === 'dark';

  const [nums, setNums] = useState([10, 9, 2, 5, 3, 7, 101, 18]);
  const [approach, setApproach] = useState<LISApproach>('dp');
  const [steps, setSteps] = useState<LISStep[]>([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const engine = useMemo(() => new LISEngine(), []);

  const run = useCallback(() => {
    setSteps(engine.solve(approach, nums));
    setStepIdx(0);
    setPlaying(false);
  }, [engine, approach, nums]);

  useEffect(() => { run(); }, [run]);

  useEffect(() => {
    if (playing && stepIdx < steps.length - 1) {
      timerRef.current = setTimeout(() => setStepIdx(i => i + 1), speed);
    } else if (stepIdx >= steps.length - 1) setPlaying(false);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [playing, stepIdx, steps.length, speed]);

  const current = steps[stepIdx] || steps[0];
  const maxVal = Math.max(...nums, 1);
  const code = generateLISCode(approach, language);

  return (
    <div className={`min-h-screen px-4 py-6 sm:px-6 lg:px-8 ${dark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="mx-auto max-w-7xl flex flex-col gap-5">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl border p-5 shadow-xl backdrop-blur ${dark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/85'}`}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-pink-400">
                <TrendingUp className="h-4 w-4" /> Longest Increasing Subsequence
              </div>
              <h1 className={`text-2xl font-black tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>
                LIS Visualizer
              </h1>
            </div>
            <div className="flex gap-2">
              {APPROACHES.map(a => (
                <button key={a.key} onClick={() => setApproach(a.key)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${approach === a.key
                    ? `bg-gradient-to-r ${a.color} text-white shadow-lg`
                    : dark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                  {a.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 flex gap-4 flex-wrap items-end">
            <label className="space-y-1 flex-1">
              <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Array</span>
              <input value={nums.join(', ')} onChange={e => { const a = e.target.value.split(',').map(Number).filter(n => !isNaN(n)); if (a.length > 0) setNums(a); }}
                className={`w-full rounded-xl border px-3 py-2 text-sm font-mono ${dark ? 'border-white/10 bg-slate-950/70 text-white' : 'border-slate-200 bg-white text-slate-900'}`} />
            </label>
            <button onClick={() => setNums(LISEngine.generate(12))}
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
              <div className="flex items-end justify-center gap-2 min-h-[240px] pb-4">
                {nums.map((n, i) => {
                  const barH = Math.max(12, (n / maxVal) * 200);
                  const isLIS = current?.lisIndices?.includes(i);
                  const isActive = current?.currentIndex === i;

                  return (
                    <div key={i} className="flex flex-col items-center gap-1" style={{ minWidth: '32px', flex: 1 }}>
                      <motion.div
                        animate={{ height: barH }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className={`w-full rounded-t-md relative ${
                          isActive ? 'bg-gradient-to-t from-yellow-500 to-amber-400 shadow-lg shadow-yellow-500/30 ring-2 ring-yellow-400' :
                          isLIS ? 'bg-gradient-to-t from-pink-500 to-rose-400 shadow-lg shadow-pink-500/20' :
                          dark ? 'bg-gradient-to-t from-slate-700 to-slate-600' : 'bg-gradient-to-t from-slate-300 to-slate-200'}`}>
                        <div className={`absolute -top-5 left-1/2 -translate-x-1/2 text-[11px] font-bold ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{n}</div>
                      </motion.div>
                      {/* DP value */}
                      {approach === 'dp' && current?.dp?.[i] !== undefined && (
                        <div className={`text-[9px] font-bold ${dark ? 'text-pink-400' : 'text-pink-600'}`}>dp={current.dp[i]}</div>
                      )}
                      <div className={`text-[9px] ${dark ? 'text-slate-600' : 'text-slate-400'}`}>{i}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tails for patience sort */}
            {approach === 'patience' && current?.tails && current.tails.length > 0 && (
              <div className="mt-3">
                <h4 className={`text-xs font-semibold uppercase tracking-widest mb-2 ${dark ? 'text-emerald-400' : 'text-emerald-600'}`}>Tails Array</h4>
                <div className="flex gap-1.5 flex-wrap">
                  {current.tails.map((t, i) => (
                    <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold ${dark ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/30' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'}`}>
                      {t}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}

            {/* LIS subsequence */}
            {current?.lisIndices && current.lisIndices.length > 0 && (
              <div className="mt-3">
                <h4 className={`text-xs font-semibold uppercase tracking-widest mb-2 ${dark ? 'text-pink-400' : 'text-pink-600'}`}>LIS</h4>
                <div className="flex gap-1.5 flex-wrap items-center">
                  {current.lisIndices.map((idx, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <span className={`text-xs ${dark ? 'text-slate-600' : 'text-slate-400'}`}>→</span>}
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold ${dark ? 'bg-pink-900/40 text-pink-300' : 'bg-pink-100 text-pink-700'}`}>
                        {nums[idx]}
                      </motion.span>
                    </React.Fragment>
                  ))}
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
                className="p-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg">
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              <button onClick={() => setStepIdx(i => Math.min(steps.length - 1, i + 1))}
                className={`p-2 rounded-xl ${dark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                <SkipForward className="h-4 w-4" />
              </button>
              <div className="flex-1" />
              <input type="range" min={100} max={1200} step={100} value={1300 - speed}
                onChange={e => setSpeed(1300 - Number(e.target.value))} className="w-24 accent-pink-500" />
              <span className={`text-xs font-mono ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{stepIdx + 1}/{steps.length}</span>
            </div>
            <div className={`h-1.5 rounded-full mt-3 ${dark ? 'bg-slate-800' : 'bg-slate-200'}`}>
              <motion.div className="h-full rounded-full bg-gradient-to-r from-pink-500 to-rose-500"
                animate={{ width: `${steps.length > 1 ? (stepIdx / (steps.length - 1)) * 100 : 0}%` }} />
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={stepIdx} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className={`mt-3 p-3 rounded-xl text-sm ${dark ? 'bg-pink-950/30 text-pink-200 border border-pink-800/30' : 'bg-pink-50 text-pink-800 border border-pink-200'}`}>
                {current?.explanation}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className={`rounded-2xl border p-4 ${dark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/85'}`}>
              <h3 className={`text-xs font-semibold uppercase tracking-[0.2em] mb-3 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                <BarChart3 className="h-3 w-3 inline mr-1" /> Stats
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span className={`text-xs ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Array Size</span><span className={`text-xs font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>{nums.length}</span></div>
                <div className="flex justify-between"><span className={`text-xs ${dark ? 'text-slate-500' : 'text-slate-400'}`}>LIS Length</span><span className={`text-xs font-bold ${dark ? 'text-pink-300' : 'text-pink-600'}`}>{current?.lisIndices?.length ?? current?.tails?.length ?? '...'}</span></div>
                <div className="flex justify-between"><span className={`text-xs ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Approach</span><span className={`text-xs font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>{approach === 'dp' ? 'O(n²)' : 'O(n log n)'}</span></div>
              </div>
            </motion.div>

            <div className={`rounded-2xl border p-4 ${dark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/85'}`}>
              <h3 className={`text-xs font-semibold uppercase tracking-[0.2em] mb-2 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                <Sparkles className="h-3 w-3 inline mr-1" /> Insight
              </h3>
              <p className={`text-xs leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                {approach === 'dp'
                  ? 'Classic DP: For each element, check all previous elements. If nums[j] < nums[i], dp[i] = max(dp[i], dp[j]+1). Gives the actual subsequence.'
                  : 'Patience sorting maintains an array of smallest tail elements for each subsequence length. Binary search finds the right pile. Gives length in O(n log n)!'}
              </p>
            </div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <CodeDisplay code={code} language={language} title={`LIS — ${APPROACHES.find(a => a.key === approach)?.label}`} currentLine={current?.highlightLine} />
        </motion.div>
      </div>
    </div>
  );
};

export default LIS;

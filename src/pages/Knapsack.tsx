import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, RotateCcw, Sparkles, Zap, Package } from 'lucide-react';
import { useApp } from '../context/AppContext';
import CodeDisplay from '../components/CodeDisplay';
import { KnapsackEngine, KnapsackStep } from '../logic/knapsack/engine';
import { generateKnapsackCode } from '../logic/knapsack/codegen';

const Knapsack: React.FC = () => {
  const { theme, language } = useApp();
  const dark = theme === 'dark';

  const [weights, setWeights] = useState([2, 3, 4, 5]);
  const [values, setValues] = useState([3, 4, 5, 6]);
  const [capacity, setCapacity] = useState(8);
  const [steps, setSteps] = useState<KnapsackStep[]>([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const engine = useMemo(() => new KnapsackEngine(), []);

  const run = useCallback(() => {
    setSteps(engine.solve(weights, values, capacity));
    setStepIdx(0);
    setPlaying(false);
  }, [engine, weights, values, capacity]);

  useEffect(() => { run(); }, [run]);

  useEffect(() => {
    if (playing && stepIdx < steps.length - 1) {
      timerRef.current = setTimeout(() => setStepIdx(i => i + 1), speed);
    } else if (stepIdx >= steps.length - 1) setPlaying(false);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [playing, stepIdx, steps.length, speed]);

  const current = steps[stepIdx] || steps[0];
  const dp = current?.dp ?? [];
  const code = generateKnapsackCode(language);

  const ITEM_COLORS = ['from-blue-400 to-indigo-500', 'from-emerald-400 to-green-500', 'from-amber-400 to-orange-500', 'from-pink-400 to-rose-500', 'from-violet-400 to-purple-500', 'from-cyan-400 to-teal-500', 'from-red-400 to-red-600', 'from-lime-400 to-green-600'];

  return (
    <div className={`min-h-screen px-4 py-6 sm:px-6 lg:px-8 ${dark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="mx-auto max-w-7xl flex flex-col gap-5">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl border p-5 shadow-xl backdrop-blur ${dark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/85'}`}>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-indigo-400">
              <Package className="h-4 w-4" /> 0/1 Knapsack
            </div>
            <h1 className={`text-2xl font-black tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>
              Knapsack Optimizer
            </h1>
          </div>
          <div className="mt-4 flex gap-4 flex-wrap items-end">
            <label className="space-y-1">
              <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Weights</span>
              <input value={weights.join(', ')} onChange={e => { const a = e.target.value.split(',').map(Number).filter(n => n > 0); if (a.length > 0) setWeights(a); }}
                className={`w-36 rounded-xl border px-3 py-2 text-sm font-mono ${dark ? 'border-white/10 bg-slate-950/70 text-white' : 'border-slate-200 bg-white text-slate-900'}`} />
            </label>
            <label className="space-y-1">
              <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Values</span>
              <input value={values.join(', ')} onChange={e => { const a = e.target.value.split(',').map(Number).filter(n => n > 0); if (a.length > 0) setValues(a); }}
                className={`w-36 rounded-xl border px-3 py-2 text-sm font-mono ${dark ? 'border-white/10 bg-slate-950/70 text-white' : 'border-slate-200 bg-white text-slate-900'}`} />
            </label>
            <label className="space-y-1">
              <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Capacity</span>
              <input type="number" min={1} max={50} value={capacity} onChange={e => setCapacity(Math.max(1, Number(e.target.value)))}
                className={`w-16 rounded-xl border px-3 py-2 text-sm font-bold ${dark ? 'border-white/10 bg-slate-950/70 text-white' : 'border-slate-200 bg-white text-slate-900'}`} />
            </label>
            <button onClick={() => { const g = KnapsackEngine.generate(); setWeights(g.weights); setValues(g.values); setCapacity(g.capacity); }}
              className={`px-3 py-2 rounded-xl text-xs font-semibold ${dark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
              Random
            </button>
          </div>
          {/* Items display */}
          <div className="flex gap-3 mt-4 flex-wrap">
            {weights.map((w, i) => (
              <motion.div key={i} whileHover={{ scale: 1.05, y: -2 }}
                className={`relative px-3 py-2 rounded-xl bg-gradient-to-br ${ITEM_COLORS[i % ITEM_COLORS.length]} text-white shadow-lg cursor-default ${
                  current?.selectedItems?.includes(i) ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-transparent' : ''}`}>
                <div className="text-xs font-bold">Item {i + 1}</div>
                <div className="text-[10px] opacity-80">w={w} v={values[i]}</div>
                {current?.selectedItems?.includes(i) && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] font-black text-yellow-900">✓</div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl border p-5 shadow-xl ${dark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/85'}`}>
          {/* DP Table */}
          {dp.length > 0 && dp.length <= 15 && (
            <div className={`rounded-2xl border p-3 overflow-auto mb-4 ${dark ? 'border-white/5 bg-slate-950/40' : 'border-slate-100 bg-slate-50'}`}>
              <h4 className={`text-xs font-semibold uppercase tracking-widest mb-2 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>DP Table</h4>
              <table className="text-[10px] font-mono">
                <thead><tr>
                  <th className={`px-1 py-0.5 ${dark ? 'text-slate-500' : 'text-slate-400'}`}></th>
                  {Array.from({ length: Math.min(capacity + 1, 25) }, (_, j) => (
                    <th key={j} className={`px-1 py-0.5 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{j}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {dp.map((row, r) => (
                    <tr key={r}>
                      <td className={`px-1 py-0.5 font-bold ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{r}</td>
                      {row.slice(0, 25).map((val, c) => (
                        <td key={c} className={`px-1.5 py-1 text-center border ${
                          current?.currentItem === r && c <= capacity
                            ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 font-bold'
                            : val > 0 ? (dark ? 'border-slate-700/50 text-slate-300' : 'border-slate-200 text-slate-600')
                            : dark ? 'border-slate-800 text-slate-700' : 'border-slate-100 text-slate-300'
                        }`}>{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={() => { setStepIdx(0); setPlaying(false); }}
              className={`p-2 rounded-xl ${dark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
              <RotateCcw className="h-4 w-4" />
            </button>
            <button onClick={() => setPlaying(!playing)}
              className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg">
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <button onClick={() => setStepIdx(i => Math.min(steps.length - 1, i + 1))}
              className={`p-2 rounded-xl ${dark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
              <SkipForward className="h-4 w-4" />
            </button>
            <div className="flex-1" />
            <input type="range" min={100} max={1200} step={100} value={1300 - speed}
              onChange={e => setSpeed(1300 - Number(e.target.value))} className="w-24 accent-indigo-500" />
            <span className={`text-xs font-mono ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{stepIdx + 1}/{steps.length}</span>
          </div>
          <div className={`h-1.5 rounded-full mt-3 ${dark ? 'bg-slate-800' : 'bg-slate-200'}`}>
            <motion.div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
              animate={{ width: `${steps.length > 1 ? (stepIdx / (steps.length - 1)) * 100 : 0}%` }} />
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={stepIdx} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className={`mt-3 p-3 rounded-xl text-sm ${dark ? 'bg-indigo-950/30 text-indigo-200 border border-indigo-800/30' : 'bg-indigo-50 text-indigo-800 border border-indigo-200'}`}>
              {current?.explanation}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <CodeDisplay code={code} language={language} title="0/1 Knapsack — Bottom-Up DP" currentLine={current?.highlightLine} />
        </motion.div>
      </div>
    </div>
  );
};

export default Knapsack;

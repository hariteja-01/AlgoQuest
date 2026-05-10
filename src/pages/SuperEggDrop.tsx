import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, RotateCcw, Egg, Sparkles, Zap, Building2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import CodeDisplay from '../components/CodeDisplay';
import { SuperEggDropEngine, EggDropStep, EggApproach } from '../logic/supereggdrop/engine';
import { generateSuperEggDropCode } from '../logic/supereggdrop/codegen';

const APPROACHES: { key: EggApproach; label: string; complexity: string; color: string }[] = [
  { key: 'dp', label: 'DP O(KN²)', complexity: 'O(KN²)', color: 'from-blue-500 to-cyan-500' },
  { key: 'dpBinarySearch', label: 'DP + BinSearch', complexity: 'O(KN·logN)', color: 'from-purple-500 to-pink-500' },
  { key: 'movesBased', label: 'Moves-based', complexity: 'O(K·result)', color: 'from-green-500 to-emerald-500' },
];

const SuperEggDrop: React.FC = () => {
  const { theme, language } = useApp();
  const dark = theme === 'dark';

  const [eggs, setEggs] = useState(2);
  const [floors, setFloors] = useState(10);
  const [approach, setApproach] = useState<EggApproach>('dp');
  const [steps, setSteps] = useState<EggDropStep[]>([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const engine = useMemo(() => new SuperEggDropEngine(), []);

  const runAlgorithm = useCallback(() => {
    const s = engine.solve(approach, eggs, floors);
    setSteps(s);
    setStepIdx(0);
    setPlaying(false);
  }, [engine, approach, eggs, floors]);

  useEffect(() => { runAlgorithm(); }, [runAlgorithm]);

  useEffect(() => {
    if (playing && stepIdx < steps.length - 1) {
      timerRef.current = setTimeout(() => setStepIdx(i => i + 1), speed);
    } else if (stepIdx >= steps.length - 1) setPlaying(false);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [playing, stepIdx, steps.length, speed]);

  const current = steps[stepIdx] || steps[0];
  const code = generateSuperEggDropCode(approach, language);
  const dpTable = current?.dpTable ?? [];

  return (
    <div className={`min-h-screen px-4 py-6 sm:px-6 lg:px-8 ${dark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="mx-auto max-w-7xl flex flex-col gap-5">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl border p-5 shadow-xl backdrop-blur ${dark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/85'}`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-amber-400">
                <Egg className="h-4 w-4" /> Super Egg Drop
              </div>
              <h1 className={`text-2xl font-black tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>
                Egg Drop Experiment Lab
              </h1>
              <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                Find the minimum number of moves to determine the critical floor with K eggs and N floors.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
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
          {/* Inputs */}
          <div className="mt-4 flex gap-4 flex-wrap">
            <label className="space-y-1">
              <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Eggs (K)</span>
              <input type="number" min={1} max={10} value={eggs} onChange={e => setEggs(Math.max(1, Math.min(10, Number(e.target.value))))}
                className={`w-20 rounded-xl border px-3 py-2 text-sm font-bold ${dark ? 'border-white/10 bg-slate-950/70 text-white' : 'border-slate-200 bg-white text-slate-900'}`} />
            </label>
            <label className="space-y-1">
              <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Floors (N)</span>
              <input type="number" min={1} max={200} value={floors} onChange={e => setFloors(Math.max(1, Math.min(200, Number(e.target.value))))}
                className={`w-24 rounded-xl border px-3 py-2 text-sm font-bold ${dark ? 'border-white/10 bg-slate-950/70 text-white' : 'border-slate-200 bg-white text-slate-900'}`} />
            </label>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr,340px] gap-5">
          {/* DP Table Visualization */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`rounded-3xl border p-5 shadow-xl ${dark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/85'}`}>
            {/* Building visualization */}
            <div className={`rounded-2xl border p-4 mb-4 ${dark ? 'border-white/5 bg-slate-950/60' : 'border-slate-100 bg-slate-50'}`}>
              <div className="flex items-end justify-center gap-0.5 min-h-[180px]">
                {Array.from({ length: Math.min(floors, 30) }, (_, i) => {
                  const floor = i + 1;
                  const isActive = current?.currentFloors !== undefined && floor <= current.currentFloors;
                  const isTryFloor = current?.tryFloor === floor;
                  return (
                    <motion.div key={i}
                      animate={{ opacity: isActive ? 1 : 0.3, height: `${(floor / Math.min(floors, 30)) * 160}px` }}
                      className={`w-3 sm:w-4 rounded-t-sm transition-all ${
                        isTryFloor ? 'bg-gradient-to-t from-yellow-500 to-amber-400 shadow-lg shadow-yellow-500/30' :
                        isActive ? (dark ? 'bg-gradient-to-t from-amber-700 to-amber-500' : 'bg-gradient-to-t from-amber-300 to-amber-200') :
                        dark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                    </motion.div>
                  );
                })}
              </div>
              <div className="flex justify-center gap-4 mt-3">
                {Array.from({ length: eggs }, (_, i) => (
                  <motion.div key={i} animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    className="text-2xl">🥚</motion.div>
                ))}
              </div>
            </div>

            {/* DP Table */}
            {dpTable.length > 0 && dpTable.length <= 25 && (
              <div className={`rounded-2xl border p-3 overflow-auto ${dark ? 'border-white/5 bg-slate-950/40' : 'border-slate-100 bg-slate-50'}`}>
                <h4 className={`text-xs font-semibold uppercase tracking-widest mb-2 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
                  DP Table
                </h4>
                <div className="overflow-x-auto">
                  <table className="text-[10px] font-mono">
                    <tbody>
                      {dpTable.slice(0, 15).map((row, r) => (
                        <tr key={r}>
                          {row.slice(0, 20).map((val, c) => (
                            <td key={c} className={`px-1.5 py-1 text-center border ${
                              current?.currentEggs === r && current?.currentFloors === c
                                ? 'bg-amber-500/30 border-amber-500 font-bold text-amber-300'
                                : val === 0 ? (dark ? 'border-slate-800 text-slate-600' : 'border-slate-200 text-slate-300')
                                : dark ? 'border-slate-700/50 text-slate-300' : 'border-slate-200 text-slate-600'
                            }`}>
                              {val === Infinity ? '∞' : val > 9999 ? '...' : val}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <button onClick={() => { setStepIdx(0); setPlaying(false); }}
                className={`p-2 rounded-xl ${dark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                <RotateCcw className="h-4 w-4" />
              </button>
              <button onClick={() => setPlaying(!playing)}
                className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25">
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              <button onClick={() => setStepIdx(i => Math.min(steps.length - 1, i + 1))}
                className={`p-2 rounded-xl ${dark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                <SkipForward className="h-4 w-4" />
              </button>
              <div className="flex-1" />
              <input type="range" min={100} max={1500} step={100} value={1600 - speed}
                onChange={e => setSpeed(1600 - Number(e.target.value))} className="w-24 accent-amber-500" />
              <span className={`text-xs font-mono ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{stepIdx + 1}/{steps.length}</span>
            </div>

            <div className={`h-1.5 rounded-full mt-3 ${dark ? 'bg-slate-800' : 'bg-slate-200'}`}>
              <motion.div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                animate={{ width: `${steps.length > 1 ? (stepIdx / (steps.length - 1)) * 100 : 0}%` }} />
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={stepIdx} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className={`mt-3 p-3 rounded-xl text-sm ${dark ? 'bg-amber-950/30 text-amber-200 border border-amber-800/30' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}>
                {current?.explanation}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className={`rounded-2xl border p-4 ${dark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/85'}`}>
              <h3 className={`text-xs font-semibold uppercase tracking-[0.2em] mb-3 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                <Zap className="h-3 w-3 inline mr-1" /> Result
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Min Moves', value: current?.result ?? '—', icon: '🎯' },
                  { label: 'Operations', value: current?.operations ?? 0, icon: '⚙️' },
                  { label: 'Eggs', value: eggs, icon: '🥚' },
                  { label: 'Floors', value: floors, icon: '🏢' },
                ].map(m => (
                  <div key={m.label} className={`p-2.5 rounded-xl text-center ${dark ? 'bg-slate-800/60' : 'bg-slate-50 border border-slate-100'}`}>
                    <div className="text-lg">{m.icon}</div>
                    <div className={`text-lg font-black ${dark ? 'text-white' : 'text-slate-900'}`}>{m.value}</div>
                    <div className={`text-[10px] ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{m.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className={`rounded-2xl border p-4 ${dark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/85'}`}>
              <h3 className={`text-xs font-semibold uppercase tracking-[0.2em] mb-2 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                <Sparkles className="h-3 w-3 inline mr-1" /> Key Insight
              </h3>
              <p className={`text-xs leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                {approach === 'movesBased'
                  ? 'The moves-based DP flips the question: "Given m moves and k eggs, how many floors can we check?" This gives the most elegant solution.'
                  : approach === 'dpBinarySearch'
                  ? 'For a fixed (eggs, floors), the break function increases and survive decreases with floor x. Their intersection gives the optimal floor — found via binary search!'
                  : 'Standard DP: dp[k][n] = min over all floors x of: 1 + max(dp[k-1][x-1], dp[k][n-x]). The egg either breaks or survives.'}
              </p>
            </div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <CodeDisplay code={code} language={language} title={`Super Egg Drop — ${APPROACHES.find(a => a.key === approach)?.label}`} currentLine={current?.highlightLine} />
        </motion.div>
      </div>
    </div>
  );
};

export default SuperEggDrop;

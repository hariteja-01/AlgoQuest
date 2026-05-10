import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, RotateCcw, Bug, Sparkles, Zap, Trophy } from 'lucide-react';
import { useApp } from '../context/AppContext';
import CodeDisplay from '../components/CodeDisplay';
import { RottingOrangesEngine, CellState, BFSStep } from '../logic/rottingoranges/engine';
import { generateRottingOrangesCode } from '../logic/rottingoranges/codegen';

const CELL_COLORS: Record<CellState, { dark: string; light: string; label: string; emoji: string }> = {
  0: { dark: 'bg-slate-800/40 border-slate-700/30', light: 'bg-slate-100 border-slate-200', label: 'Empty', emoji: '' },
  1: { dark: 'bg-green-900/60 border-green-600/40', light: 'bg-green-100 border-green-300', label: 'Fresh', emoji: '🍊' },
  2: { dark: 'bg-red-900/60 border-red-500/40', light: 'bg-red-100 border-red-300', label: 'Rotten', emoji: '🧟' },
};

const GRID_PRESETS = [
  { key: 'random' as const, label: 'Random' },
  { key: 'dense' as const, label: 'Dense' },
  { key: 'sparse' as const, label: 'Sparse' },
  { key: 'impossible' as const, label: 'Impossible' },
];

const RottingOranges: React.FC = () => {
  const { theme, language } = useApp();
  const dark = theme === 'dark';

  const [grid, setGrid] = useState<CellState[][]>(() => RottingOrangesEngine.generateGrid('dense', 6, 6));
  const [steps, setSteps] = useState<BFSStep[]>([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runSolver = useCallback(() => {
    const engine = new RottingOrangesEngine();
    const s = engine.solve(grid);
    setSteps(s);
    setStepIdx(0);
    setPlaying(false);
  }, [grid]);

  useEffect(() => { runSolver(); }, [runSolver]);

  useEffect(() => {
    if (playing && stepIdx < steps.length - 1) {
      timerRef.current = setTimeout(() => setStepIdx(i => i + 1), speed);
    } else if (stepIdx >= steps.length - 1) setPlaying(false);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [playing, stepIdx, steps.length, speed]);

  const current = steps[stepIdx] || steps[0];
  const displayGrid = current?.grid ?? grid;
  const code = generateRottingOrangesCode(language);

  const toggleCell = (r: number, c: number) => {
    setGrid(prev => {
      const ng = prev.map(row => [...row]);
      ng[r][c] = ((ng[r][c] + 1) % 3) as CellState;
      return ng;
    });
  };

  const isFrontier = (r: number, c: number) => current?.frontier?.some(([fr, fc]) => fr === r && fc === c);

  return (
    <div className={`min-h-screen px-4 py-6 sm:px-6 lg:px-8 ${dark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="mx-auto max-w-7xl flex flex-col gap-5">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl border p-5 shadow-xl backdrop-blur ${dark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/85'}`}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-red-400">
                <Bug className="h-4 w-4" /> Rotting Oranges
              </div>
              <h1 className={`text-2xl font-black tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>
                BFS Infection Simulator
              </h1>
              <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                Watch multi-source BFS spread infection wave by wave. Click cells to toggle states.
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {GRID_PRESETS.map(p => (
                <button key={p.key} onClick={() => setGrid(RottingOrangesEngine.generateGrid(p.key, 6, 6))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${dark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr,340px] gap-5">
          {/* Grid */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`rounded-3xl border p-5 shadow-xl ${dark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/85'}`}>
            <div className={`rounded-2xl border p-4 ${dark ? 'border-white/5 bg-slate-950/60' : 'border-slate-100 bg-slate-50'}`}>
              <div className="flex justify-center">
                <div className="inline-grid gap-1.5" style={{ gridTemplateColumns: `repeat(${displayGrid[0]?.length || 6}, minmax(0, 1fr))` }}>
                  {displayGrid.map((row, r) => row.map((cell, c) => {
                    const frontier = isFrontier(r, c);
                    const colors = CELL_COLORS[cell];
                    return (
                      <motion.button key={`${r}-${c}`}
                        onClick={() => toggleCell(r, c)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        animate={frontier ? { scale: [1, 1.15, 1], boxShadow: ['0 0 0px rgba(239,68,68,0)', '0 0 20px rgba(239,68,68,0.6)', '0 0 0px rgba(239,68,68,0)'] } : {}}
                        transition={frontier ? { duration: 0.6, repeat: 0 } : { type: 'spring' }}
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-2 flex items-center justify-center text-lg font-bold transition-colors ${dark ? colors.dark : colors.light} ${
                          cell === 2 ? 'shadow-inner shadow-red-500/20' : ''}`}>
                        {cell === 1 ? '🍊' : cell === 2 ? '🧟' : ''}
                      </motion.button>
                    );
                  }))}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <button onClick={() => { setStepIdx(0); setPlaying(false); runSolver(); }}
                className={`p-2 rounded-xl ${dark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                <RotateCcw className="h-4 w-4" />
              </button>
              <button onClick={() => setPlaying(!playing)}
                className="p-2.5 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/25">
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              <button onClick={() => setStepIdx(i => Math.min(steps.length - 1, i + 1))}
                className={`p-2 rounded-xl ${dark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                <SkipForward className="h-4 w-4" />
              </button>
              <div className="flex-1" />
              <label className={`text-xs ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Speed</label>
              <input type="range" min={200} max={2000} step={200} value={2200 - speed}
                onChange={e => setSpeed(2200 - Number(e.target.value))} className="w-24 accent-red-500" />
              <span className={`text-xs font-mono ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{stepIdx + 1}/{steps.length}</span>
            </div>

            {/* Progress */}
            <div className={`h-1.5 rounded-full mt-3 ${dark ? 'bg-slate-800' : 'bg-slate-200'}`}>
              <motion.div className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-500"
                animate={{ width: `${steps.length > 1 ? (stepIdx / (steps.length - 1)) * 100 : 0}%` }} />
            </div>

            {/* Explanation */}
            <AnimatePresence mode="wait">
              <motion.div key={stepIdx} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className={`mt-3 p-3 rounded-xl text-sm ${dark ? 'bg-red-950/30 text-red-200 border border-red-800/30' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                {current?.explanation}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            {/* Metrics */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className={`rounded-2xl border p-4 ${dark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/85'}`}>
              <h3 className={`text-xs font-semibold uppercase tracking-[0.2em] mb-3 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                <Zap className="h-3 w-3 inline mr-1" /> BFS Metrics
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Minute', value: current?.minute ?? 0, icon: '⏱️' },
                  { label: 'Fresh Left', value: current?.freshCount ?? 0, icon: '🍊' },
                  { label: 'Queue', value: current?.queue?.length ?? 0, icon: '📋' },
                  { label: 'Processed', value: current?.processedCount ?? 0, icon: '✅' },
                ].map(m => (
                  <div key={m.label} className={`p-2.5 rounded-xl text-center ${dark ? 'bg-slate-800/60' : 'bg-slate-50 border border-slate-100'}`}>
                    <div className="text-lg">{m.icon}</div>
                    <div className={`text-lg font-black ${dark ? 'text-white' : 'text-slate-900'}`}>{m.value}</div>
                    <div className={`text-[10px] ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{m.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Queue Visualization */}
            {current?.queue && current.queue.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className={`rounded-2xl border p-4 ${dark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/85'}`}>
                <h3 className={`text-xs font-semibold uppercase tracking-[0.2em] mb-2 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>BFS Queue</h3>
                <div className="flex gap-1 flex-wrap max-h-24 overflow-auto">
                  {current.queue.slice(0, 20).map(([r, c], i) => (
                    <span key={i} className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${dark ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-700'}`}>
                      ({r},{c})
                    </span>
                  ))}
                  {current.queue.length > 20 && <span className={`text-[10px] ${dark ? 'text-slate-500' : 'text-slate-400'}`}>+{current.queue.length - 20} more</span>}
                </div>
              </motion.div>
            )}

            {/* Legend */}
            <div className={`rounded-2xl border p-4 ${dark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/85'}`}>
              <h3 className={`text-xs font-semibold uppercase tracking-[0.2em] mb-2 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Legend</h3>
              <div className="space-y-2">
                {([0, 1, 2] as CellState[]).map(s => (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-lg border ${dark ? CELL_COLORS[s].dark : CELL_COLORS[s].light} flex items-center justify-center text-xs`}>
                      {CELL_COLORS[s].emoji}
                    </div>
                    <span className={`text-xs ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{CELL_COLORS[s].label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tip */}
            <div className={`rounded-2xl border p-4 ${dark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/85'}`}>
              <h3 className={`text-xs font-semibold uppercase tracking-[0.2em] mb-2 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                <Sparkles className="h-3 w-3 inline mr-1" /> Why BFS?
              </h3>
              <p className={`text-xs leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                BFS guarantees minimum time because it processes all cells at the same distance simultaneously. All rotten oranges spread at the same time — this is multi-source BFS!
              </p>
            </div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <CodeDisplay code={code} language={language} title="Rotting Oranges — Multi-Source BFS" currentLine={current?.highlightLine} />
        </motion.div>
      </div>
    </div>
  );
};

export default RottingOranges;

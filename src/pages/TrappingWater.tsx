import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Droplets, Sparkles, Zap, Trophy, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import CodeDisplay from '../components/CodeDisplay';
import { TrappingWaterEngine, TrappingWaterStep, ApproachType } from '../logic/trappingwater/engine';
import { generateTrappingWaterCode } from '../logic/trappingwater/codegen';

const APPROACHES: { key: ApproachType; label: string; complexity: string; color: string }[] = [
  { key: 'bruteforce', label: 'Brute Force', complexity: 'O(n²) / O(1)', color: 'from-red-500 to-orange-500' },
  { key: 'dp', label: 'DP (Prefix Max)', complexity: 'O(n) / O(n)', color: 'from-blue-500 to-cyan-500' },
  { key: 'twopointer', label: 'Two Pointer', complexity: 'O(n) / O(1)', color: 'from-green-500 to-emerald-500' },
  { key: 'stack', label: 'Monotonic Stack', complexity: 'O(n) / O(n)', color: 'from-purple-500 to-pink-500' },
];

const TERRAINS = [
  { key: 'edge' as const, label: 'Classic' },
  { key: 'random' as const, label: 'Random' },
  { key: 'valley' as const, label: 'Valley' },
  { key: 'mountain' as const, label: 'Mountain' },
];

const TrappingWater: React.FC = () => {
  const { theme, language } = useApp();
  const dark = theme === 'dark';

  const [heights, setHeights] = useState<number[]>([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]);
  const [approach, setApproach] = useState<ApproachType>('twopointer');
  const [steps, setSteps] = useState<TrappingWaterStep[]>([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const engine = useMemo(() => new TrappingWaterEngine(heights), [heights]);

  const runAlgorithm = useCallback(() => {
    const s = engine.solve(approach);
    setSteps(s);
    setStepIdx(0);
    setPlaying(false);
  }, [engine, approach]);

  useEffect(() => { runAlgorithm(); }, [runAlgorithm]);

  useEffect(() => {
    if (playing && stepIdx < steps.length - 1) {
      timerRef.current = setTimeout(() => setStepIdx(i => i + 1), speed);
    } else if (stepIdx >= steps.length - 1) {
      setPlaying(false);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [playing, stepIdx, steps.length, speed]);

  const current = steps[stepIdx] || steps[0];
  const maxH = Math.max(...heights, 1);
  const code = generateTrappingWaterCode(approach, language);

  const achievements = useMemo(() => {
    if (!current) return [];
    const a: string[] = [];
    if (current.type === 'complete') {
      a.push('🏆 Algorithm Complete');
      if (approach === 'twopointer') a.push('⚡ Two Pointer Wizard');
      if (approach === 'stack') a.push('📚 Stack Strategist');
      if (current.totalWater > 0) a.push('💧 Water Master');
      if (current.operations < heights.length * 2) a.push('🚀 O(n) Champion');
    }
    return a;
  }, [current, approach, heights.length]);

  return (
    <div className={`min-h-screen px-4 py-6 sm:px-6 lg:px-8 ${dark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="mx-auto max-w-7xl flex flex-col gap-5">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl border p-5 shadow-xl backdrop-blur ${dark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/85'}`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-500">
                <Droplets className="h-4 w-4" /> Trapping Rain Water
              </div>
              <h1 className={`text-2xl font-black tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>
                Terrain Water Simulator
              </h1>
              <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                Visualize how water gets trapped between elevation bars using 4 different approaches.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {APPROACHES.map(a => (
                <button key={a.key} onClick={() => { setApproach(a.key); }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${approach === a.key
                    ? `bg-gradient-to-r ${a.color} text-white shadow-lg`
                    : dark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                  {a.label}
                  <span className="block text-[10px] opacity-75 font-normal">{a.complexity}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Terrain Presets */}
        <div className="flex gap-2 flex-wrap">
          {TERRAINS.map(t => (
            <button key={t.key} onClick={() => setHeights(TrappingWaterEngine.generateTerrain(t.key))}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${dark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}`}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr,380px] gap-5">
          {/* Main Visualization */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`rounded-3xl border p-5 shadow-xl ${dark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/85'}`}>
            {/* Terrain + Water */}
            <div className={`rounded-2xl border p-4 ${dark ? 'border-white/5 bg-slate-950/60' : 'border-slate-100 bg-slate-50'}`}>
              <div className="flex items-end justify-center gap-1 min-h-[260px] pb-4">
                {heights.map((h, i) => {
                  const water = current?.waterLevels?.[i] ?? 0;
                  const barH = (h / maxH) * 200;
                  const waterH = (water / maxH) * 200;
                  const isHighlighted = current?.highlightIndices?.includes(i);
                  const isLeft = current?.leftPointer === i;
                  const isRight = current?.rightPointer === i;
                  const isStack = current?.stack?.includes(i);

                  return (
                    <div key={i} className="flex flex-col items-center gap-1 relative" style={{ minWidth: '28px' }}>
                      {/* Pointer labels */}
                      {isLeft && <motion.div initial={{ y: -5 }} animate={{ y: 0 }} className="text-[10px] font-bold text-green-400 absolute -top-5">L</motion.div>}
                      {isRight && <motion.div initial={{ y: -5 }} animate={{ y: 0 }} className="text-[10px] font-bold text-blue-400 absolute -top-5">R</motion.div>}

                      {/* Water */}
                      <motion.div
                        animate={{ height: waterH }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        className="w-full rounded-t-sm relative overflow-hidden"
                        style={{ background: 'linear-gradient(180deg, rgba(56,189,248,0.3) 0%, rgba(56,189,248,0.7) 100%)', position: 'absolute', bottom: barH, zIndex: 1 }}>
                        <div className="absolute inset-0 animate-pulse opacity-30 bg-gradient-to-r from-transparent via-white to-transparent" />
                      </motion.div>

                      {/* Bar */}
                      <motion.div
                        animate={{ height: barH }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className={`w-full rounded-t-md relative z-10 cursor-pointer ${
                          isHighlighted ? 'ring-2 ring-yellow-400 shadow-lg shadow-yellow-400/30' :
                          isStack ? 'ring-1 ring-purple-400' : ''}`}
                        style={{
                          background: isHighlighted
                            ? 'linear-gradient(180deg, #fbbf24, #f59e0b)'
                            : isLeft ? 'linear-gradient(180deg, #34d399, #059669)'
                            : isRight ? 'linear-gradient(180deg, #60a5fa, #3b82f6)'
                            : dark ? `linear-gradient(180deg, hsl(${200 + h*15},70%,60%), hsl(${200 + h*15},60%,35%))` : `linear-gradient(180deg, hsl(${200 + h*15},70%,55%), hsl(${200 + h*15},60%,40%))`,
                        }}
                        onMouseDown={(e) => {
                          const startY = e.clientY;
                          const startH = h;
                          const onMove = (ev: MouseEvent) => {
                            const diff = Math.round((startY - ev.clientY) / 20);
                            const newH = Math.max(0, Math.min(10, startH + diff));
                            setHeights(prev => { const n = [...prev]; n[i] = newH; return n; });
                          };
                          const onUp = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
                          document.addEventListener('mousemove', onMove);
                          document.addEventListener('mouseup', onUp);
                        }}>
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-center" style={{ color: dark ? '#94a3b8' : '#64748b' }}>{h}</div>
                      </motion.div>

                      <div className={`text-[9px] ${dark ? 'text-slate-600' : 'text-slate-400'}`}>{i}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <button onClick={() => { setStepIdx(0); setPlaying(false); }}
                className={`p-2 rounded-xl ${dark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                <RotateCcw className="h-4 w-4" />
              </button>
              <button onClick={() => setStepIdx(i => Math.max(0, i - 1))}
                className={`p-2 rounded-xl ${dark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                <SkipBack className="h-4 w-4" />
              </button>
              <button onClick={() => setPlaying(!playing)}
                className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-blue-500/25">
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              <button onClick={() => setStepIdx(i => Math.min(steps.length - 1, i + 1))}
                className={`p-2 rounded-xl ${dark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                <SkipForward className="h-4 w-4" />
              </button>
              <div className="flex-1" />
              <label className={`text-xs ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Speed</label>
              <input type="range" min={100} max={1500} step={100} value={1600 - speed}
                onChange={e => setSpeed(1600 - Number(e.target.value))}
                className="w-24 accent-cyan-500" />
              <span className={`text-xs font-mono ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
                {stepIdx + 1}/{steps.length}
              </span>
            </div>

            {/* Progress bar */}
            <div className={`h-1.5 rounded-full mt-3 ${dark ? 'bg-slate-800' : 'bg-slate-200'}`}>
              <motion.div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                animate={{ width: `${steps.length > 1 ? (stepIdx / (steps.length - 1)) * 100 : 0}%` }}
                transition={{ type: 'spring', stiffness: 200 }} />
            </div>

            {/* Explanation */}
            <AnimatePresence mode="wait">
              <motion.div key={stepIdx} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                className={`mt-3 p-3 rounded-xl text-sm ${dark ? 'bg-cyan-950/30 text-cyan-200 border border-cyan-800/30' : 'bg-cyan-50 text-cyan-800 border border-cyan-200'}`}>
                {current?.explanation}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Sidebar — Metrics & Info */}
          <div className="flex flex-col gap-4">
            {/* Stats */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className={`rounded-2xl border p-4 ${dark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/85'}`}>
              <h3 className={`text-xs font-semibold uppercase tracking-[0.2em] mb-3 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                <Zap className="h-3 w-3 inline mr-1" /> Metrics
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Water', value: current?.totalWater ?? 0, icon: '💧' },
                  { label: 'Operations', value: current?.operations ?? 0, icon: '⚙️' },
                  { label: 'Step', value: `${stepIdx + 1}/${steps.length}`, icon: '📍' },
                  { label: 'Bars', value: heights.length, icon: '📊' },
                ].map(m => (
                  <div key={m.label} className={`p-2.5 rounded-xl text-center ${dark ? 'bg-slate-800/60' : 'bg-slate-50 border border-slate-100'}`}>
                    <div className="text-lg">{m.icon}</div>
                    <div className={`text-lg font-black ${dark ? 'text-white' : 'text-slate-900'}`}>{m.value}</div>
                    <div className={`text-[10px] ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{m.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Stack visualization for stack approach */}
            {approach === 'stack' && current?.stack && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className={`rounded-2xl border p-4 ${dark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/85'}`}>
                <h3 className={`text-xs font-semibold uppercase tracking-[0.2em] mb-2 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Stack State
                </h3>
                <div className="flex gap-1 flex-wrap">
                  {current.stack.map((idx, i) => (
                    <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className={`px-2 py-1 rounded-lg text-xs font-bold ${dark ? 'bg-purple-900/40 text-purple-300 border border-purple-700/30' : 'bg-purple-50 text-purple-700 border border-purple-200'}`}>
                      [{idx}]={heights[idx]}
                    </motion.div>
                  ))}
                  {current.stack.length === 0 && <span className={`text-xs ${dark ? 'text-slate-600' : 'text-slate-400'}`}>Empty</span>}
                </div>
              </motion.div>
            )}

            {/* DP arrays for dp approach */}
            {approach === 'dp' && current?.leftMax?.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className={`rounded-2xl border p-4 ${dark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/85'}`}>
                <h3 className={`text-xs font-semibold uppercase tracking-[0.2em] mb-2 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Prefix Arrays
                </h3>
                <div className="space-y-2">
                  <div><span className="text-[10px] text-green-400 font-bold">leftMax:</span>
                    <span className={`text-xs font-mono ml-1 ${dark ? 'text-slate-300' : 'text-slate-700'}`}>[{current.leftMax.join(', ')}]</span></div>
                  <div><span className="text-[10px] text-blue-400 font-bold">rightMax:</span>
                    <span className={`text-xs font-mono ml-1 ${dark ? 'text-slate-300' : 'text-slate-700'}`}>[{current.rightMax.join(', ')}]</span></div>
                </div>
              </motion.div>
            )}

            {/* Achievements */}
            {achievements.length > 0 && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className={`rounded-2xl border p-4 ${dark ? 'border-yellow-800/30 bg-yellow-950/20' : 'border-yellow-200 bg-yellow-50'}`}>
                <h3 className={`text-xs font-semibold uppercase tracking-[0.2em] mb-2 flex items-center gap-1 ${dark ? 'text-yellow-400' : 'text-yellow-700'}`}>
                  <Trophy className="h-3 w-3" /> Achievements
                </h3>
                {achievements.map((a, i) => (
                  <motion.div key={i} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.15 }}
                    className={`text-sm py-1 ${dark ? 'text-yellow-200' : 'text-yellow-800'}`}>{a}</motion.div>
                ))}
              </motion.div>
            )}

            {/* Learning tip */}
            <div className={`rounded-2xl border p-4 ${dark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/85'}`}>
              <h3 className={`text-xs font-semibold uppercase tracking-[0.2em] mb-2 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                <Sparkles className="h-3 w-3 inline mr-1" /> Interview Tip
              </h3>
              <p className={`text-xs leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                {approach === 'twopointer'
                  ? 'The Two Pointer approach is the gold standard. Start both pointers at edges and move the smaller side inward. No extra space needed!'
                  : approach === 'dp'
                  ? 'DP precomputes leftMax and rightMax arrays. Good for explaining the logic clearly before optimizing to two pointers.'
                  : approach === 'stack'
                  ? 'Monotonic stack computes water layer-by-layer horizontally. Great for showing stack-based thinking in interviews.'
                  : 'Brute force is a good starting point. For each bar, scan left and right for the max — then optimize from there.'}
              </p>
            </div>
          </div>
        </div>

        {/* Code Display */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <CodeDisplay code={code} language={language} title={`Trapping Rain Water — ${APPROACHES.find(a => a.key === approach)?.label}`} currentLine={current?.highlightLine} />
        </motion.div>
      </div>
    </div>
  );
};

export default TrappingWater;

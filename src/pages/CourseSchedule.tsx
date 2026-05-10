import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, RotateCcw, Sparkles, Zap, GraduationCap, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import CodeDisplay from '../components/CodeDisplay';
import { CourseScheduleEngine, CourseStep } from '../logic/courseschedule/engine';
import { generateCourseScheduleCode } from '../logic/courseschedule/codegen';

const PRESETS = [
  { key: 'linear' as const, label: 'Linear' },
  { key: 'tree' as const, label: 'Tree' },
  { key: 'random' as const, label: 'Random' },
  { key: 'cycle' as const, label: 'Has Cycle' },
];

const CourseSchedule: React.FC = () => {
  const { theme, language } = useApp();
  const dark = theme === 'dark';

  const [config, setConfig] = useState(() => CourseScheduleEngine.generate('linear', 6));
  const [steps, setSteps] = useState<CourseStep[]>([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const run = useCallback(() => {
    const engine = new CourseScheduleEngine();
    setSteps(engine.solve(config.numCourses, config.prerequisites));
    setStepIdx(0);
    setPlaying(false);
  }, [config]);

  useEffect(() => { run(); }, [run]);

  useEffect(() => {
    if (playing && stepIdx < steps.length - 1) {
      timerRef.current = setTimeout(() => setStepIdx(i => i + 1), speed);
    } else if (stepIdx >= steps.length - 1) setPlaying(false);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [playing, stepIdx, steps.length, speed]);

  const current = steps[stepIdx] || steps[0];
  const code = generateCourseScheduleCode(language);

  // Simple circular layout for graph
  const nodePositions = useMemo(() => {
    const n = config.numCourses;
    const cx = 160, cy = 140, r = 110;
    return Array.from({ length: n }, (_, i) => {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
    });
  }, [config.numCourses]);

  const isProcessed = (node: number) => current?.order?.includes(node);
  const isInQueue = (node: number) => current?.queue?.includes(node);

  return (
    <div className={`min-h-screen px-4 py-6 sm:px-6 lg:px-8 ${dark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="mx-auto max-w-7xl flex flex-col gap-5">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl border p-5 shadow-xl backdrop-blur ${dark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/85'}`}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-sky-400">
                <GraduationCap className="h-4 w-4" /> Course Schedule
              </div>
              <h1 className={`text-2xl font-black tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>
                Topological Sort Visualizer
              </h1>
            </div>
            <div className="flex gap-2 flex-wrap">
              {PRESETS.map(p => (
                <button key={p.key} onClick={() => setConfig(CourseScheduleEngine.generate(p.key, 6))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${p.key === 'cycle' ? 'bg-red-900/30 text-red-300 hover:bg-red-900/50' : dark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr,340px] gap-5">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`rounded-3xl border p-5 shadow-xl ${dark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/85'}`}>
            {/* Graph */}
            <div className={`rounded-2xl border p-4 ${dark ? 'border-white/5 bg-slate-950/60' : 'border-slate-100 bg-slate-50'}`}>
              <svg viewBox="0 0 320 280" className="w-full max-w-md mx-auto">
                {/* Edges */}
                {config.prerequisites.map(([a, b], i) => {
                  const from = nodePositions[b];
                  const to = nodePositions[a];
                  if (!from || !to) return null;
                  const isActive = current?.activeEdges?.some(([ea, eb]) => ea === b && eb === a);
                  return (
                    <g key={i}>
                      <defs><marker id={`arrow-${i}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                        <path d="M0,0 L6,3 L0,6" fill={isActive ? '#38bdf8' : dark ? '#475569' : '#94a3b8'} />
                      </marker></defs>
                      <line x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                        stroke={isActive ? '#38bdf8' : dark ? '#475569' : '#cbd5e1'}
                        strokeWidth={isActive ? 2.5 : 1.5}
                        markerEnd={`url(#arrow-${i})`}
                        opacity={isActive ? 1 : 0.5} />
                    </g>
                  );
                })}
                {/* Nodes */}
                {nodePositions.map((pos, i) => {
                  const processed = isProcessed(i);
                  const queued = isInQueue(i);
                  return (
                    <g key={i}>
                      <circle cx={pos.x} cy={pos.y} r={18}
                        fill={processed ? (dark ? '#0ea5e9' : '#38bdf8') : queued ? (dark ? '#a855f7' : '#c084fc') : dark ? '#1e293b' : '#f1f5f9'}
                        stroke={processed ? '#0ea5e9' : queued ? '#a855f7' : dark ? '#475569' : '#cbd5e1'}
                        strokeWidth={2} />
                      <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="central"
                        fill={processed || queued ? 'white' : dark ? '#94a3b8' : '#475569'}
                        fontSize="12" fontWeight="bold">{i}</text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Order display */}
            {current?.order && current.order.length > 0 && (
              <div className="flex gap-1.5 mt-3 flex-wrap items-center">
                <span className={`text-xs font-semibold ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Order:</span>
                {current.order.map((node, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span className={`text-xs ${dark ? 'text-slate-600' : 'text-slate-400'}`}>→</span>}
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className={`px-2 py-0.5 rounded-lg text-xs font-bold ${dark ? 'bg-sky-900/40 text-sky-300' : 'bg-sky-100 text-sky-700'}`}>
                      {node}
                    </motion.span>
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* Cycle Warning */}
            {current?.hasCycle && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className={`mt-3 p-3 rounded-xl flex items-center gap-2 ${dark ? 'bg-red-950/30 text-red-300 border border-red-800/30' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                <AlertTriangle className="h-4 w-4" /> Cycle Detected! Cannot complete all courses.
              </motion.div>
            )}

            {/* Controls */}
            <div className="flex items-center gap-3 mt-4">
              <button onClick={() => { setStepIdx(0); setPlaying(false); }}
                className={`p-2 rounded-xl ${dark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                <RotateCcw className="h-4 w-4" />
              </button>
              <button onClick={() => setPlaying(!playing)}
                className="p-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-lg">
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              <button onClick={() => setStepIdx(i => Math.min(steps.length - 1, i + 1))}
                className={`p-2 rounded-xl ${dark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                <SkipForward className="h-4 w-4" />
              </button>
              <div className="flex-1" />
              <input type="range" min={200} max={1500} step={100} value={1700 - speed}
                onChange={e => setSpeed(1700 - Number(e.target.value))} className="w-24 accent-sky-500" />
              <span className={`text-xs font-mono ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{stepIdx + 1}/{steps.length}</span>
            </div>
            <div className={`h-1.5 rounded-full mt-3 ${dark ? 'bg-slate-800' : 'bg-slate-200'}`}>
              <motion.div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-500"
                animate={{ width: `${steps.length > 1 ? (stepIdx / (steps.length - 1)) * 100 : 0}%` }} />
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={stepIdx} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className={`mt-3 p-3 rounded-xl text-sm ${dark ? 'bg-sky-950/30 text-sky-200 border border-sky-800/30' : 'bg-sky-50 text-sky-800 border border-sky-200'}`}>
                {current?.explanation}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className={`rounded-2xl border p-4 ${dark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/85'}`}>
              <h3 className={`text-xs font-semibold uppercase tracking-[0.2em] mb-3 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                <Zap className="h-3 w-3 inline mr-1" /> In-Degree
              </h3>
              <div className="flex gap-1 flex-wrap">
                {(current?.inDegree ?? []).map((deg, i) => (
                  <div key={i} className={`px-2 py-1 rounded-lg text-xs font-mono ${deg === 0 ? (dark ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-700') : dark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                    {i}:{deg}
                  </div>
                ))}
              </div>
            </motion.div>

            <div className={`rounded-2xl border p-4 ${dark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/85'}`}>
              <h3 className={`text-xs font-semibold uppercase tracking-[0.2em] mb-2 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                <Sparkles className="h-3 w-3 inline mr-1" /> Kahn's Algorithm
              </h3>
              <p className={`text-xs leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                Start with all nodes having in-degree 0. Process each, reduce neighbors' in-degrees. If a neighbor reaches 0, enqueue it. If all nodes processed → valid topological order!
              </p>
            </div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <CodeDisplay code={code} language={language} title="Course Schedule — Kahn's Topological Sort" currentLine={current?.highlightLine} />
        </motion.div>
      </div>
    </div>
  );
};

export default CourseSchedule;

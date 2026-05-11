import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  CheckCircle2,
  ChevronRight,
  Flame,
  Lock,
  Map,
  PlayCircle,
  Star,
  Trophy,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLearning } from '../context/LearningContext';
import { algorithms, algorithmCategories } from '../lib/algorithmCatalog';
import type { AlgorithmMeta, AlgorithmCategoryId } from '../lib/algorithmCatalog';

/* ──────────────────────────────────────────────────────────────────────────
   Category color palettes
─────────────────────────────────────────────────────────────────────────── */
const CATEGORY_COLORS: Record<AlgorithmCategoryId, { bg: string; border: string; text: string; glow: string }> = {
  graphs: {
    bg: 'from-teal-500 to-cyan-500',
    border: 'border-teal-400',
    text: 'text-teal-400',
    glow: 'shadow-teal-500/40',
  },
  'dynamic-programming': {
    bg: 'from-blue-500 to-indigo-600',
    border: 'border-blue-400',
    text: 'text-blue-400',
    glow: 'shadow-blue-500/40',
  },
  'arrays-intervals': {
    bg: 'from-violet-500 to-purple-600',
    border: 'border-violet-400',
    text: 'text-violet-400',
    glow: 'shadow-violet-500/40',
  },
  trees: {
    bg: 'from-green-500 to-emerald-600',
    border: 'border-green-400',
    text: 'text-green-400',
    glow: 'shadow-green-500/40',
  },
  backtracking: {
    bg: 'from-pink-500 to-rose-600',
    border: 'border-pink-400',
    text: 'text-pink-400',
    glow: 'shadow-pink-500/40',
  },
  'selection-heaps': {
    bg: 'from-amber-500 to-orange-500',
    border: 'border-amber-400',
    text: 'text-amber-400',
    glow: 'shadow-amber-500/40',
  },
};

/* ──────────────────────────────────────────────────────────────────────────
   Node offsets to make a winding Duolingo-style path
─────────────────────────────────────────────────────────────────────────── */
const OFFSETS = [0, 80, 140, 60, -60, -140, -80, 0, 60, 140, 80, -40, -100, -20, 80, 140];

/* ──────────────────────────────────────────────────────────────────────────
   Status icon helper
─────────────────────────────────────────────────────────────────────────── */
function NodeStatusIcon({
  status,
  colors,
}: {
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  colors: (typeof CATEGORY_COLORS)[AlgorithmCategoryId];
}) {
  if (status === 'completed')
    return <CheckCircle2 className="h-8 w-8 text-white drop-shadow" />;
  if (status === 'in-progress')
    return <PlayCircle className="h-8 w-8 text-white drop-shadow animate-pulse" />;
  if (status === 'available')
    return <Star className={`h-8 w-8 text-white drop-shadow`} />;
  return <Lock className="h-6 w-6 text-white/60" />;
}

/* ──────────────────────────────────────────────────────────────────────────
   Single path node
─────────────────────────────────────────────────────────────────────────── */
interface PathNodeProps {
  algo: AlgorithmMeta;
  index: number;
  total: number;
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  offsetX: number;
  xp: number;
}

const PathNode: React.FC<PathNodeProps> = ({ algo, index, status, offsetX, xp }) => {
  const navigate = useNavigate();
  const { markVisited } = useLearning();
  const colors = CATEGORY_COLORS[algo.category];
  const Icon = algo.icon;

  const [showTooltip, setShowTooltip] = useState(false);
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';

  const handleClick = () => {
    if (isLocked) return;
    markVisited(algo.id);
    navigate(algo.path);
  };

  return (
    <motion.div
      className="relative flex flex-col items-center"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, type: 'spring' }}
      style={{ marginLeft: offsetX }}
    >
      {/* Connector line above (except for first node) */}
      {index > 0 && (
        <div
          className={`absolute -top-10 left-1/2 -translate-x-1/2 w-1 h-10 rounded-full ${
            isCompleted ? `bg-gradient-to-b ${colors.bg}` : 'bg-gray-700/60'
          }`}
        />
      )}

      {/* Node button */}
      <div
        className="relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <motion.button
          whileHover={isLocked ? {} : { scale: 1.12, y: -4 }}
          whileTap={isLocked ? {} : { scale: 0.95 }}
          onClick={handleClick}
          disabled={isLocked}
          aria-label={`${algo.shortTitle} — ${status}`}
          className={`relative flex h-20 w-20 items-center justify-center rounded-full border-4 transition-all duration-300 ${
            isLocked
              ? 'cursor-not-allowed border-gray-700 bg-gray-800/70 opacity-50'
              : isCompleted
              ? `bg-gradient-to-br ${colors.bg} ${colors.border} shadow-xl ${colors.glow}`
              : status === 'available'
              ? `bg-gradient-to-br ${colors.bg} ${colors.border} shadow-2xl ring-4 ring-white/20 animate-[pulse_2s_ease-in-out_infinite]`
              : `bg-gradient-to-br ${colors.bg} ${colors.border} shadow-xl ${colors.glow}`
          }`}
        >
          {isCompleted && (
            <div className="absolute inset-0 rounded-full bg-white/10" />
          )}
          <NodeStatusIcon status={status} colors={colors} />

          {/* XP badge */}
          {xp > 0 && (
            <span className="absolute -bottom-1.5 -right-1.5 rounded-full bg-yellow-400 px-1.5 py-0.5 text-[10px] font-bold text-yellow-900 shadow">
              {xp} XP
            </span>
          )}
        </motion.button>

        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="pointer-events-none absolute bottom-full left-1/2 mb-3 w-48 -translate-x-1/2 rounded-2xl border border-gray-700 bg-gray-900/95 p-3 text-center shadow-2xl backdrop-blur-lg z-50"
            >
              <div className="mb-1 flex items-center justify-center gap-1">
                <Icon className={`h-4 w-4 ${colors.text}`} />
                <p className="text-sm font-bold text-white">{algo.shortTitle}</p>
              </div>
              <p className="text-[11px] text-gray-400">{algo.tagline}</p>
              <p className={`mt-1 text-[11px] font-semibold ${colors.text}`}>
                {algo.complexity}
              </p>
              {!isLocked && (
                <p className="mt-1.5 rounded-full bg-white/10 py-0.5 text-[10px] text-white/70">
                  {status === 'completed' ? '✓ Completed' : status === 'in-progress' ? '▶ In Progress' : '★ Start Now'}
                </p>
              )}
              {isLocked && <p className="mt-1 text-[10px] text-amber-400">🔒 Complete previous to unlock</p>}
              {/* Arrow */}
              <div className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-gray-900 border-r border-b border-gray-700" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Label below */}
      <div className="mt-3 text-center max-w-[88px]">
        <p className={`text-xs font-semibold leading-tight ${isLocked ? 'text-gray-600' : 'text-white'}`}>
          {algo.shortTitle}
        </p>
        {!isLocked && (
          <p className={`mt-0.5 text-[10px] ${colors.text}`}>{algo.complexity}</p>
        )}
      </div>
    </motion.div>
  );
};

/* ──────────────────────────────────────────────────────────────────────────
   Category section header
─────────────────────────────────────────────────────────────────────────── */
const CategoryBanner: React.FC<{ categoryId: AlgorithmCategoryId; completedInCat: number; totalInCat: number }> = ({
  categoryId,
  completedInCat,
  totalInCat,
}) => {
  const cat = algorithmCategories.find((c) => c.id === categoryId);
  if (!cat) return null;
  const colors = CATEGORY_COLORS[categoryId];
  const pct = Math.round((completedInCat / totalInCat) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      className={`mb-6 flex items-center gap-3 rounded-2xl border bg-gray-900/60 px-4 py-3 backdrop-blur-sm ${colors.border}`}
    >
      <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${colors.bg}`} />
      <div className="flex-1">
        <p className="text-sm font-bold text-white">{cat.label}</p>
        <p className="text-[11px] text-gray-400">{cat.description}</p>
      </div>
      <div className="text-right">
        <p className={`text-xs font-bold ${colors.text}`}>{pct}%</p>
        <div className="mt-1 h-1 w-16 overflow-hidden rounded-full bg-gray-700">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${colors.bg} transition-all duration-700`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
};

/* ──────────────────────────────────────────────────────────────────────────
   Streak bar (top)
─────────────────────────────────────────────────────────────────────────── */
const StreakBar: React.FC = () => {
  const { streak, totalCompleted, totalAvailable, levelProgress, xpToNextLevel } = useLearning();
  const { theme } = useApp();

  return (
    <div
      className={`sticky top-0 z-20 border-b px-4 py-3 backdrop-blur-md ${
        theme === 'dark'
          ? 'border-gray-700/50 bg-gray-900/85'
          : 'border-gray-200/60 bg-white/85'
      }`}
    >
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
        {/* Streak */}
        <div className="flex items-center gap-2">
          <Flame
            className={`h-6 w-6 ${streak.currentStreak > 0 ? 'text-orange-400 drop-shadow-[0_0_6px_rgba(251,146,60,0.7)]' : 'text-gray-600'}`}
          />
          <div>
            <p className={`text-lg font-black leading-none ${streak.currentStreak > 0 ? 'text-orange-400' : 'text-gray-500'}`}>
              {streak.currentStreak}
            </p>
            <p className="text-[10px] text-gray-500">day streak</p>
          </div>
        </div>

        {/* XP / Level */}
        <div className="flex flex-1 flex-col items-center">
          <div className="mb-1 flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-400" />
            <span className="text-xs font-bold text-yellow-400">Level {streak.level}</span>
            <span className="text-xs text-gray-500">· {streak.totalXP} XP · {xpToNextLevel} to next</span>
          </div>
          <div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-gray-700">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-400"
              initial={{ width: 0 }}
              animate={{ width: `${levelProgress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-400" />
          <div className="text-right">
            <p className="text-lg font-black leading-none text-blue-400">
              {totalCompleted}/{totalAvailable}
            </p>
            <p className="text-[10px] text-gray-500">completed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────────────────
   Milestone chest at the end
─────────────────────────────────────────────────────────────────────────── */
const MilestoneChest: React.FC<{ allDone: boolean }> = ({ allDone }) => (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ type: 'spring', delay: 0.5 }}
    className="mt-10 flex flex-col items-center gap-3"
  >
    <motion.div
      animate={allDone ? { rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] } : {}}
      transition={{ repeat: Infinity, repeatDelay: 3, duration: 0.6 }}
      className={`flex h-24 w-24 items-center justify-center rounded-3xl ${
        allDone
          ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-2xl shadow-yellow-500/40'
          : 'bg-gray-800 border-2 border-gray-700 opacity-50'
      }`}
    >
      <Award className={`h-14 w-14 ${allDone ? 'text-white' : 'text-gray-600'}`} />
    </motion.div>
    <p className={`text-sm font-bold ${allDone ? 'text-yellow-400' : 'text-gray-600'}`}>
      {allDone ? '🎉 All algorithms mastered!' : '🏆 Complete all to unlock the chest'}
    </p>
  </motion.div>
);

/* ──────────────────────────────────────────────────────────────────────────
   LeetCode Hard panel per category
─────────────────────────────────────────────────────────────────────────── */
const LeetCodePanel: React.FC<{ categoryId: AlgorithmCategoryId }> = ({ categoryId }) => {
  const cat = algorithmCategories.find((c) => c.id === categoryId);
  const colors = CATEGORY_COLORS[categoryId];
  const [open, setOpen] = useState(false);

  if (!cat?.leetcodeHard.length) return null;

  return (
    <div className="mt-2 mb-6">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
          open ? `${colors.border} text-white bg-gray-800/70` : 'border-gray-700 text-gray-500 hover:border-gray-600'
        }`}
      >
        <span>🔥 LeetCode Hard challenges</span>
        <ChevronRight className={`h-4 w-4 transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-2 space-y-1.5 px-1">
              {cat.leetcodeHard.map((p) => (
                <a
                  key={p.url}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition-all hover:bg-gray-800 border border-transparent hover:${colors.border}`}
                >
                  <span className="rounded bg-red-900/50 px-1.5 py-0.5 text-[9px] font-bold text-red-300">HARD</span>
                  <span className="text-gray-300">{p.title}</span>
                  <ChevronRight className="ml-auto h-3 w-3 text-gray-600" />
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────────────────
   Main Learning Path page
─────────────────────────────────────────────────────────────────────────── */
const LearningPath: React.FC = () => {
  const { theme } = useApp();
  const { algorithmProgress, streak, totalCompleted, totalAvailable } = useLearning();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Group algorithms by category while preserving path order
  const sections = algorithmCategories.map((cat) => ({
    category: cat,
    algos: algorithms.filter((a) => a.category === cat.id),
  })).filter((s) => s.algos.length > 0);

  const allDone = totalCompleted === totalAvailable;

  // Scroll to first available node on mount
  useEffect(() => {
    const firstAvailableIdx = algorithms.findIndex(
      (a) => algorithmProgress[a.id]?.status === 'available'
    );
    if (firstAvailableIdx > 0 && scrollRef.current) {
      setTimeout(() => {
        const nodes = scrollRef.current!.querySelectorAll('[data-node]');
        nodes[firstAvailableIdx]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 600);
    }
  }, [algorithmProgress]);

  let globalIndex = 0;

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        theme === 'dark'
          ? 'bg-gradient-to-b from-gray-900 via-slate-900 to-indigo-950'
          : 'bg-gradient-to-b from-blue-50 via-white to-indigo-50'
      }`}
    >
      {/* Sticky streak bar */}
      <StreakBar />

      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-semibold text-blue-300">
            <Map className="h-4 w-4" />
            Guided Learning Path
          </div>
          <h1 className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Your Algorithm Journey
          </h1>
          <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Complete visualizations to earn XP, maintain your streak, and unlock the next algorithm.
          </p>

          {/* Stats row */}
          <div className="mt-4 flex items-center justify-center gap-6 text-sm">
            <span className="flex items-center gap-1 text-orange-400 font-semibold">
              <Flame className="h-4 w-4" />
              {streak.currentStreak} day streak
            </span>
            <span className="flex items-center gap-1 text-yellow-400 font-semibold">
              <Trophy className="h-4 w-4" />
              {streak.totalXP} XP
            </span>
            <span className="flex items-center gap-1 text-blue-400 font-semibold">
              <Zap className="h-4 w-4" />
              {totalCompleted}/{totalAvailable} done
            </span>
          </div>
        </motion.div>

        {/* Path sections */}
        <div ref={scrollRef}>
          {sections.map(({ category, algos }) => {
            const completedInCat = algos.filter(
              (a) => algorithmProgress[a.id]?.status === 'completed'
            ).length;

            return (
              <div key={category.id} className="mb-12">
                {/* Category banner */}
                <CategoryBanner
                  categoryId={category.id}
                  completedInCat={completedInCat}
                  totalInCat={algos.length}
                />

                {/* Winding path nodes */}
                <div className="flex flex-col items-center gap-10 py-4">
                  {algos.map((algo) => {
                    const idx = globalIndex++;
                    const status = algorithmProgress[algo.id]?.status ?? 'locked';
                    const xp = algorithmProgress[algo.id]?.xp ?? 0;
                    const offsetX = OFFSETS[idx % OFFSETS.length] ?? 0;

                    return (
                      <div key={algo.id} data-node className="w-full flex justify-center">
                        <PathNode
                          algo={algo}
                          index={idx}
                          total={algorithms.length}
                          status={status}
                          offsetX={offsetX}
                          xp={xp}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* LeetCode Hard challenges for this category */}
                <LeetCodePanel categoryId={category.id} />
              </div>
            );
          })}
        </div>

        {/* Final chest */}
        <MilestoneChest allDone={allDone} />

        {/* Back to home */}
        <div className="mt-12 pb-16 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-2xl border border-gray-700 px-6 py-3 text-sm font-semibold text-gray-300 transition-all hover:border-blue-500 hover:text-blue-300"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LearningPath;

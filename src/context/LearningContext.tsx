import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';
import { algorithms } from '../lib/algorithmCatalog';

/* ──────────────────────────────────────────────────────────────────────────
   Types
─────────────────────────────────────────────────────────────────────────── */
export type AlgorithmStatus = 'locked' | 'available' | 'in-progress' | 'completed';

export interface AlgorithmProgress {
  algorithmId: string;
  status: AlgorithmStatus;
  xp: number;
  completedAt?: string;
  visitCount: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  totalXP: number;
  level: number;
}

interface LearningContextValue {
  algorithmProgress: Record<string, AlgorithmProgress>;
  streak: StreakData;
  markVisited: (algorithmId: string) => void;
  markCompleted: (algorithmId: string, xpEarned?: number) => void;
  getStatusFor: (algorithmId: string) => AlgorithmStatus;
  resetProgress: () => Promise<{ error?: string }>;
  totalCompleted: number;
  totalAvailable: number;
  xpToNextLevel: number;
  levelProgress: number; // 0-100
}

/* ──────────────────────────────────────────────────────────────────────────
   Helpers
─────────────────────────────────────────────────────────────────────────── */
const XP_PER_LEVEL = 500;
const today = () => new Date().toISOString().slice(0, 10);
const yesterday = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
};

const computeLevel = (xp: number) => Math.floor(xp / XP_PER_LEVEL) + 1;

const STORAGE_KEY = 'algoquest_learning_v2';

const defaultProgress = (): Record<string, AlgorithmProgress> => {
  // First algorithm is always available; rest start as locked until previous is visited.
  return Object.fromEntries(
    algorithms.map((algo, idx) => [
      algo.id,
      {
        algorithmId: algo.id,
        status: idx === 0 ? 'available' : 'locked',
        xp: 0,
        visitCount: 0,
      } as AlgorithmProgress,
    ])
  );
};

const defaultStreak = (): StreakData => ({
  currentStreak: 0,
  longestStreak: 0,
  lastActivityDate: null,
  totalXP: 0,
  level: 1,
});

/* ──────────────────────────────────────────────────────────────────────────
   Context
─────────────────────────────────────────────────────────────────────────── */
const LearningContext = createContext<LearningContextValue | undefined>(undefined);

export const LearningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [algorithmProgress, setAlgorithmProgress] = useState<Record<string, AlgorithmProgress>>(
    () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as { progress: Record<string, AlgorithmProgress>; streak: StreakData };
          return parsed.progress ?? defaultProgress();
        }
      } catch {
        /* ignore */
      }
      return defaultProgress();
    }
  );

  const [streak, setStreak] = useState<StreakData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as { progress: Record<string, AlgorithmProgress>; streak: StreakData };
        return parsed.streak ?? defaultStreak();
      }
    } catch {
      /* ignore */
    }
    return defaultStreak();
  });

  // Persist to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ progress: algorithmProgress, streak }));
  }, [algorithmProgress, streak]);

  // Sync to Supabase profiles.progress when user is signed in
  useEffect(() => {
    if (!user || !supabase) return;
    const payload = { progress: { algorithms: algorithmProgress, streak } };
    supabase.from('profiles').update(payload).eq('id', user.id).then(() => {/* noop */});
  }, [user, algorithmProgress, streak]);

  // Load from Supabase on sign-in
  useEffect(() => {
    if (!user || !supabase) return;
    supabase
      .from('profiles')
      .select('progress')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data?.progress) {
          const remote = data.progress as { algorithms?: Record<string, AlgorithmProgress>; streak?: StreakData };
          if (remote.algorithms) setAlgorithmProgress(remote.algorithms);
          if (remote.streak) setStreak(remote.streak);
        }
      });
  }, [user]);

  const updateStreak = useCallback(() => {
    setStreak((prev) => {
      const todayStr = today();
      const yestStr = yesterday();

      if (prev.lastActivityDate === todayStr) {
        // Already counted today
        return prev;
      }

      let newCurrentStreak = prev.currentStreak;
      if (prev.lastActivityDate === yestStr) {
        newCurrentStreak += 1;
      } else if (prev.lastActivityDate !== todayStr) {
        newCurrentStreak = 1; // streak broken or first time
      }

      return {
        ...prev,
        currentStreak: newCurrentStreak,
        longestStreak: Math.max(prev.longestStreak, newCurrentStreak),
        lastActivityDate: todayStr,
      };
    });
  }, []);

  const unlockNext = useCallback((completedId: string) => {
    const idx = algorithms.findIndex((a) => a.id === completedId);
    if (idx === -1 || idx >= algorithms.length - 1) return;
    const nextId = algorithms[idx + 1].id;
    setAlgorithmProgress((prev) => {
      if (prev[nextId]?.status === 'locked') {
        return {
          ...prev,
          [nextId]: { ...prev[nextId], status: 'available' },
        };
      }
      return prev;
    });
  }, []);

  const markVisited = useCallback(
    (algorithmId: string) => {
      updateStreak();
      setAlgorithmProgress((prev) => {
        const current = prev[algorithmId];
        if (!current) return prev;
        if (current.status === 'completed') return prev;
        return {
          ...prev,
          [algorithmId]: {
            ...current,
            status: 'in-progress',
            visitCount: current.visitCount + 1,
          },
        };
      });
      unlockNext(algorithmId);
    },
    [updateStreak, unlockNext]
  );

  const markCompleted = useCallback(
    (algorithmId: string, xpEarned = 100) => {
      updateStreak();
      setAlgorithmProgress((prev) => {
        const current = prev[algorithmId];
        if (!current || current.status === 'completed') return prev;
        return {
          ...prev,
          [algorithmId]: {
            ...current,
            status: 'completed',
            xp: current.xp + xpEarned,
            completedAt: new Date().toISOString(),
            visitCount: current.visitCount + 1,
          },
        };
      });
      setStreak((prev) => {
        const newXP = prev.totalXP + xpEarned;
        return { ...prev, totalXP: newXP, level: computeLevel(newXP) };
      });
      unlockNext(algorithmId);
    },
    [updateStreak, unlockNext]
  );

  const getStatusFor = useCallback(
    (algorithmId: string): AlgorithmStatus => {
      return algorithmProgress[algorithmId]?.status ?? 'locked';
    },
    [algorithmProgress]
  );

  const resetProgress = useCallback(async () => {
    const resetAlgorithms = defaultProgress();
    const resetStreak = defaultStreak();

    setAlgorithmProgress(resetAlgorithms);
    setStreak(resetStreak);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ progress: resetAlgorithms, streak: resetStreak }));
    } catch {
      /* ignore */
    }

    if (user && supabase) {
      const { error } = await supabase
        .from('profiles')
        .update({ progress: { algorithms: resetAlgorithms, streak: resetStreak } })
        .eq('id', user.id);

      if (error) {
        return { error: error.message };
      }
    }

    return {};
  }, [user]);

  const totalCompleted = useMemo(
    () => Object.values(algorithmProgress).filter((p) => p.status === 'completed').length,
    [algorithmProgress]
  );

  const totalAvailable = algorithms.length;

  const xpToNextLevel = useMemo(() => {
    const xp = streak.totalXP;
    return XP_PER_LEVEL - (xp % XP_PER_LEVEL);
  }, [streak.totalXP]);

  const levelProgress = useMemo(() => {
    const xp = streak.totalXP;
    return ((xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100;
  }, [streak.totalXP]);

  const value = useMemo<LearningContextValue>(
    () => ({
      algorithmProgress,
      streak,
      markVisited,
      markCompleted,
      getStatusFor,
      resetProgress,
      totalCompleted,
      totalAvailable,
      xpToNextLevel,
      levelProgress,
    }),
    [
      algorithmProgress,
      streak,
      markVisited,
      markCompleted,
      getStatusFor,
      resetProgress,
      totalCompleted,
      totalAvailable,
      xpToNextLevel,
      levelProgress,
    ]
  );

  return <LearningContext.Provider value={value}>{children}</LearningContext.Provider>;
};

export const useLearning = () => {
  const ctx = useContext(LearningContext);
  if (!ctx) throw new Error('useLearning must be used within LearningProvider');
  return ctx;
};

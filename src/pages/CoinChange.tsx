import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, RotateCcw, Sparkles, Zap, Coins } from 'lucide-react';
import { useApp } from '../context/AppContext';
import CodeDisplay from '../components/CodeDisplay';
import { CoinChangeEngine, CoinChangeStep } from '../logic/coinchange/engine';
import { generateCoinChangeCode } from '../logic/coinchange/codegen';

const CoinChange: React.FC = () => {
  const { theme, language } = useApp();
  const dark = theme === 'dark';

  const [coins, setCoins] = useState([1, 5, 10, 25]);
  const [amount, setAmount] = useState(36);
  const [steps, setSteps] = useState<CoinChangeStep[]>([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(400);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const engine = useMemo(() => new CoinChangeEngine(), []);

  const run = useCallback(() => {
    setSteps(engine.solve(coins, amount));
    setStepIdx(0);
    setPlaying(false);
  }, [engine, coins, amount]);

  useEffect(() => { run(); }, [run]);

  useEffect(() => {
    if (playing && stepIdx < steps.length - 1) {
      timerRef.current = setTimeout(() => setStepIdx(i => i + 1), speed);
    } else if (stepIdx >= steps.length - 1) setPlaying(false);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [playing, stepIdx, steps.length, speed]);

  const current = steps[stepIdx] || steps[0];
  const dp = current?.dp ?? [];
  const code = generateCoinChangeCode(language);

  const COIN_COLORS = ['from-amber-400 to-yellow-500', 'from-slate-300 to-slate-400', 'from-amber-600 to-orange-600', 'from-yellow-300 to-amber-400'];

  return (
    <div className={`min-h-screen px-4 py-6 sm:px-6 lg:px-8 ${dark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="mx-auto max-w-7xl flex flex-col gap-5">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl border p-5 shadow-xl backdrop-blur ${dark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/85'}`}>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-yellow-400">
              <Coins className="h-4 w-4" /> Coin Change
            </div>
            <h1 className={`text-2xl font-black tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>
              Minimum Coins Calculator
            </h1>
          </div>
          <div className="mt-4 flex gap-4 flex-wrap items-end">
            <label className="space-y-1">
              <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Coins</span>
              <input value={coins.join(', ')} onChange={e => { const a = e.target.value.split(',').map(Number).filter(n => n > 0); if (a.length > 0) setCoins(a); }}
                className={`w-44 rounded-xl border px-3 py-2 text-sm font-mono ${dark ? 'border-white/10 bg-slate-950/70 text-white' : 'border-slate-200 bg-white text-slate-900'}`} />
            </label>
            <label className="space-y-1">
              <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Amount</span>
              <input type="number" min={1} max={200} value={amount} onChange={e => setAmount(Math.max(1, Math.min(200, Number(e.target.value))))}
                className={`w-20 rounded-xl border px-3 py-2 text-sm font-bold ${dark ? 'border-white/10 bg-slate-950/70 text-white' : 'border-slate-200 bg-white text-slate-900'}`} />
            </label>
          </div>
          {/* Coin display */}
          <div className="flex gap-3 mt-4">
            {coins.map((c, i) => (
              <motion.div key={i} whileHover={{ scale: 1.1, y: -2 }}
                className={`w-12 h-12 rounded-full bg-gradient-to-br ${COIN_COLORS[i % COIN_COLORS.length]} flex items-center justify-center text-sm font-black text-white shadow-lg cursor-default`}>
                {c}¢
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr,320px] gap-5">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`rounded-3xl border p-5 shadow-xl ${dark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/85'}`}>
            {/* DP Array */}
            <div className={`rounded-2xl border p-4 overflow-auto ${dark ? 'border-white/5 bg-slate-950/60' : 'border-slate-100 bg-slate-50'}`}>
              <h4 className={`text-xs font-semibold uppercase tracking-widest mb-3 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
                DP Array — dp[i] = min coins for amount i
              </h4>
              <div className="flex gap-0.5 flex-wrap">
                {dp.slice(0, Math.min(dp.length, 80)).map((val, i) => {
                  const isActive = current?.currentAmount === i;
                  const isFinal = current?.type === 'complete' && i === amount;
                  return (
                    <motion.div key={i}
                      animate={{ scale: isActive ? 1.15 : 1 }}
                      className={`w-8 h-10 flex flex-col items-center justify-center rounded text-[9px] border transition-all ${
                        isFinal ? 'bg-yellow-500/30 border-yellow-500 text-yellow-300 font-black' :
                        isActive ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold' :
                        val <= amount ? (dark ? 'bg-slate-800/60 border-slate-700/30 text-slate-300' : 'bg-white border-slate-200 text-slate-600') :
                        dark ? 'bg-slate-900 border-slate-800 text-slate-700' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>
                      <span className="font-bold">{val > amount ? '∞' : val}</span>
                      <span className={`text-[7px] ${dark ? 'text-slate-600' : 'text-slate-400'}`}>{i}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Optimal coins used */}
            {current?.type === 'complete' && current.coinsUsed[amount]?.length > 0 && (
              <div className="mt-4">
                <h4 className={`text-xs font-semibold uppercase tracking-widest mb-2 ${dark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                  Optimal Combination
                </h4>
                <div className="flex gap-2 flex-wrap">
                  {current.coinsUsed[amount].map((c, i) => (
                    <motion.div key={i} initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: i * 0.1 }}
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${COIN_COLORS[coins.indexOf(c) % COIN_COLORS.length]} flex items-center justify-center text-xs font-black text-white shadow-lg`}>
                      {c}
                    </motion.div>
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
                className="p-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg">
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              <button onClick={() => setStepIdx(i => Math.min(steps.length - 1, i + 1))}
                className={`p-2 rounded-xl ${dark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                <SkipForward className="h-4 w-4" />
              </button>
              <div className="flex-1" />
              <input type="range" min={100} max={1000} step={100} value={1100 - speed}
                onChange={e => setSpeed(1100 - Number(e.target.value))} className="w-24 accent-yellow-500" />
              <span className={`text-xs font-mono ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{stepIdx + 1}/{steps.length}</span>
            </div>
            <div className={`h-1.5 rounded-full mt-3 ${dark ? 'bg-slate-800' : 'bg-slate-200'}`}>
              <motion.div className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-amber-500"
                animate={{ width: `${steps.length > 1 ? (stepIdx / (steps.length - 1)) * 100 : 0}%` }} />
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={stepIdx} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className={`mt-3 p-3 rounded-xl text-sm ${dark ? 'bg-yellow-950/30 text-yellow-200 border border-yellow-800/30' : 'bg-yellow-50 text-yellow-800 border border-yellow-200'}`}>
                {current?.explanation}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className={`rounded-2xl border p-4 ${dark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/85'}`}>
              <h3 className={`text-xs font-semibold uppercase tracking-[0.2em] mb-3 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                <Zap className="h-3 w-3 inline mr-1" /> Info
              </h3>
              <div className="space-y-2">
                {[
                  { label: 'Amount', value: amount },
                  { label: 'Coins', value: coins.join(', ') },
                  { label: 'Result', value: current?.type === 'complete' ? (current.dp[amount] > amount ? 'Impossible' : `${current.dp[amount]} coins`) : '...' },
                ].map(m => (
                  <div key={m.label} className="flex justify-between">
                    <span className={`text-xs ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{m.label}</span>
                    <span className={`text-xs font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>{m.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className={`rounded-2xl border p-4 ${dark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/85'}`}>
              <h3 className={`text-xs font-semibold uppercase tracking-[0.2em] mb-2 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                <Sparkles className="h-3 w-3 inline mr-1" /> DP Recurrence
              </h3>
              <p className={`text-xs leading-relaxed font-mono ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                dp[i] = min(dp[i], dp[i - coin] + 1) for each coin ≤ i
              </p>
              <p className={`text-xs leading-relaxed mt-2 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                For each amount, try each coin and take the minimum. Classic unbounded knapsack variant!
              </p>
            </div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <CodeDisplay code={code} language={language} title="Coin Change — Bottom-Up DP" currentLine={current?.highlightLine} />
        </motion.div>
      </div>
    </div>
  );
};

export default CoinChange;

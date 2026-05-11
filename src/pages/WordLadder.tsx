import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Code2, Play, Route, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { bfsWordLadder, normalizeWord } from '../logic/wordladder/engine';
import { generateWordLadderCode } from '../logic/wordladder/codegen';
import CodeDisplay from '../components/CodeDisplay';

const DEFAULT_DICTIONARY = Array.from(
  new Set([
    'cold', 'cord', 'card', 'ward', 'warm', 'word', 'worm', 'bold', 'bald', 'told', 'torn', 'warn', 'barn',
    'lead', 'load', 'goad', 'gold', 'loan', 'lean', 'lend', 'land', 'lord', 'toll',
    'game', 'gate', 'gath', 'bath', 'math', 'gape', 'fame', 'same', 'lame', 'late', 'mate', 'path', 'mash',
    'hit', 'hot', 'dot', 'dog', 'cog', 'hog', 'log', 'lot', 'lit', 'pit', 'pig', 'fig', 'fog', 'fan', 'fun',
  ])
);

const WordLadder: React.FC = () => {
  const { theme, language } = useApp();
  const [beginWord, setBeginWord] = useState('cold');
  const [endWord, setEndWord] = useState('warm');
  const [resultPath, setResultPath] = useState<string[]>([]);
  const [status, setStatus] = useState('Enter a begin word and an end word, then run the ladder.');

  const code = generateWordLadderCode(
    normalizeWord(beginWord),
    normalizeWord(endWord),
    DEFAULT_DICTIONARY,
    language
  );

  const visualizationPath = useMemo(() => {
    if (resultPath.length > 0) return resultPath;
    return [normalizeWord(beginWord), normalizeWord(endWord)].filter(Boolean);
  }, [beginWord, endWord, resultPath]);

  const runSearch = () => {
    const start = normalizeWord(beginWord);
    const end = normalizeWord(endWord);

    if (!start || !end) {
      setResultPath([]);
      setStatus('Please enter both a begin word and an end word.');
      return;
    }

    const search = bfsWordLadder(start, end, DEFAULT_DICTIONARY);
    setResultPath(search.path);

    if (search.path.length > 0) {
      setStatus(`Found a ladder in ${search.path.length - 1} steps.`);
    } else {
      setStatus('No ladder found in the current built-in dictionary.');
    }
  };

  return (
    <div className={`min-h-screen px-4 py-6 sm:px-6 lg:px-8 ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl border p-5 shadow-xl backdrop-blur ${theme === 'dark' ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/85'}`}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-500">
                <Sparkles className="h-4 w-4" /> Word Ladder
              </div>
              <h1 className={`text-3xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Begin Word to End Word
              </h1>
              <p className={`max-w-2xl text-sm leading-6 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                Enter the begin word, enter the end word, and run the ladder. The page stays compact and readable.
              </p>
            </div>

            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${theme === 'dark' ? 'border-white/10 bg-white/5 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
              <Code2 className="h-4 w-4" /> Built-in dictionary
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-[1fr,1fr,auto]">
            <label className="space-y-2">
              <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Begin Word</span>
              <input
                value={beginWord}
                onChange={(event) => setBeginWord(normalizeWord(event.target.value))}
                className={`w-full rounded-2xl border px-4 py-3 text-lg font-black uppercase tracking-[0.18em] outline-none ${theme === 'dark' ? 'border-white/10 bg-slate-950/70 text-white' : 'border-slate-200 bg-white text-slate-900'}`}
                placeholder="cold"
              />
            </label>

            <label className="space-y-2">
              <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>End Word</span>
              <input
                value={endWord}
                onChange={(event) => setEndWord(normalizeWord(event.target.value))}
                className={`w-full rounded-2xl border px-4 py-3 text-lg font-black uppercase tracking-[0.18em] outline-none ${theme === 'dark' ? 'border-white/10 bg-slate-950/70 text-white' : 'border-slate-200 bg-white text-slate-900'}`}
                placeholder="warm"
              />
            </label>

            <button
              type="button"
              onClick={runSearch}
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-transform hover:-translate-y-0.5"
            >
              <Play className="h-4 w-4" /> Run
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl border p-5 shadow-xl ${theme === 'dark' ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/85'}`}
        >
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            <Route className="h-4 w-4" /> Visualization
          </div>

          <div className={`mt-4 overflow-hidden rounded-[1.75rem] border ${theme === 'dark' ? 'border-white/10 bg-slate-950/70' : 'border-slate-200 bg-slate-50'}`}>
            <div className="flex min-h-[320px] items-center justify-center px-4 py-8 sm:px-6">
              <div className="w-full max-w-5xl">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {visualizationPath.map((word, index) => (
                    <React.Fragment key={`${word}-${index}`}>
                      <div
                        className={`flex min-w-[88px] items-center justify-center rounded-full border px-4 py-3 text-sm font-black uppercase tracking-[0.2em] shadow-sm ${index === 0
                          ? 'border-cyan-300 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300'
                          : index === visualizationPath.length - 1
                            ? 'border-emerald-300 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300'
                            : 'border-amber-300 bg-amber-500/10 text-amber-600 dark:text-amber-300'
                        }`}
                      >
                        {word || '—'}
                      </div>

                      {index < visualizationPath.length - 1 && (
                        <ArrowRight className="h-5 w-5 text-slate-400" />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <p className={`text-base font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {status}
                  </p>
                  <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    The ladder is shown as one clean path so it stays readable on every screen size.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <CodeDisplay code={code} language={language} title="Code" />
        </motion.div>
      </div>
    </div>
  );
};

export default WordLadder;
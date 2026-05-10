import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Code2, Play, Route, Sparkles, Plus, X, BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { bfsWordLadder, normalizeWord } from '../logic/wordladder/engine';
import CodeDisplay from '../components/CodeDisplay';

const BUILT_IN_DICTIONARY = Array.from(
  new Set([
    'cold', 'cord', 'card', 'ward', 'warm', 'word', 'worm', 'bold', 'bald', 'told', 'torn', 'warn', 'barn',
    'lead', 'load', 'goad', 'gold', 'loan', 'lean', 'lend', 'land', 'lord', 'toll',
    'game', 'gate', 'gath', 'bath', 'math', 'gape', 'fame', 'same', 'lame', 'late', 'mate', 'path', 'mash',
    'hit', 'hot', 'dot', 'dog', 'cog', 'hog', 'log', 'lot', 'lit', 'pit', 'pig', 'fig', 'fog', 'fan', 'fun',
    'head', 'heal', 'heat', 'heap', 'hear', 'fear', 'feat', 'flat', 'flab', 'flag', 'flog',
    'sand', 'band', 'bond', 'bone', 'bore', 'core', 'care', 'dare', 'dark', 'darn', 'barn',
    'man', 'ban', 'bat', 'bit', 'sit', 'six', 'fix', 'fin', 'fun', 'sun', 'bun', 'but', 'cut', 'cat', 'car',
    'code', 'coke', 'cope', 'core', 'lore', 'lobe', 'love', 'live', 'like', 'bike', 'bake',
    'fast', 'fist', 'fish', 'dish', 'dash', 'cash', 'lash', 'last',
  ])
);

const CODE_SAMPLE = `function bfsWordLadder(startWord, endWord, words) {
  const queue = [startWord];
  const parents = new Map([[startWord, null]]);

  while (queue.length > 0) {
    const current = queue.shift();
    if (current === endWord) break;

    for (const neighbor of oneLetterNeighbors(current, words)) {
      if (parents.has(neighbor)) continue;
      parents.set(neighbor, current);
      queue.push(neighbor);
    }
  }

  return buildPath(parents, endWord);
}`;

const WordLadder: React.FC = () => {
  const { theme, language } = useApp();
  const dark = theme === 'dark';
  const [beginWord, setBeginWord] = useState('cold');
  const [endWord, setEndWord] = useState('warm');
  const [customWords, setCustomWords] = useState('');
  const [newWord, setNewWord] = useState('');
  const [addedWords, setAddedWords] = useState<string[]>([]);
  const [resultPath, setResultPath] = useState<string[]>([]);
  const [status, setStatus] = useState('Enter a begin word and an end word, then run the ladder.');
  const [showDictionary, setShowDictionary] = useState(false);

  // Merge built-in + user-added words
  const dictionary = useMemo(() => {
    const custom = customWords
      .split(/[\s,]+/)
      .map(w => w.toLowerCase().trim())
      .filter(w => w.length > 0);
    return Array.from(new Set([...BUILT_IN_DICTIONARY, ...addedWords, ...custom]));
  }, [customWords, addedWords]);

  const visualizationPath = useMemo(() => {
    if (resultPath.length > 0) return resultPath;
    return [normalizeWord(beginWord), normalizeWord(endWord)].filter(Boolean);
  }, [beginWord, endWord, resultPath]);

  const addWord = () => {
    const w = normalizeWord(newWord);
    if (w && !addedWords.includes(w)) {
      setAddedWords(prev => [...prev, w]);
      setNewWord('');
    }
  };

  const removeWord = (word: string) => {
    setAddedWords(prev => prev.filter(w => w !== word));
  };

  const runSearch = () => {
    const start = normalizeWord(beginWord);
    const end = normalizeWord(endWord);

    if (!start || !end) {
      setResultPath([]);
      setStatus('Please enter both a begin word and an end word.');
      return;
    }

    const search = bfsWordLadder(start, end, dictionary);
    setResultPath(search.path);

    if (search.path.length > 0) {
      setStatus(`Found a ladder in ${search.path.length - 1} steps using ${dictionary.length} dictionary words.`);
    } else {
      setStatus(`No ladder found. Try adding more words to the dictionary! (${dictionary.length} words available)`);
    }
  };

  return (
    <div className={`min-h-screen px-4 py-6 sm:px-6 lg:px-8 ${dark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl border p-5 shadow-xl backdrop-blur ${dark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/85'}`}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-500">
                <Sparkles className="h-4 w-4" /> Word Ladder
              </div>
              <h1 className={`text-3xl font-black tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>
                Begin Word to End Word
              </h1>
              <p className={`max-w-2xl text-sm leading-6 ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
                Transform one word into another, one letter at a time. Add your own words to expand the dictionary.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowDictionary(!showDictionary)}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition-all ${
                  showDictionary
                    ? 'border-cyan-300 bg-cyan-500/10 text-cyan-600 dark:border-cyan-500/30 dark:bg-cyan-950/40 dark:text-cyan-300'
                    : dark ? 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                Dictionary ({dictionary.length})
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-[1fr,1fr,auto]">
            <label className="space-y-2">
              <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Begin Word</span>
              <input
                value={beginWord}
                onChange={(event) => setBeginWord(normalizeWord(event.target.value))}
                className={`w-full rounded-2xl border px-4 py-3 text-lg font-black uppercase tracking-[0.18em] outline-none transition-all ${dark ? 'border-white/10 bg-slate-950/70 text-white focus:border-cyan-500/50' : 'border-slate-200 bg-white text-slate-900 focus:border-cyan-400'}`}
                placeholder="cold"
              />
            </label>

            <label className="space-y-2">
              <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${dark ? 'text-slate-400' : 'text-slate-500'}`}>End Word</span>
              <input
                value={endWord}
                onChange={(event) => setEndWord(normalizeWord(event.target.value))}
                className={`w-full rounded-2xl border px-4 py-3 text-lg font-black uppercase tracking-[0.18em] outline-none transition-all ${dark ? 'border-white/10 bg-slate-950/70 text-white focus:border-cyan-500/50' : 'border-slate-200 bg-white text-slate-900 focus:border-cyan-400'}`}
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

          {/* Dictionary Panel */}
          <AnimatePresence>
            {showDictionary && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className={`mt-4 p-4 rounded-2xl border ${dark ? 'border-white/10 bg-slate-950/50' : 'border-slate-200 bg-slate-50'}`}>
                  <h3 className={`text-xs font-semibold uppercase tracking-[0.2em] mb-3 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Custom Dictionary Input
                  </h3>
                  
                  {/* Add individual words */}
                  <div className="flex gap-2 mb-3">
                    <input
                      value={newWord}
                      onChange={(e) => setNewWord(e.target.value.toLowerCase())}
                      onKeyDown={(e) => e.key === 'Enter' && addWord()}
                      placeholder="Type a word and press Enter"
                      className={`flex-1 rounded-xl border px-3 py-2 text-sm outline-none transition-all ${dark ? 'border-white/10 bg-slate-900/70 text-white placeholder-slate-500 focus:border-cyan-500/50' : 'border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-cyan-400'}`}
                    />
                    <button onClick={addWord}
                      className="px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Bulk paste */}
                  <textarea
                    value={customWords}
                    onChange={(e) => setCustomWords(e.target.value.toLowerCase())}
                    placeholder="Or paste multiple words here (comma or space separated)..."
                    rows={3}
                    className={`w-full rounded-xl border px-3 py-2 text-sm outline-none transition-all resize-none ${dark ? 'border-white/10 bg-slate-900/70 text-white placeholder-slate-500 focus:border-cyan-500/50' : 'border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-cyan-400'}`}
                  />

                  {/* Added words */}
                  {addedWords.length > 0 && (
                    <div className="mt-3">
                      <span className={`text-[10px] font-semibold uppercase tracking-widest ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Added Words:</span>
                      <div className="flex gap-1.5 flex-wrap mt-1.5">
                        {addedWords.map(word => (
                          <motion.span key={word} initial={{ scale: 0 }} animate={{ scale: 1 }}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold ${dark ? 'bg-cyan-900/30 text-cyan-300 border border-cyan-700/30' : 'bg-cyan-50 text-cyan-700 border border-cyan-200'}`}>
                            {word}
                            <button onClick={() => removeWord(word)} className="hover:text-red-400 transition-colors">
                              <X className="h-3 w-3" />
                            </button>
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className={`text-[10px] mt-2 ${dark ? 'text-slate-600' : 'text-slate-400'}`}>
                    Built-in: {BUILT_IN_DICTIONARY.length} words • Custom: {addedWords.length + (customWords.split(/[\s,]+/).filter(w => w.trim()).length)} • Total: {dictionary.length}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl border p-5 shadow-xl ${dark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/85'}`}
        >
          <div className={`flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
            <Route className="h-4 w-4" /> Visualization
          </div>

          <div className={`mt-4 overflow-hidden rounded-[1.75rem] border ${dark ? 'border-white/10 bg-slate-950/70' : 'border-slate-200 bg-slate-50'}`}>
            <div className="flex min-h-[320px] items-center justify-center px-4 py-8 sm:px-6">
              <div className="w-full max-w-5xl">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {visualizationPath.map((word, index) => (
                    <React.Fragment key={`${word}-${index}`}>
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.1, type: 'spring' }}
                        className={`flex min-w-[88px] items-center justify-center rounded-full border px-4 py-3 text-sm font-black uppercase tracking-[0.2em] shadow-sm ${index === 0
                          ? `border-cyan-300 bg-cyan-500/10 ${dark ? 'text-cyan-300' : 'text-cyan-600'}`
                          : index === visualizationPath.length - 1
                            ? `border-emerald-300 bg-emerald-500/10 ${dark ? 'text-emerald-300' : 'text-emerald-600'}`
                            : `border-amber-300 bg-amber-500/10 ${dark ? 'text-amber-300' : 'text-amber-600'}`
                        }`}
                      >
                        {word || '—'}
                      </motion.div>

                      {index < visualizationPath.length - 1 && (
                        <ArrowRight className={`h-5 w-5 ${dark ? 'text-slate-500' : 'text-slate-400'}`} />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <p className={`text-base font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>
                    {status}
                  </p>
                  <p className={`mt-2 text-sm ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                    The ladder is shown as one clean path so it stays readable on every screen size.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <CodeDisplay code={CODE_SAMPLE} language={language} title="Code" />
        </motion.div>
      </div>
    </div>
  );
};

export default WordLadder;
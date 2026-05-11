import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, BookOpen, Zap, ArrowRight, Target, Code2, Sparkles, Rocket, Map, Flame, Trophy } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLearning } from '../context/LearningContext';
import { ContainerScroll } from '../components/ContainerScroll';
import { AlgorithmDashboard } from '../components/AlgorithmDashboard';
import { DynamicBackground } from '../components/DynamicBackground';
import { algorithmCategories, algorithmCategoryCounts, algorithms } from '../lib/algorithmCatalog';
import type { AlgorithmCategoryId } from '../lib/algorithmCatalog';

const Home: React.FC = () => {
  const { theme } = useApp();
  const { streak, totalCompleted, totalAvailable } = useLearning();
  const [activeCategory, setActiveCategory] = useState<AlgorithmCategoryId | 'all'>('all');

  const visibleAlgorithms = useMemo(() => {
    if (activeCategory === 'all') {
      return algorithms;
    }
    return algorithms.filter((algorithm) => algorithm.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="min-h-screen relative">
      {/* Dynamic Background */}
      <DynamicBackground />
      
      {/* Hero Scroll Section */}
      <div className="flex flex-col overflow-hidden px-4 lg:px-8 -mt-12 relative z-10">
        <ContainerScroll
          titleComponent={
            <div className="space-y-6 mb-16 relative z-20">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-4 p-8 rounded-3xl backdrop-blur-sm bg-white/10 dark:bg-slate-900/20 border border-white/20 dark:border-slate-700/30 shadow-2xl"
              >
                <div className="flex items-center justify-center mb-3">
                  <h1 className={`text-4xl md:text-7xl font-bold drop-shadow-xl ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    AlgoQuest
                  </h1>
                </div>

                <h2 className={`text-3xl md:text-6xl font-bold leading-tight drop-shadow-lg ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Master{' '}
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">
                    Algorithms
                  </span>
                  {' '}through{' '}
                  <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent drop-shadow-sm">
                    Interactive
                  </span>
                  {' '}Learning
                </h2>

                <p className={`text-lg md:text-xl max-w-4xl mx-auto leading-relaxed drop-shadow-md ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Dive deep into {algorithms.length} algorithm visualizations — from N-Queens backtracking to Trapping Rain Water, BFS infection simulations, DP optimization, and more.
                  Multi-language code generation in C++, Python, and JavaScript with immersive learning experiences.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
                  <Link to="/nqueens">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-2"
                    >
                      <Rocket className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      <span>Start Learning</span>
                      <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                    </motion.button>
                  </Link>
                  
                  <a href="https://github.com/hariteja-01/AlgoQuest" target="_blank" rel="noopener noreferrer">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      className={`px-8 py-4 rounded-2xl font-semibold text-lg border-2 transition-all duration-300 backdrop-blur-sm ${
                        theme === 'dark'
                          ? 'border-gray-600 text-gray-300 hover:border-gray-500 hover:bg-gray-800/50'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-white/50'
                      }`}
                    >
                      <BookOpen className="h-5 w-5 inline-block mr-2" />
                      View Docs
                    </motion.button>
                  </a>
                </div>
              </motion.div>
            </div>
          }
        >
          <AlgorithmDashboard />
        </ContainerScroll>
      </div>

      {/* Features Section */}
      <section className="px-4 sm:px-6 lg:px-12 py-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 p-6 rounded-2xl backdrop-blur-sm bg-white/5 dark:bg-slate-900/10 border border-white/10 dark:border-slate-700/20"
          >
              <h2 className={`text-4xl md:text-6xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Interactive Algorithm{' '}
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Playground
              </span>
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Dive deep into {algorithms.length} interactive algorithm experiences with stunning visualizations,
                real-time code generation, and comprehensive learning tools.
            </p>
          </motion.div>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              aria-pressed={activeCategory === 'all'}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                activeCategory === 'all'
                  ? 'border-blue-300 bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : theme === 'dark'
                    ? 'border-gray-700 bg-gray-800/60 text-gray-200 hover:border-blue-500/40 hover:bg-gray-800'
                    : 'border-gray-200 bg-white/80 text-gray-700 hover:border-blue-200 hover:bg-blue-50'
              }`}
            >
              <span>All</span>
              <span className={`rounded-full px-2 py-0.5 text-xs ${
                activeCategory === 'all'
                  ? 'bg-white/20 text-white'
                  : theme === 'dark'
                    ? 'bg-gray-700 text-gray-200'
                    : 'bg-gray-100 text-gray-700'
              }`}>
                {algorithms.length}
              </span>
            </button>

            {algorithmCategories.map((category) => {
              const isActive = activeCategory === category.id;
              const count = algorithmCategoryCounts[category.id] ?? 0;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  aria-pressed={isActive}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? 'border-blue-300 bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                      : theme === 'dark'
                        ? 'border-gray-700 bg-gray-800/60 text-gray-200 hover:border-blue-500/40 hover:bg-gray-800'
                        : 'border-gray-200 bg-white/80 text-gray-700 hover:border-blue-200 hover:bg-blue-50'
                  }`}
                >
                  <span>{category.label}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : theme === 'dark'
                        ? 'bg-gray-700 text-gray-200'
                        : 'bg-gray-100 text-gray-700'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {visibleAlgorithms.map((algorithm, index) => {
              const Icon = algorithm.icon;

              return (
                <motion.div
                  key={algorithm.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ y: -12, scale: 1.02 }}
                  className={`group relative flex h-full flex-col p-6 rounded-3xl backdrop-blur-sm transition-all duration-500 ${
                    theme === 'dark'
                      ? 'bg-gray-800/60 border border-gray-700/50 hover:bg-gray-800/80'
                      : 'bg-white/80 border border-gray-200/50 hover:bg-white'
                  } shadow-xl hover:shadow-2xl`}
                >
                  <div className="relative z-10 flex h-full flex-col">
                    <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${algorithm.color} mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  
                  <h3 className={`text-xl font-bold mb-3 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {algorithm.title}
                  </h3>
                  
                  <p className={`text-base mb-4 leading-relaxed ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {algorithm.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    {algorithm.highlights.map((item, idx) => (
                      <motion.div 
                        key={idx} 
                        className="flex items-center space-x-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2 + idx * 0.1 }}
                      >
                        <Zap className={`h-4 w-4 ${
                          theme === 'dark' ? 'text-green-400' : 'text-green-500'
                        }`} />
                        <span className={`text-sm ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {item}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-auto">
                    <Link to={algorithm.path}>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        title={`Explore ${algorithm.title}`}
                        className={`w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                          theme === 'dark'
                            ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 border border-gray-600'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200'
                        }`}
                      >
                        <span className="truncate">Explore {algorithm.shortTitle}</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                    </Link>
                  </div>
                </div>

                {/* Hover gradient overlay */}
                  <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${algorithm.color}`}></div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Learning Path CTA Banner */}
      <section className="px-4 sm:px-6 lg:px-12 py-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`rounded-3xl border p-6 backdrop-blur-md flex flex-col md:flex-row items-center gap-6 ${
              theme === 'dark'
                ? 'border-orange-500/20 bg-gradient-to-r from-orange-950/40 via-amber-950/30 to-yellow-950/40'
                : 'border-orange-200 bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-xl shadow-orange-500/30 flex-shrink-0">
                <Map className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className={`text-xl font-bold ${ theme === 'dark' ? 'text-white' : 'text-gray-900' }`}>
                  Duolingo-Style Learning Path 🗺️
                </h3>
                <p className={`text-sm ${ theme === 'dark' ? 'text-gray-400' : 'text-gray-600' }`}>
                  Follow a guided map, earn XP, maintain your streak, and unlock algorithms one by one.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 md:ml-auto flex-shrink-0">
              {streak.currentStreak > 0 && (
                <div className="text-center">
                  <div className="flex items-center gap-1 text-orange-400">
                    <Flame className="h-5 w-5" />
                    <span className="text-2xl font-black">{streak.currentStreak}</span>
                  </div>
                  <p className="text-[10px] text-gray-500">day streak</p>
                </div>
              )}
              <div className="text-center">
                <div className="flex items-center gap-1 text-yellow-400">
                  <Trophy className="h-5 w-5" />
                  <span className="text-2xl font-black">{totalCompleted}</span>
                </div>
                <p className="text-[10px] text-gray-500">/{totalAvailable} done</p>
              </div>
              <Link to="/learning-path">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2"
                >
                  <span>Start Path</span>
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 sm:px-6 lg:px-12 py-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 p-6 rounded-2xl backdrop-blur-sm bg-white/5 dark:bg-slate-900/10 border border-white/10 dark:border-slate-700/20"
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              How It{' '}
              <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Three simple steps to master complex algorithms
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Choose Algorithm',
                description: 'Pick from N-Queens, LCS, or Trie algorithms to start your learning journey.',
                icon: Target,
                color: 'from-purple-500 to-pink-500'
              },
              {
                step: '02',
                title: 'Interactive Learning',
                description: 'Watch algorithms come to life with beautiful animations and step-by-step execution.',
                icon: Play,
                color: 'from-blue-500 to-cyan-500'
              },
              {
                step: '03',
                title: 'Code Generation',
                description: 'See real-time code generation in C++, Python, and JavaScript as you learn.',
                icon: Code2,
                color: 'from-green-500 to-emerald-500'
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center group"
              >
                <motion.div 
                  className="relative mb-6"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-3 bg-gradient-to-br ${item.color} text-white font-bold text-xl shadow-2xl group-hover:shadow-3xl transition-all duration-300`}>
                    {item.step}
                  </div>
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="mb-4"
                >
                  <item.icon className={`h-8 w-8 mx-auto mb-3 ${
                    theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  } group-hover:scale-110 transition-transform duration-300`} />
                </motion.div>
                
                <h3 className={`text-xl font-bold mb-3 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {item.title}
                </h3>
                <p className={`text-base leading-relaxed ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-12 py-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className={`p-8 rounded-3xl backdrop-blur-md ${
              theme === 'dark'
                ? 'bg-slate-900/40 border border-slate-700/40'
                : 'bg-white/40 border border-white/40'
            } shadow-2xl relative overflow-hidden`}
          >
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>
            
            <div className="relative z-10">
              <motion.h2 
                className={`text-4xl md:text-5xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Ready to{' '}
                <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Master
                </span>{' '}
                DSA?
              </motion.h2>
              
              <motion.p 
                className={`text-lg mb-6 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Join thousands of developers who have mastered algorithms through interactive learning.
              </motion.p>
              
              <Link to="/nqueens">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="group px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-3 mx-auto"
                >
                  <Rocket className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  <span>Start Your Journey</span>
                  <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
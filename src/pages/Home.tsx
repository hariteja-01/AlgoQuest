import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, FileText, TreePine, Play, BookOpen, Zap, ArrowRight, Target } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Home: React.FC = () => {
  const { theme } = useApp();

  const features = [
    {
      icon: Crown,
      title: 'N-Queens Visualizer',
      description: 'Interactive chessboard with backtracking algorithm visualization',
      path: '/nqueens',
      color: 'from-purple-500 to-pink-500',
      features: ['3D Chessboard', 'Solution Gallery', 'Attack Patterns', 'Performance Stats']
    },
    {
      icon: FileText,
      title: 'LCS Visualizer',
      description: 'Dynamic programming visualization for Longest Common Subsequence',
      path: '/lcs',
      color: 'from-blue-500 to-cyan-500',
      features: ['2D-4D Support', 'Path Reconstruction', 'Space Optimization', 'Multi-String']
    },
    {
      icon: TreePine,
      title: 'Trie Data Structure',
      description: 'Interactive prefix tree with search and auto-completion',
      path: '/trie',
      color: 'from-green-500 to-emerald-500',
      features: ['Word Insertion', 'Auto-Complete', 'Memory Analysis', 'Bulk Import']
    }
  ];

  const algorithmComparison = [
    {
      algorithm: 'N-Queens',
      complexity: 'O(N!)',
      spaceComplexity: 'O(N)',
      difficulty: 'Hard',
      applications: 'Constraint Satisfaction'
    },
    {
      algorithm: 'LCS',
      complexity: 'O(m×n)',
      spaceComplexity: 'O(min(m,n))',
      difficulty: 'Medium',
      applications: 'Text Comparison'
    },
    {
      algorithm: 'Trie',
      complexity: 'O(m)',
      spaceComplexity: 'O(ALPHABET_SIZE×N×M)',
      difficulty: 'Medium',
      applications: 'Auto-Complete'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-48 h-48 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/2 w-56 h-56 bg-green-500 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${
              theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
            }`}>
              Learn DSA by{' '}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
                Playing
              </span>
            </h1>
            
            <p className={`text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed ${
              theme === 'dark' ? 'text-slate-200' : 'text-slate-600'
            }`}>
              Master complex algorithms through interactive visualizations. 
              See how N-Queens, LCS, and Trie work with beautiful animations and real-time code generation.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/nqueens">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-2"
                >
                  <Play className="h-5 w-5" />
                  <span>Start Learning</span>
                </motion.button>
              </Link>
              
              <a href="https://github.com/hariteja-01/AlgoQuest" target="_blank" rel="noopener noreferrer">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-8 py-4 rounded-2xl font-semibold text-lg border-2 transition-all duration-300 ${
                    theme === 'dark'
                      ? 'border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-800'
                      : 'border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <BookOpen className="h-5 w-5 inline-block mr-2" />
                  View Docs
                </motion.button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
            }`}>
              Interactive Algorithm Playground
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${
              theme === 'dark' ? 'text-slate-200' : 'text-slate-600'
            }`}>
              Dive deep into three fundamental algorithms with stunning visualizations, 
              real-time code generation, and comprehensive learning tools.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -8 }}
                className={`group relative p-8 rounded-3xl backdrop-blur-sm transition-all duration-500 ${
                  theme === 'dark'
                    ? 'bg-slate-800/60 border border-slate-700/50 hover:bg-slate-800/80'
                    : 'bg-white/80 border border-slate-200/50 hover:bg-white'
                } shadow-xl hover:shadow-2xl`}
              >
                <div className="relative z-10">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 shadow-lg`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className={`text-2xl font-bold mb-4 ${
                    theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    {feature.title}
                  </h3>
                  
                  <p className={`text-lg mb-6 leading-relaxed ${
                    theme === 'dark' ? 'text-slate-200' : 'text-slate-600'
                  }`}>
                    {feature.description}
                  </p>

                  <div className="space-y-3 mb-8">
                    {feature.features.map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <Zap className={`h-4 w-4 ${
                          theme === 'dark' ? 'text-green-400' : 'text-green-500'
                        }`} />
                        <span className={`text-sm ${
                          theme === 'dark' ? 'text-slate-200' : 'text-slate-600'
                        }`}>
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Link to={feature.path}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                        theme === 'dark'
                          ? 'bg-slate-700 text-slate-200 hover:bg-slate-600 border border-slate-600'
                          : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      <span>Explore {feature.title}</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </Link>
                </div>

                {/* Hover gradient overlay */}
                <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${feature.color}`}></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Algorithm Comparison */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className={`text-4xl font-bold mb-6 ${
              theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
            }`}>
              Algorithm Comparison
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-slate-200' : 'text-slate-600'
            }`}>
              Quick overview of the algorithms you'll master
            </p>
          </motion.div>

          <div className={`overflow-hidden rounded-2xl backdrop-blur-sm ${
            theme === 'dark'
              ? 'bg-slate-800/60 border border-slate-700/50'
              : 'bg-white/80 border border-slate-200/50'
          } shadow-xl`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`${
                    theme === 'dark' ? 'bg-slate-700/50' : 'bg-slate-50'
                  }`}>
                    <th className={`px-6 py-4 text-left font-semibold ${
                      theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
                    }`}>
                      Algorithm
                    </th>
                    <th className={`px-6 py-4 text-left font-semibold ${
                      theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
                    }`}>
                      Time Complexity
                    </th>
                    <th className={`px-6 py-4 text-left font-semibold ${
                      theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
                    }`}>
                      Space Complexity
                    </th>
                    <th className={`px-6 py-4 text-left font-semibold ${
                      theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
                    }`}>
                      Difficulty
                    </th>
                    <th className={`px-6 py-4 text-left font-semibold ${
                      theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
                    }`}>
                      Applications
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {algorithmComparison.map((alg, index) => (
                    <motion.tr
                      key={alg.algorithm}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`border-t transition-colors duration-200 ${
                        theme === 'dark' 
                          ? 'border-slate-700 hover:bg-slate-700/30' 
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <td className={`px-6 py-4 font-medium ${
                        theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
                      }`}>
                        {alg.algorithm}
                      </td>
                      <td className={`px-6 py-4 font-mono text-sm ${
                        theme === 'dark' ? 'text-blue-300' : 'text-blue-600'
                      }`}>
                        {alg.complexity}
                      </td>
                      <td className={`px-6 py-4 font-mono text-sm ${
                        theme === 'dark' ? 'text-green-300' : 'text-green-600'
                      }`}>
                        {alg.spaceComplexity}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          alg.difficulty === 'Hard'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                        }`}>
                          {alg.difficulty}
                        </span>
                      </td>
                      <td className={`px-6 py-4 ${
                        theme === 'dark' ? 'text-slate-200' : 'text-slate-600'
                      }`}>
                        {alg.applications}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className={`text-4xl font-bold mb-6 ${
              theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
            }`}>
              How It Works
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Choose Algorithm',
                description: 'Pick from N-Queens, LCS, or Trie algorithms to start your learning journey.',
                icon: Target
              },
              {
                step: '02',
                title: 'Interactive Learning',
                description: 'Watch algorithms come to life with beautiful animations and step-by-step execution.',
                icon: Play
              },
              {
                step: '03',
                title: 'Code Generation',
                description: 'See real-time code generation in C++, Python, and JavaScript as you learn.',
                icon: BookOpen
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-xl shadow-lg`}>
                  {item.step}
                </div>
                <item.icon className={`h-8 w-8 mx-auto mb-4 ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <h3 className={`text-xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                }`}>
                  {item.title}
                </h3>
                <p className={`${
                  theme === 'dark' ? 'text-slate-200' : 'text-slate-600'
                }`}>
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-12 rounded-3xl backdrop-blur-sm ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-slate-800/60 to-slate-700/60 border border-slate-600/50'
                : 'bg-gradient-to-r from-white/80 to-slate-50/80 border border-slate-200/50'
            } shadow-2xl`}
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
            }`}>
              Ready to Master DSA?
            </h2>
            <p className={`text-xl mb-8 ${
              theme === 'dark' ? 'text-slate-200' : 'text-slate-600'
            }`}>
              Join thousands of developers who have mastered algorithms through interactive learning.
            </p>
            <Link to="/nqueens">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Start Your Journey
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
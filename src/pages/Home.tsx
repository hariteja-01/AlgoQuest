import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, FileText, TreePine, Play, BookOpen, Zap, ArrowRight, Target, Code2, Sparkles, Rocket } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ContainerScroll } from '../components/ContainerScroll';
import { AlgorithmDashboard } from '../components/AlgorithmDashboard';
import { DynamicBackground } from '../components/DynamicBackground';
import { AlgoQuestIcon } from '../components/AlgoQuestIcon';

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
                  Dive deep into N-Queens, LCS, and Trie algorithms with stunning 3D visualizations, 
                  real-time code generation, and immersive learning experiences that make complex concepts crystal clear.
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
              Dive deep into three fundamental algorithms with stunning visualizations, 
              real-time code generation, and comprehensive learning tools.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -12, scale: 1.02 }}
                className={`group relative p-6 rounded-3xl backdrop-blur-sm transition-all duration-500 ${
                  theme === 'dark'
                    ? 'bg-gray-800/60 border border-gray-700/50 hover:bg-gray-800/80'
                    : 'bg-white/80 border border-gray-200/50 hover:bg-white'
                } shadow-xl hover:shadow-2xl`}
              >
                <div className="relative z-10">
                  <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${feature.color} mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  
                  <h3 className={`text-xl font-bold mb-3 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {feature.title}
                  </h3>
                  
                  <p className={`text-base mb-4 leading-relaxed ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {feature.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    {feature.features.map((item, idx) => (
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

                  <Link to={feature.path}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                        theme === 'dark'
                          ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 border border-gray-600'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200'
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
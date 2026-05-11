import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Play, BarChart3, Zap, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { algorithms, algorithmStats } from '../lib/algorithmCatalog';

export const AlgorithmDashboard: React.FC = () => {
  const { theme } = useApp();

  const fallbackStatuses = ['Active', 'Learning', 'Mastered'] as const;
  const fallbackProgress = [84, 92, 100];
  const highlightedAlgorithms = algorithms.filter((algorithm) => algorithm.dashboard);
  const dashboardSource = highlightedAlgorithms.length > 0
    ? highlightedAlgorithms
    : algorithms.slice(0, 3);

  const dashboardAlgorithms = dashboardSource.map((algorithm, index) => ({
    icon: algorithm.icon,
    name: algorithm.shortTitle,
    description: algorithm.tagline,
    complexity: algorithm.complexity,
    status: algorithm.dashboard?.status ?? fallbackStatuses[index % fallbackStatuses.length],
    progress: algorithm.dashboard?.progress ?? fallbackProgress[index % fallbackProgress.length],
    color: algorithm.color,
  }));

  const stats = [
    { label: 'Algorithms', value: String(algorithmStats.algorithmCount), icon: Code2 },
    { label: 'Visualizations', value: String(algorithmStats.visualizationCount), icon: BarChart3 },
    { label: 'Code Examples', value: String(algorithmStats.codeExampleCount), icon: Play },
    { label: 'Learning Paths', value: String(algorithmStats.learningPathCount), icon: Star }
  ];

  return (
    <div className="h-full w-full p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-xl md:text-2xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Algorithm Dashboard
          </h3>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Interactive learning experience
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className={`text-xs ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Live
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-3 rounded-xl ${
              theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'
            } backdrop-blur-sm border ${
              theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/50'
            }`}
          >
            <div className="flex items-center space-x-2 mb-1">
              <stat.icon className="h-4 w-4 text-blue-500" />
              <span className={`text-xs ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {stat.label}
              </span>
            </div>
            <div className={`text-lg md:text-xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {stat.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Algorithm Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {dashboardAlgorithms.map((alg, index) => (
          <motion.div
            key={alg.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.15 }}
            className={`p-4 rounded-xl ${
              theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'
            } backdrop-blur-sm border ${
              theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/50'
            } hover:scale-105 transition-transform duration-300`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${alg.color}`}>
                <alg.icon className="h-4 w-4 text-white" />
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                alg.status === 'Mastered' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                  : alg.status === 'Active'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
              }`}>
                {alg.status}
              </span>
            </div>
            
            <h4 className={`font-semibold mb-1 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {alg.name}
            </h4>
            
            <p className={`text-xs mb-2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {alg.description}
            </p>
            
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-mono ${
                theme === 'dark' ? 'text-blue-300' : 'text-blue-600'
              }`}>
                {alg.complexity}
              </span>
              <span className={`text-xs ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {alg.progress}%
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className={`h-1.5 rounded-full ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${alg.progress}%` }}
                transition={{ delay: index * 0.2 + 0.5, duration: 1 }}
                className={`h-full rounded-full bg-gradient-to-r ${alg.color}`}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Visualization Preview */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className={`p-4 rounded-xl ${
          theme === 'dark' ? 'bg-gray-800/30' : 'bg-white/30'
        } backdrop-blur-sm border ${
          theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/50'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <h4 className={`font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Live Visualization
          </h4>
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span className={`text-xs ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Interactive
            </span>
          </div>
        </div>
        
        {/* Mock visualization grid */}
        <div className="grid grid-cols-8 gap-1">
          {Array.from({ length: 64 }, (_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: Math.random() > 0.7 ? 1 : 0.3 }}
              transition={{ 
                delay: (i * 0.01),
                repeat: Infinity,
                repeatType: "reverse",
                duration: 2
              }}
              className={`aspect-square rounded-sm ${
                Math.random() > 0.5 
                  ? 'bg-gradient-to-br from-blue-400 to-purple-500' 
                  : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, FileText, TreePine, Home, Menu, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ThemeToggle } from './ThemeToggle';
import { NavIcon } from './NavIcon';
import { ExpandableTabs } from './ExpandableTabs';

// Navigation Layout Component
const NavLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, language, setLanguage } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const tabs = [
    { 
      title: 'Home', 
      icon: Home, 
      href: '/' 
    },
    { 
      title: 'N-Queens', 
      icon: Crown, 
      href: '/nqueens' 
    },
    { 
      title: 'LCS', 
      icon: FileText, 
      href: '/lcs' 
    },
    { 
      title: 'Trie', 
      icon: TreePine, 
      href: '/trie' 
    },
  ];

  const languages = [
    { value: 'javascript' as const, label: 'JavaScript' },
    { value: 'python' as const, label: 'Python' },
    { value: 'cpp' as const, label: 'C++' }
  ];

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'
    }`}>
      {/* Desktop Header */}
      <header className={`hidden lg:block sticky top-0 z-30 backdrop-blur-md border-b transition-all duration-300 ${
        theme === 'dark'
          ? 'bg-gray-900/80 border-gray-700/50'
          : 'bg-white/80 border-gray-200/50'
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-20">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <div className="flex-shrink-0">
                <NavIcon />
              </div>
            </motion.div>

            {/* Navigation Tabs */}
            <div className="flex-1 flex justify-center mx-8">
              <ExpandableTabs 
                tabs={tabs} 
                activeColor="text-blue-600 dark:text-blue-400"
                className="border-gray-200/50 dark:border-gray-700/50"
              />
            </div>

            {/* Settings */}
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-200 ${
                    theme === 'dark'
                      ? 'bg-gray-800/50 border-gray-700 text-gray-200 focus:border-blue-500'
                      : 'bg-white/50 border-gray-300 text-gray-700 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20 backdrop-blur-sm`}
                >
                  {languages.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Theme Toggle */}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className={`lg:hidden sticky top-0 z-30 backdrop-blur-md border-b transition-all duration-300 ${
        theme === 'dark'
          ? 'bg-gray-900/80 border-gray-700/50'
          : 'bg-white/80 border-gray-200/50'
      }`}>
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileSidebarOpen(true)}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
            >
              <Menu className="h-6 w-6" />
            </motion.button>
            <div className="flex items-center space-x-2">
              <NavIcon />
              <span className={`text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
                AlgoQuest
              </span>
            </div>
          </div>
          <ThemeToggle className="scale-90" />
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="px-4 pb-4">
          <ExpandableTabs 
            tabs={tabs} 
            activeColor="text-blue-600 dark:text-blue-400"
            className="border-gray-200/50 dark:border-gray-700/50 w-full"
          />
        </div>
      </header>

      {/* Mobile Sidebar for Settings */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Mobile Settings Panel */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`fixed left-0 top-0 h-full w-72 z-50 lg:hidden ${
                theme === 'dark'
                  ? 'bg-gray-900/95 border-gray-700/50'
                  : 'bg-white/95 border-gray-200/50'
              } backdrop-blur-xl border-r shadow-2xl`}
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200/20">
                  <div className="flex items-center space-x-3">
                    <NavIcon />
                    <span className={`text-lg font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      Settings
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`p-2 rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                        : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </div>

                {/* Settings */}
                <div className="flex-1 p-4">
                  <div className="space-y-6">
                    <div>
                      <h3 className={`text-sm font-semibold mb-3 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Programming Language
                      </h3>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as any)}
                        className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                          theme === 'dark'
                            ? 'bg-gray-800/50 border-gray-700 text-gray-200 focus:border-blue-500'
                            : 'bg-white/50 border-gray-300 text-gray-700 focus:border-blue-500'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20 backdrop-blur-sm`}
                      >
                        {languages.map(({ value, label }) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <h3 className={`text-sm font-semibold mb-3 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Theme
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                        </span>
                        <ThemeToggle />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className={`p-4 border-t border-gray-200/20 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  <p className="text-xs text-center">
                    Interactive Learning Platform
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default NavLayout;

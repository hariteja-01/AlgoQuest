import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Moon, Sun, Code2, Crown, FileText, TreePine } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = React.memo(({ children }) => {
  const { theme, toggleTheme, language, setLanguage } = useApp();
  const location = useLocation();

  const navItems = useMemo(() => [
    { path: '/', icon: Code2, label: 'Home' },
    { path: '/nqueens', icon: Crown, label: 'N-Queens' },
    { path: '/lcs', icon: FileText, label: 'LCS' },
    { path: '/trie', icon: TreePine, label: 'Trie' }
  ], []);

  const languages = useMemo(() => [
    { value: 'javascript' as const, label: 'JavaScript' },
    { value: 'python' as const, label: 'Python' },
    { value: 'cpp' as const, label: 'C++' }
  ], []);

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-all duration-300 ${
        theme === 'dark'
          ? 'bg-slate-900/80 border-slate-700/50'
          : 'bg-white/80 border-slate-200/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.3 }}
                className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"
              >
                <Code2 className="h-6 w-6 text-white" />
              </motion.div>
              <span className={`text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
                AlgoQuest
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map(({ path, icon: Icon, label }) => (
                <Link key={path} to={path}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      location.pathname === path
                        ? theme === 'dark'
                          ? 'bg-slate-700 text-blue-400'
                          : 'bg-blue-100 text-blue-700'
                        : theme === 'dark'
                          ? 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{label}</span>
                  </motion.div>
                </Link>
              ))}
            </nav>

            {/* Controls */}
            <div className="flex items-center space-x-3">
              {/* Language Selector */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all duration-200 ${
                  theme === 'dark'
                    ? 'bg-slate-700 border-slate-600 text-slate-200 focus:border-blue-500'
                    : 'bg-white border-slate-300 text-slate-700 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              >
                {languages.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>

              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  theme === 'dark'
                    ? 'bg-slate-700 text-yellow-400 hover:bg-slate-600'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        {children}
      </main>

      {/* Mobile Navigation */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-md ${
        theme === 'dark'
          ? 'bg-slate-900/90 border-slate-700/50'
          : 'bg-white/90 border-slate-200/50'
      }`}>
        <div className="flex items-center justify-around py-2">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link key={path} to={path}>
              <motion.div
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center p-2 transition-all duration-200 ${
                  location.pathname === path
                    ? theme === 'dark'
                      ? 'text-blue-400'
                      : 'text-blue-600'
                    : theme === 'dark'
                      ? 'text-slate-400'
                      : 'text-slate-500'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs mt-1">{label}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
});

export default Layout;
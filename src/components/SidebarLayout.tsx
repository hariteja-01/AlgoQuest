import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Crown, FileText, TreePine, Home, Menu, X, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ThemeToggle } from './ThemeToggle';
import { NavIcon } from './NavIcon';

// Sidebar interfaces
interface SidebarLinkItem {
  label: string;
  href: string;
  icon: React.ReactElement;
}

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
}

interface SidebarBodyProps {
  className?: string;
  children: React.ReactNode;
}

interface SidebarLinkProps {
  link: SidebarLinkItem;
  className?: string;
}

// Sidebar Components
const Sidebar: React.FC<SidebarProps> = ({ open, setOpen, children }) => {
  const { theme } = useApp();
  
  return (
    <div
      className={`relative flex flex-col h-screen transition-all duration-300 ease-in-out ${
        open ? 'w-72' : 'w-16'
      } ${
        theme === 'dark'
          ? 'bg-gray-900/95 border-gray-700/50'
          : 'bg-white/95 border-gray-200/50'
      } backdrop-blur-xl border-r shadow-2xl z-30`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {children}
    </div>
  );
};

const SidebarBody: React.FC<SidebarBodyProps> = ({ className, children }) => {
  return (
    <div className={`flex flex-col flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent ${className || ''}`}>
      {children}
    </div>
  );
};

const SidebarLink: React.FC<SidebarLinkProps> = ({ link, className }) => {
  const location = useLocation();
  const { theme } = useApp();
  const isActive = location.pathname === link.href;

  return (
    <Link to={link.href}>
      <motion.div
        className={`flex items-center px-3 py-2.5 mx-2 rounded-lg transition-all duration-200 group ${
          isActive
            ? theme === 'dark'
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
              : 'bg-blue-50 text-blue-600 border border-blue-200'
            : theme === 'dark'
            ? 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        } ${className || ''}`}
        whileHover={{ x: 2 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex-shrink-0 w-5 h-5">
          {link.icon}
        </div>
        <motion.span
          className="ml-3 text-sm font-medium whitespace-nowrap"
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 'auto' }}
          exit={{ opacity: 0, width: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          {link.label}
        </motion.span>
      </motion.div>
    </Link>
  );
};

// Logo Components
const Logo: React.FC = () => {
  const { theme } = useApp();
  
  return (
    <Link to="/" className="flex items-center space-x-3 px-3 py-3">
      <div className="flex-shrink-0">
        <NavIcon size={48} />
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`text-xl font-bold whitespace-nowrap ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}
      >
        AlgoQuest
      </motion.span>
    </Link>
  );
};

const LogoIcon: React.FC = () => {
  return (
    <Link to="/" className="flex items-center justify-center px-3 py-3">
      <div className="flex-shrink-0">
        <NavIcon size={44} />
      </div>
    </Link>
  );
};

// Main Layout Component
const SidebarLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, language, setLanguage } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const links: SidebarLinkItem[] = [
    {
      label: 'Home',
      href: '/',
      icon: <Home className="h-5 w-5" />
    },
    {
      label: 'N-Queens',
      href: '/nqueens',
      icon: <Crown className="h-5 w-5" />
    },
    {
      label: 'LCS',
      href: '/lcs',
      icon: <FileText className="h-5 w-5" />
    },
    {
      label: 'Trie',
      href: '/trie',
      icon: <TreePine className="h-5 w-5" />
    }
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
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-full z-30">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}>
          <SidebarBody className="justify-between gap-4">
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
              {/* Logo */}
              <div className="p-4 border-b border-gray-200/20">
                {sidebarOpen ? <Logo /> : <LogoIcon />}
              </div>
              
              {/* Navigation Links */}
              <div className="mt-4 flex flex-col gap-1 px-2">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
              </div>
              
              {/* Settings Section */}
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-8 px-4 space-y-4"
                >
                  <div>
                    <h3 className={`text-xs font-semibold mb-2 uppercase tracking-wide ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Language
                    </h3>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as any)}
                      className={`w-full px-3 py-2 rounded-lg border text-xs font-medium transition-all duration-200 ${
                        theme === 'dark'
                          ? 'bg-gray-800/50 border-gray-700 text-gray-200 focus:border-blue-500'
                          : 'bg-white/50 border-gray-300 text-gray-700 focus:border-blue-500'
                      } focus:outline-none focus:ring-1 focus:ring-blue-500/20 backdrop-blur-sm`}
                    >
                      {languages.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <h3 className={`text-xs font-semibold mb-2 uppercase tracking-wide ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Theme
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {theme === 'dark' ? 'Dark' : 'Light'}
                      </span>
                      <ThemeToggle />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={`p-4 border-t border-gray-200/20 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                }`}
              >
                <p className="text-xs text-center">
                  Interactive Learning
                </p>
              </motion.div>
            )}
          </SidebarBody>
        </Sidebar>
      </div>

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
            <span className={`text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
              AlgoQuest
            </span>
          </div>
          <ThemeToggle className="scale-90" />
        </div>
      </header>

      {/* Mobile Sidebar */}
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

            {/* Mobile Sidebar Panel */}
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
              <div className="flex flex-col h-full overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200/20">
                  <div className="flex items-center space-x-3">
                    <NavIcon />
                    <span className={`text-lg font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      AlgoQuest
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

                {/* Navigation */}
                <div className="flex-1 p-4">
                  <div className="mb-6">
                    <h3 className={`text-xs font-semibold mb-3 uppercase tracking-wide ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Algorithms
                    </h3>
                    <div className="space-y-1">
                      {links.map((link, idx) => (
                        <SidebarLink key={idx} link={link} />
                      ))}
                    </div>
                  </div>

                  {/* Settings */}
                  <div className="space-y-4">
                    <div>
                      <h3 className={`text-xs font-semibold mb-2 uppercase tracking-wide ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Programming Language
                      </h3>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as any)}
                        className={`w-full px-3 py-2 rounded-lg border text-xs font-medium transition-all duration-200 ${
                          theme === 'dark'
                            ? 'bg-gray-800/50 border-gray-700 text-gray-200 focus:border-blue-500'
                            : 'bg-white/50 border-gray-300 text-gray-700 focus:border-blue-500'
                        } focus:outline-none focus:ring-1 focus:ring-blue-500/20 backdrop-blur-sm`}
                      >
                        {languages.map(({ value, label }) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <h3 className={`text-xs font-semibold mb-2 uppercase tracking-wide ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Theme
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs ${
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
      <main className={`transition-all duration-300 ${
        sidebarOpen ? 'lg:ml-72' : 'lg:ml-16'
      }`}>
        {children}
      </main>
    </div>
  );
};

export default SidebarLayout;

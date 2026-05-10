import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Check,
  ChevronDown,
  Coins,
  Crown,
  Droplets,
  Bug,
  Egg,
  FileText,
  GitMerge,
  Globe,
  GraduationCap,
  Home,
  LayoutGrid,
  Menu,
  Navigation,
  Package,
  PenTool,
  Settings2,
  SlidersHorizontal,
  Route,
  Target,
  TrendingUp,
  TreePine,
  X,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ThemeToggle } from './ThemeToggle';
import { NavIcon } from './NavIcon';

type MenuKey = 'desktop-visualizations' | 'desktop-settings' | 'mobile-visualizations' | null;

// Navigation Layout Component
const NavLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, language, setLanguage } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<MenuKey>(null);
  const desktopMenusRef = useRef<HTMLDivElement>(null);
  const desktopSettingsRef = useRef<HTMLDivElement>(null);
  const mobileMenusRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

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
    { 
      title: 'Word Ladder', 
      icon: Route, 
      href: '/word-ladder' 
    },
    { 
      title: 'Trapping Water', 
      icon: Droplets, 
      href: '/trapping-water' 
    },
    { 
      title: 'Rotting Oranges', 
      icon: Bug, 
      href: '/rotting-oranges' 
    },
    { 
      title: 'Super Egg Drop', 
      icon: Egg, 
      href: '/super-egg-drop' 
    },
    { 
      title: 'Merge Intervals', 
      icon: GitMerge, 
      href: '/merge-intervals' 
    },
    { 
      title: 'Sliding Window', 
      icon: SlidersHorizontal, 
      href: '/sliding-window' 
    },
    { 
      title: 'Course Schedule', 
      icon: GraduationCap, 
      href: '/course-schedule' 
    },
    { 
      title: 'Coin Change', 
      icon: Coins, 
      href: '/coin-change' 
    },
    { 
      title: 'LIS', 
      icon: TrendingUp, 
      href: '/lis' 
    },
    { 
      title: 'Dijkstra', 
      icon: Navigation, 
      href: '/dijkstra' 
    },
    { 
      title: '0/1 Knapsack', 
      icon: Package, 
      href: '/knapsack' 
    },
    { 
      title: 'Edit Distance', 
      icon: PenTool, 
      href: '/edit-distance' 
    },
    { 
      title: 'Kth Largest', 
      icon: Target, 
      href: '/kth-largest' 
    },
  ];

  const activeVisualization = useMemo(() => {
    return tabs.find((tab) => tab.href === location.pathname) ?? null;
  }, [location.pathname, tabs]);

  const languages = [
    { value: 'javascript' as const, label: 'JavaScript' },
    { value: 'python' as const, label: 'Python' },
    { value: 'cpp' as const, label: 'C++' }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInsideDesktop = desktopMenusRef.current?.contains(target);
      const clickedInsideDesktopSettings = desktopSettingsRef.current?.contains(target);
      const clickedInsideMobile = mobileMenusRef.current?.contains(target);

      if (!clickedInsideDesktop && !clickedInsideDesktopSettings && !clickedInsideMobile) {
        setOpenMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (menu: Exclude<MenuKey, null>) => {
    setOpenMenu((current) => (current === menu ? null : menu));
  };

  const desktopMenuButtonClass = `inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/25`;
  const dropdownPanelClass = `absolute z-50 mt-3 overflow-hidden rounded-3xl border shadow-2xl backdrop-blur-xl`;

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
        <div className="max-w-7xl mx-auto px-6 h-24">
          <div className="grid grid-cols-[auto,1fr,auto] items-center gap-6 h-full">
            {/* Logo - Left Section */}
            <motion.div 
              className="flex items-center space-x-3 justify-start"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <div className="flex-shrink-0">
                <NavIcon />
              </div>
            </motion.div>

            {/* Navigation Tabs - Center Section */}
            <div className="flex justify-center">
              <div ref={desktopMenusRef} className="relative flex items-center gap-3">
                <div className="relative">
                  <motion.button
                    type="button"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleMenu('desktop-visualizations')}
                    className={`${desktopMenuButtonClass} ${
                      openMenu === 'desktop-visualizations' || activeVisualization
                        ? 'border-blue-200 bg-blue-50 text-blue-700 shadow-lg shadow-blue-500/10 dark:border-blue-500/30 dark:bg-blue-950/40 dark:text-blue-200'
                        : 'border-gray-200 bg-white/70 text-gray-700 hover:border-blue-200 hover:bg-blue-50/80 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-900/70 dark:text-gray-200 dark:hover:border-blue-500/30 dark:hover:bg-blue-950/40'
                    }`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                    <span>Visualizations</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${openMenu === 'desktop-visualizations' ? 'rotate-180' : ''}`} />
                  </motion.button>

                  <AnimatePresence>
                    {openMenu === 'desktop-visualizations' && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.18 }}
                        className={`${dropdownPanelClass} left-1/2 top-full w-[22rem] max-h-[70vh] overflow-y-auto -translate-x-1/2 border-gray-200/70 bg-white/95 p-2 dark:border-gray-700/70 dark:bg-gray-900/95`}
                      >
                        <div className="px-3 py-2">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                            Visualizations
                          </p>
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Choose a problem view from the project library.
                          </p>
                        </div>
                        <div className="space-y-1">
                          {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = location.pathname === tab.href;

                            return (
                              <Link
                                key={tab.title}
                                to={tab.href}
                                onClick={() => setOpenMenu(null)}
                                className={`flex items-center gap-3 rounded-2xl px-3 py-3 transition-all duration-200 ${
                                  isActive
                                    ? 'bg-blue-50 text-blue-700 shadow-sm dark:bg-blue-950/40 dark:text-blue-200'
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-800/80 dark:hover:text-white'
                                }`}
                              >
                                <span className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${
                                  isActive
                                    ? 'border-blue-200 bg-white shadow-sm dark:border-blue-500/30 dark:bg-gray-900'
                                    : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-950'
                                }`}>
                                  <Icon className="h-5 w-5" />
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="block text-sm font-semibold">{tab.title}</span>
                                  <span className="block text-xs text-gray-500 dark:text-gray-400">
                                    Open the {tab.title.toLowerCase()} visualizer
                                  </span>
                                </span>
                                {isActive && <Check className="h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-300" />}
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Settings - Right Section */}
            <div className="flex items-center justify-end">
              <div className="relative" ref={desktopSettingsRef}>
                <motion.button
                  type="button"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleMenu('desktop-settings')}
                  className={`${desktopMenuButtonClass} ${
                    openMenu === 'desktop-settings'
                      ? 'border-blue-200 bg-blue-50 text-blue-700 shadow-lg shadow-blue-500/10 dark:border-blue-500/30 dark:bg-blue-950/40 dark:text-blue-200'
                      : 'border-gray-200 bg-white/70 text-gray-700 hover:border-blue-200 hover:bg-blue-50/80 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-900/70 dark:text-gray-200 dark:hover:border-blue-500/30 dark:hover:bg-blue-950/40'
                  }`}
                >
                  <Settings2 className="h-4 w-4" />
                  <span>Settings</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openMenu === 'desktop-settings' ? 'rotate-180' : ''}`} />
                </motion.button>

                <AnimatePresence>
                  {openMenu === 'desktop-settings' && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      transition={{ duration: 0.18 }}
                      className={`${dropdownPanelClass} right-0 top-full w-[22rem] border-gray-200/70 bg-white/95 p-3 dark:border-gray-700/70 dark:bg-gray-900/95`}
                    >
                      <div className="px-2 py-1">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                          Settings
                        </p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Fine-tune the project experience.
                        </p>
                      </div>

                      <div className="mt-3 space-y-4">
                        <div className="rounded-2xl border border-gray-200/80 bg-gray-50/80 p-3 dark:border-gray-700/80 dark:bg-gray-800/60">
                          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                            <Globe className="h-4 w-4" />
                            Programming Language
                          </div>
                          <div className="mt-3 space-y-2">
                            {languages.map(({ value, label }) => {
                              const isSelected = language === value;

                              return (
                                <button
                                  key={value}
                                  type="button"
                                  onClick={() => setLanguage(value)}
                                  className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 ${
                                    isSelected
                                      ? 'border-blue-200 bg-white text-blue-700 shadow-sm dark:border-blue-500/30 dark:bg-gray-900 dark:text-blue-200'
                                      : 'border-transparent bg-transparent text-gray-600 hover:border-gray-200 hover:bg-white hover:text-gray-900 dark:text-gray-300 dark:hover:border-gray-700 dark:hover:bg-gray-900/70 dark:hover:text-white'
                                  }`}
                                >
                                  <span>{label}</span>
                                  {isSelected && <Check className="h-4 w-4" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-gray-200/80 bg-gray-50/80 p-3 dark:border-gray-700/80 dark:bg-gray-800/60">
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Theme</p>
                              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Switch between light and dark mode.
                              </p>
                            </div>
                            <ThemeToggle />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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
        <div className="flex items-center justify-between px-4 h-20">
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

        {/* Mobile Navigation Dropdown */}
        <div className="px-4 pb-4">
          <div ref={mobileMenusRef} className="relative">
            <motion.button
              type="button"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleMenu('mobile-visualizations')}
              className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-sm font-semibold transition-all duration-200 ${
                openMenu === 'mobile-visualizations' || activeVisualization
                  ? 'border-blue-200 bg-blue-50 text-blue-700 shadow-lg shadow-blue-500/10 dark:border-blue-500/30 dark:bg-blue-950/40 dark:text-blue-200'
                  : 'border-gray-200 bg-white/70 text-gray-700 hover:border-blue-200 hover:bg-blue-50/80 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-900/70 dark:text-gray-200 dark:hover:border-blue-500/30 dark:hover:bg-blue-950/40'
              }`}
            >
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white/80 dark:border-gray-700 dark:bg-gray-950">
                  <LayoutGrid className="h-4 w-4" />
                </span>
                <span className="text-left">
                  <span className="block">Visualizations</span>
                  <span className="block text-xs font-normal text-gray-500 dark:text-gray-400">
                    {activeVisualization ? activeVisualization.title : 'Choose a view'}
                  </span>
                </span>
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${openMenu === 'mobile-visualizations' ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
              {openMenu === 'mobile-visualizations' && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-0 right-0 top-full z-50 mt-3 overflow-y-auto max-h-[60vh] rounded-3xl border border-gray-200/70 bg-white/95 p-2 shadow-2xl backdrop-blur-xl dark:border-gray-700/70 dark:bg-gray-900/95"
                >
                  <div className="px-3 py-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                      Visualizations
                    </p>
                  </div>
                  <div className="space-y-1">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = location.pathname === tab.href;

                      return (
                        <Link
                          key={tab.title}
                          to={tab.href}
                          onClick={() => setOpenMenu(null)}
                          className={`flex items-center gap-3 rounded-2xl px-3 py-3 transition-all duration-200 ${
                            isActive
                              ? 'bg-blue-50 text-blue-700 shadow-sm dark:bg-blue-950/40 dark:text-blue-200'
                              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-800/80 dark:hover:text-white'
                          }`}
                        >
                          <span className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                            isActive
                              ? 'border-blue-200 bg-white shadow-sm dark:border-blue-500/30 dark:bg-gray-900'
                              : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-950'
                          }`}>
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-semibold">{tab.title}</span>
                            <span className="block text-xs text-gray-500 dark:text-gray-400">
                              Open the {tab.title.toLowerCase()} visualizer
                            </span>
                          </span>
                          {isActive && <Check className="h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-300" />}
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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

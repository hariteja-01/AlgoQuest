import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  Check,
  ChevronDown,
  Flame,
  Globe,
  Home,
  LayoutGrid,
  Map,
  Menu,
  MessageSquare,
  Settings2,
  Trophy,
  UserRound,
  X,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { NavIcon } from './NavIcon';
import { algorithmCategories, algorithms } from '../lib/algorithmCatalog';
import { useLearning } from '../context/LearningContext';
import FeedbackModal from './FeedbackModal';
import ResetProgressModal from './ResetProgressModal';
import UserPanel from './UserPanel';

type MenuKey = 'desktop-visualizations' | 'desktop-settings' | 'desktop-user' | 'mobile-visualizations' | null;

// Navigation Layout Component
const NavLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, language, setLanguage } = useApp();
  const { user, isAdmin } = useAuth();
  const { streak, totalCompleted, totalAvailable } = useLearning();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<MenuKey>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const desktopMenusRef = useRef<HTMLDivElement>(null);
  const desktopSettingsRef = useRef<HTMLDivElement>(null);
  const desktopUserRef = useRef<HTMLDivElement>(null);
  const mobileMenusRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const homeLink = { title: 'Home', icon: Home, href: '/' };
  const HomeIcon = homeLink.icon;
  const visualizationTabs = algorithms;

  const activeVisualization = useMemo(() => {
    return visualizationTabs.find((tab) => tab.path === location.pathname) ?? null;
  }, [location.pathname, visualizationTabs]);

  const languages = [
    { value: 'javascript' as const, label: 'JavaScript' },
    { value: 'python' as const, label: 'Python' },
    { value: 'cpp' as const, label: 'C++' },
    { value: 'java' as const, label: 'Java' },
    { value: 'csharp' as const, label: 'C#' }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInsideDesktop = desktopMenusRef.current?.contains(target);
      const clickedInsideDesktopSettings = desktopSettingsRef.current?.contains(target);
      const clickedInsideDesktopUser = desktopUserRef.current?.contains(target);
      const clickedInsideMobile = mobileMenusRef.current?.contains(target);

      if (!clickedInsideDesktop && !clickedInsideDesktopSettings && !clickedInsideDesktopUser && !clickedInsideMobile) {
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
            <div className="flex justify-center items-center gap-2">
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
                        <div className="space-y-4">
                          <div>
                            <div className="px-3 py-2">
                              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                                Overview
                              </p>
                            </div>
                            <Link
                              to={homeLink.href}
                              onClick={() => setOpenMenu(null)}
                              className={`flex items-center gap-3 rounded-2xl px-3 py-3 transition-all duration-200 ${
                                location.pathname === homeLink.href
                                  ? 'bg-blue-50 text-blue-700 shadow-sm dark:bg-blue-950/40 dark:text-blue-200'
                                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-800/80 dark:hover:text-white'
                              }`}
                            >
                              <span className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${
                                location.pathname === homeLink.href
                                  ? 'border-blue-200 bg-white shadow-sm dark:border-blue-500/30 dark:bg-gray-900'
                                  : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-950'
                              }`}>
                                <HomeIcon className="h-5 w-5" />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block text-sm font-semibold">{homeLink.title}</span>
                                <span className="block text-xs text-gray-500 dark:text-gray-400">
                                  Project overview and launchpad
                                </span>
                              </span>
                              {location.pathname === homeLink.href && (
                                <Check className="h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-300" />
                              )}
                            </Link>
                          </div>

                          {algorithmCategories.map((category, categoryIndex) => {
                            const categoryAlgorithms = visualizationTabs.filter(
                              (tab) => tab.category === category.id
                            );

                            if (categoryAlgorithms.length === 0) {
                              return null;
                            }

                            return (
                              <div key={category.id} className={categoryIndex === 0 ? '' : 'pt-2'}>
                                <div className="px-3 py-2">
                                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                                    {category.label}
                                  </p>
                                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    {category.description}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  {categoryAlgorithms.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = location.pathname === tab.path;

                                    return (
                                      <Link
                                        key={tab.id}
                                        to={tab.path}
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
                                          <span className="block text-sm font-semibold">{tab.shortTitle}</span>
                                          <span className="block text-xs text-gray-500 dark:text-gray-400">
                                            {tab.tagline}
                                          </span>
                                        </span>
                                        {isActive && <Check className="h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-300" />}
                                      </Link>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Learning Path quick link */}
                <Link
                  to="/learning-path"
                  className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    location.pathname === '/learning-path'
                      ? 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-500/30 dark:bg-orange-950/40 dark:text-orange-200'
                      : 'border-gray-200 bg-white/70 text-gray-700 hover:border-orange-200 hover:bg-orange-50/80 hover:text-orange-700 dark:border-gray-700 dark:bg-gray-900/70 dark:text-gray-200 dark:hover:border-orange-500/30'
                  }`}
                >
                  <Map className="h-4 w-4" />
                  <span className="hidden xl:inline">Path</span>
                  {streak.currentStreak > 0 && (
                    <span className="flex items-center gap-0.5 rounded-full bg-orange-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      <Flame className="h-2.5 w-2.5" />{streak.currentStreak}
                    </span>
                  )}
                </Link>

                {/* Glossary quick link */}
                <Link
                  to="/glossary"
                  className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    location.pathname === '/glossary'
                      ? 'border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-500/30 dark:bg-purple-950/40 dark:text-purple-200'
                      : 'border-gray-200 bg-white/70 text-gray-700 hover:border-purple-200 hover:bg-purple-50/80 hover:text-purple-700 dark:border-gray-700 dark:bg-gray-900/70 dark:text-gray-200 dark:hover:border-purple-500/30'
                  }`}
                >
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden xl:inline">Glossary</span>
                </Link>

                {/* XP / Progress pill */}
                <div className="hidden xl:flex items-center gap-1.5 rounded-2xl border border-yellow-300/30 bg-yellow-500/10 px-3 py-2 text-xs font-bold text-yellow-400">
                  <Trophy className="h-3.5 w-3.5" />
                  {totalCompleted}/{totalAvailable}
                </div>
              </div>
            </div>

            {/* Settings - Right Section */}
            <div className="flex items-center justify-end gap-3">
              <div className="relative" ref={desktopUserRef}>
                <motion.button
                  type="button"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleMenu('desktop-user')}
                  className={`${desktopMenuButtonClass} ${
                    openMenu === 'desktop-user'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700 shadow-lg shadow-emerald-500/10 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-200'
                      : 'border-gray-200 bg-white/70 text-gray-700 hover:border-emerald-200 hover:bg-emerald-50/80 hover:text-emerald-700 dark:border-gray-700 dark:bg-gray-900/70 dark:text-gray-200 dark:hover:border-emerald-500/30 dark:hover:bg-emerald-950/40'
                  }`}
                >
                  <UserRound className="h-4 w-4" />
                  <span>User</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openMenu === 'desktop-user' ? 'rotate-180' : ''}`} />
                </motion.button>

                <AnimatePresence>
                  {openMenu === 'desktop-user' && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      transition={{ duration: 0.18 }}
                      className={`${dropdownPanelClass} right-0 top-full w-[24rem] border-gray-200/70 bg-white/95 p-3 dark:border-gray-700/70 dark:bg-gray-900/95`}
                    >
                      <div className="px-2 py-1">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                          User Information
                        </p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Secure login with Supabase and profile storage.
                        </p>
                      </div>
                      <div className="mt-3">
                        <UserPanel onClose={() => setOpenMenu(null)} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFeedbackOpen(true)}
                className={`${desktopMenuButtonClass} border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700 shadow-lg shadow-fuchsia-500/10 dark:border-fuchsia-500/30 dark:bg-fuchsia-950/40 dark:text-fuchsia-200`}
              >
                <MessageSquare className="h-4 w-4" />
                <span>Feedback</span>
              </motion.button>

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

                        <div className="rounded-2xl border border-gray-200/80 bg-gray-50/80 p-3 dark:border-gray-700/80 dark:bg-gray-800/60">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Learning Progress</p>
                              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Reset streaks, XP, and unlocks.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setResetOpen(true)}
                              disabled={!user}
                              className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                                user
                                  ? 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-950/40 dark:text-amber-200'
                                  : 'border-gray-200 bg-gray-100 text-gray-400 dark:border-gray-700 dark:bg-gray-900/70 dark:text-gray-500'
                              }`}
                            >
                              Reset
                            </button>
                          </div>
                        </div>

                        {isAdmin && (
                          <div className="rounded-2xl border border-gray-200/80 bg-gray-50/80 p-3 dark:border-gray-700/80 dark:bg-gray-800/60">
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Admin Tools</p>
                            <Link
                              to="/admin/feedback"
                              onClick={() => setOpenMenu(null)}
                              className="mt-3 inline-flex w-full items-center justify-between rounded-xl border border-fuchsia-200 bg-fuchsia-50 px-3 py-2 text-xs font-semibold text-fuchsia-700 dark:border-fuchsia-500/30 dark:bg-fuchsia-950/40 dark:text-fuchsia-200"
                            >
                              Feedback Inbox
                              <MessageSquare className="h-4 w-4" />
                            </Link>
                          </div>
                        )}
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
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFeedbackOpen(true)}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'hover:bg-gray-800 text-fuchsia-300 hover:text-fuchsia-200'
                  : 'hover:bg-gray-100 text-fuchsia-600 hover:text-fuchsia-700'
              }`}
            >
              <MessageSquare className="h-5 w-5" />
            </motion.button>
            <ThemeToggle className="scale-90" />
          </div>
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
                    {activeVisualization ? activeVisualization.shortTitle : 'Choose a view'}
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
                  <div className="space-y-4">
                    <div>
                      <div className="px-3 py-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                          Overview
                        </p>
                      </div>
                      <Link
                        to={homeLink.href}
                        onClick={() => setOpenMenu(null)}
                        className={`flex items-center gap-3 rounded-2xl px-3 py-3 transition-all duration-200 ${
                          location.pathname === homeLink.href
                            ? 'bg-blue-50 text-blue-700 shadow-sm dark:bg-blue-950/40 dark:text-blue-200'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-800/80 dark:hover:text-white'
                        }`}
                      >
                        <span className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                          location.pathname === homeLink.href
                            ? 'border-blue-200 bg-white shadow-sm dark:border-blue-500/30 dark:bg-gray-900'
                            : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-950'
                        }`}>
                          <HomeIcon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold">{homeLink.title}</span>
                          <span className="block text-xs text-gray-500 dark:text-gray-400">
                            Project overview and launchpad
                          </span>
                        </span>
                        {location.pathname === homeLink.href && (
                          <Check className="h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-300" />
                        )}
                      </Link>
                    </div>

                    {algorithmCategories.map((category, categoryIndex) => {
                      const categoryAlgorithms = visualizationTabs.filter(
                        (tab) => tab.category === category.id
                      );

                      if (categoryAlgorithms.length === 0) {
                        return null;
                      }

                      return (
                        <div key={category.id} className={categoryIndex === 0 ? '' : 'pt-2'}>
                          <div className="px-3 py-2">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                              {category.label}
                            </p>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              {category.description}
                            </p>
                          </div>
                          <div className="space-y-1">
                            {categoryAlgorithms.map((tab) => {
                              const Icon = tab.icon;
                              const isActive = location.pathname === tab.path;

                              return (
                                <Link
                                  key={tab.id}
                                  to={tab.path}
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
                                    <span className="block text-sm font-semibold">{tab.shortTitle}</span>
                                    <span className="block text-xs text-gray-500 dark:text-gray-400">
                                      {tab.tagline}
                                    </span>
                                  </span>
                                  {isActive && <Check className="h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-300" />}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
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

                    <div>
                      <h3 className={`text-sm font-semibold mb-3 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        User Information
                      </h3>
                      <UserPanel variant="sidebar" onClose={() => setMobileSidebarOpen(false)} />
                    </div>

                    {/* Learning Path link */}
                    <Link
                      to="/learning-path"
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`w-full rounded-2xl border px-4 py-3 text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                        theme === 'dark'
                          ? 'border-orange-500/40 bg-orange-950/40 text-orange-200'
                          : 'border-orange-200 bg-orange-50 text-orange-700'
                      }`}
                    >
                      <Map className="h-4 w-4" />
                      Learning Path
                      {streak.currentStreak > 0 && (
                        <span className="ml-auto flex items-center gap-0.5 rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white">
                          <Flame className="h-2.5 w-2.5" />{streak.currentStreak}
                        </span>
                      )}
                    </Link>

                    {/* Glossary link */}
                    <Link
                      to="/glossary"
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`w-full rounded-2xl border px-4 py-3 text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                        theme === 'dark'
                          ? 'border-purple-500/40 bg-purple-950/40 text-purple-200'
                          : 'border-purple-200 bg-purple-50 text-purple-700'
                      }`}
                    >
                      <BookOpen className="h-4 w-4" />
                      Glossary
                    </Link>

                    <button
                      type="button"
                      onClick={() => setResetOpen(true)}
                      disabled={!user}
                      className={`w-full rounded-2xl border px-4 py-3 text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                        user
                          ? theme === 'dark'
                            ? 'border-amber-500/40 bg-amber-950/40 text-amber-200'
                            : 'border-amber-200 bg-amber-50 text-amber-700'
                          : theme === 'dark'
                            ? 'border-gray-700 bg-gray-900/70 text-gray-500'
                            : 'border-gray-200 bg-gray-100 text-gray-400'
                      }`}
                    >
                      Reset Progress
                    </button>

                    {isAdmin && (
                      <Link
                        to="/admin/feedback"
                        onClick={() => setMobileSidebarOpen(false)}
                        className={`w-full rounded-2xl border px-4 py-3 text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                          theme === 'dark'
                            ? 'border-fuchsia-500/40 bg-fuchsia-950/40 text-fuchsia-200'
                            : 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700'
                        }`}
                      >
                        <MessageSquare className="h-4 w-4" />
                        Feedback Inbox
                      </Link>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFeedbackOpen(true)}
                      className={`w-full rounded-2xl border px-4 py-3 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                        theme === 'dark'
                          ? 'border-fuchsia-500/40 bg-fuchsia-950/40 text-fuchsia-200'
                          : 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700'
                      }`}
                    >
                      <MessageSquare className="h-4 w-4" />
                      Send Feedback
                    </motion.button>
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

      <FeedbackModal
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        currentPage={location.pathname}
      />

      <ResetProgressModal
        isOpen={resetOpen}
        onClose={() => setResetOpen(false)}
      />
    </div>
  );
};

export default NavLayout;

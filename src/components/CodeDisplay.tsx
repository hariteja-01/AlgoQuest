import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Code2, Maximize2, Minimize2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

interface CodeDisplayProps {
  code: string;
  language: string;
  currentLine?: number;
  title?: string;
  className?: string;
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({
  code,
  language,
  currentLine,
  title = "Generated Code",
  className = ""
}) => {
  const { theme } = useApp();
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Prevent body scroll when modal is expanded
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = 'hidden';
      
      // Add escape key listener
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsExpanded(false);
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isExpanded]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy code');
    }
  };

  const getLanguageDisplayName = (lang: string) => {
    const names = {
      javascript: 'JavaScript',
      python: 'Python',
      cpp: 'C++',
      java: 'Java'
    };
    return names[lang as keyof typeof names] || lang;
  };

  const getSyntaxHighlighterLanguage = (lang: string) => {
    return lang === 'cpp' ? 'c' : lang;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${className} ${isExpanded ? 'fixed inset-4 z-50 flex flex-col' : 'relative'} 
        ${theme === 'dark' 
          ? 'bg-slate-800/90 border-slate-600/50' 
          : 'bg-white/90 border-slate-200/50'
        } border rounded-2xl shadow-lg ${isExpanded ? 'shadow-2xl' : 'backdrop-blur-sm'} 
        transition-all duration-300 overflow-hidden`}
      onClick={(e) => isExpanded && e.stopPropagation()}
      onWheel={(e) => isExpanded && e.stopPropagation()}
    >
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b flex-shrink-0 ${
        theme === 'dark' ? 'border-slate-600/50 bg-slate-700/50' : 'border-slate-200/50 bg-slate-50/50'
      }`}>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <Code2 className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className={`font-semibold text-sm ${
              theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
            }`}>
              {title}
            </h3>
            <p className={`text-xs ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
            }`}>
              {getLanguageDisplayName(language)}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-2 rounded-lg transition-all duration-200 ${
              theme === 'dark'
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-600'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            {isExpanded ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className={`p-2 rounded-lg transition-all duration-200 ${
              copied
                ? 'text-green-500 bg-green-100 dark:bg-green-900/30'
                : theme === 'dark'
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-600'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: -180 }}
                >
                  <Check className="h-4 w-4" />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Copy className="h-4 w-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Code Content */}
      <div 
        className={`${isExpanded ? 'flex-1 min-h-0' : 'flex-1 min-h-0'} 
        ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'} relative`}
      >
        <div className={`${isExpanded ? 'h-full' : 'h-full'} overflow-auto
          scrollbar-thin scrollbar-track-transparent 
          ${theme === 'dark' ? 'scrollbar-thumb-slate-600' : 'scrollbar-thumb-slate-300'}`}
          onScroll={(e) => e.stopPropagation()}
        >
          <div className={`w-full h-full ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}`}>
            <SyntaxHighlighter
              language={getSyntaxHighlighterLanguage(language)}
              style={theme === 'dark' ? vscDarkPlus : vs}
              customStyle={{
                margin: 0,
                padding: '1rem',
                fontSize: '0.75rem',
                backgroundColor: 'transparent',
                lineHeight: '1.6',
                fontFamily: '"Fira Code", "Monaco", "Cascadia Code", "Roboto Mono", monospace',
                minHeight: '100%',
                width: '100%',
              }}
              wrapLines={true}
              wrapLongLines={true}
              lineProps={(lineNumber) => ({
                style: {
                  backgroundColor: currentLine === lineNumber 
                    ? theme === 'dark' 
                      ? 'rgba(59, 130, 246, 0.15)' 
                      : 'rgba(59, 130, 246, 0.1)'
                    : 'transparent',
                  transition: 'background-color 0.3s ease',
                  padding: '0 0.5rem',
                  margin: 0,
                  borderRadius: '2px',
                }
              })}
              showLineNumbers={true}
              lineNumberStyle={{
                minWidth: '2.5rem',
                paddingRight: '0.75rem',
                textAlign: 'right',
                backgroundColor: 'transparent',
                borderRight: `1px solid ${theme === 'dark' ? '#475569' : '#d1d5db'}`,
                marginRight: '0.75rem',
                fontSize: '0.7rem',
                color: theme === 'dark' ? '#94a3b8' : '#6b7280',
                userSelect: 'none',
              }}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>

      {currentLine && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`absolute top-4 right-20 px-3 py-1 rounded-full text-xs font-medium ${
            theme === 'dark'
              ? 'bg-blue-900/50 text-blue-300 border border-blue-700'
              : 'bg-blue-100 text-blue-700 border border-blue-200'
          }`}
        >
          Line {currentLine}
        </motion.div>
      )}

      {/* Expanded mode backdrop */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-40"
            onClick={() => setIsExpanded(false)}
            onWheel={(e) => e.preventDefault()}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CodeDisplay;
import React, { useState } from 'react';
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
      className={`${className} ${isExpanded ? 'fixed inset-4 z-50' : 'relative'} 
        ${theme === 'dark' 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-slate-200'
        } border rounded-xl shadow-lg backdrop-blur-sm transition-all duration-300`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b ${
        theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
      }`}>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <Code2 className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className={`font-semibold ${
              theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
            }`}>
              {title}
            </h3>
            <p className={`text-sm ${
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
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
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
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
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
      <div className={`${isExpanded ? 'h-full overflow-auto' : 'max-h-96 overflow-auto'} 
        scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-400`}>
        <SyntaxHighlighter
          language={getSyntaxHighlighterLanguage(language)}
          style={theme === 'dark' ? vscDarkPlus : vs}
          customStyle={{
            margin: 0,
            padding: '1rem',
            fontSize: '0.875rem',
            backgroundColor: 'transparent',
          }}
          wrapLines={true}
          wrapLongLines={true}
          lineProps={(lineNumber) => ({
            style: {
              backgroundColor: currentLine === lineNumber 
                ? theme === 'dark' 
                  ? 'rgba(59, 130, 246, 0.1)' 
                  : 'rgba(59, 130, 246, 0.05)'
                : 'transparent',
              transition: 'background-color 0.3s ease'
            }
          })}
          showLineNumbers={true}
        >
          {code}
        </SyntaxHighlighter>
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CodeDisplay;
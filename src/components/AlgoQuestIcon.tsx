import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

interface AlgoQuestIconProps {
  className?: string;
  size?: number;
  useImage?: boolean;
}

export const AlgoQuestIcon: React.FC<AlgoQuestIconProps> = ({ 
  className = "", 
  size = 32,
  useImage = false
}) => {
  const { theme } = useApp();

  // If useImage is true, use the PNG icon with animations
  if (useImage) {
    return (
      <Link to="/">
        <motion.div
          className={`relative inline-block cursor-pointer ${className}`}
          style={{ width: size * 1.2, height: size * 1.2 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.6, 
            ease: "easeOut",
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
        >
          {/* Enhanced backdrop with better contrast for AVIF logo */}
          <motion.div
            className="absolute inset-0 rounded-xl"
            style={{
              background: theme === 'dark' 
                ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(51, 65, 85, 0.9))'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.95))',
              border: theme === 'dark' 
                ? '1px solid rgba(148, 163, 184, 0.25)'
                : '1px solid rgba(203, 213, 225, 0.4)',
              backdropFilter: 'blur(12px)',
              boxShadow: theme === 'dark'
                ? '0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                : '0 4px 24px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
            }}
            whileHover={{
              boxShadow: theme === 'dark'
                ? '0 8px 40px rgba(59, 130, 246, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                : '0 8px 40px rgba(59, 130, 246, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
              borderColor: theme === 'dark' 
                ? 'rgba(96, 165, 250, 0.5)'
                : 'rgba(59, 130, 246, 0.4)'
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Enhanced corner accents for AVIF logo */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Top-left corner */}
            <motion.div 
              className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 rounded-tl-xl"
              style={{
                borderColor: theme === 'dark' ? '#60A5FA' : '#3B82F6'
              }}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            />
            {/* Top-right corner */}
            <motion.div 
              className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 rounded-tr-xl"
              style={{
                borderColor: theme === 'dark' ? '#A78BFA' : '#8B5CF6'
              }}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2, delay: 0.05 }}
            />
            {/* Bottom-left corner */}
            <motion.div 
              className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 rounded-bl-xl"
              style={{
                borderColor: theme === 'dark' ? '#34D399' : '#10B981'
              }}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            />
            {/* Bottom-right corner */}
            <motion.div 
              className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 rounded-br-xl"
              style={{
                borderColor: theme === 'dark' ? '#F472B6' : '#EC4899'
              }}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2, delay: 0.15 }}
            />
          </motion.div>

          {/* Main logo image with AVIF support and PNG fallback */}
          <picture className="relative z-10 w-full h-full flex items-center justify-center">
            <source srcSet="/LOGO2.avif" type="image/avif" />
            <motion.img
              src="/icon.png"
              alt="AlgoQuest Logo"
              className="w-full h-full object-contain p-2"
              style={{
                filter: theme === 'dark' 
                  ? 'brightness(1.3) contrast(1.2) saturate(1.1) drop-shadow(0 2px 8px rgba(255, 255, 255, 0.1))'
                  : 'brightness(0.9) contrast(1.1) saturate(1.1) drop-shadow(0 2px 8px rgba(0, 0, 0, 0.15))',
              }}
              whileHover={{ 
                scale: 1.02,
                filter: theme === 'dark'
                  ? 'brightness(1.4) contrast(1.3) saturate(1.2) drop-shadow(0 4px 12px rgba(255, 255, 255, 0.15))'
                  : 'brightness(0.85) contrast(1.2) saturate(1.2) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2))'
              }}
              transition={{ 
                duration: 0.3,
                ease: "easeOut"
              }}
            />
          </picture>

          {/* Enhanced progress indicator with gradient */}
          <motion.div
            className="absolute bottom-0 left-0 h-1 rounded-full"
            style={{
              background: theme === 'dark'
                ? 'linear-gradient(90deg, #60A5FA, #A78BFA, #F472B6)'
                : 'linear-gradient(90deg, #3B82F6, #8B5CF6, #EC4899)'
            }}
            initial={{ width: 0 }}
            whileHover={{ width: "100%" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />

          {/* Professional hover overlay with subtle animation */}
          <motion.div
            className="absolute inset-0 rounded-xl"
            style={{
              background: theme === 'dark'
                ? 'linear-gradient(135deg, rgba(96, 165, 250, 0.05), rgba(167, 139, 250, 0.03))'
                : 'linear-gradient(135deg, rgba(59, 130, 246, 0.04), rgba(139, 92, 246, 0.02))'
            }}
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </Link>
    );
  }

  // Original SVG icon with enhanced formal animations for fallback
  return (
    <Link to="/">
      <motion.div 
        className={`relative inline-block cursor-pointer ${className}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 0.5, 
          ease: "easeOut",
          type: "spring",
          stiffness: 200,
          damping: 15
        }}
      >
        <motion.svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          style={{
            filter: theme === 'dark'
              ? 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))'
              : 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1))'
          }}
        >
          {/* Professional background circle */}
          <motion.circle
            cx="24"
            cy="24"
            r="22"
            fill={theme === 'dark' ? 'rgba(51, 65, 85, 0.9)' : 'rgba(255, 255, 255, 0.9)'}
            stroke={theme === 'dark' ? 'rgba(148, 163, 184, 0.3)' : 'rgba(203, 213, 225, 0.4)'}
            strokeWidth="1"
            whileHover={{
              fill: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
              stroke: theme === 'dark' ? 'rgba(96, 165, 250, 0.5)' : 'rgba(59, 130, 246, 0.4)'
            }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Elegant inner ring */}
          <motion.circle
            cx="24"
            cy="24"
            r="18"
            fill="none"
            stroke={`url(#innerGradient-${theme})`}
            strokeWidth="1"
            strokeDasharray="2 2"
            initial={{ rotate: 0 }}
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
          
          {/* Main geometric pattern */}
          <motion.g
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            whileHover={{ scale: 1.1 }}
          >
            {/* Central professional diamond */}
            <motion.polygon
              points="24,10 34,20 24,30 14,20"
              fill={`url(#centerGradient-${theme})`}
              stroke={`url(#strokeGradient-${theme})`}
              strokeWidth="1.5"
              whileHover={{
                fill: `url(#centerHoverGradient-${theme})`
              }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Professional algorithm nodes */}
            {[
              { cx: 24, cy: 15, color: '#60A5FA' },
              { cx: 29, cy: 20, color: '#A78BFA' },
              { cx: 24, cy: 25, color: '#F472B6' },
              { cx: 19, cy: 20, color: '#34D399' }
            ].map((node, i) => (
              <motion.circle
                key={i}
                cx={node.cx}
                cy={node.cy}
                r="2.5"
                fill={theme === 'dark' ? node.color : node.color.replace('FA', 'E6')}
                stroke={theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}
                strokeWidth="0.5"
                whileHover={{
                  r: 3,
                  fill: node.color
                }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
              />
            ))}
            
            {/* Clean connecting lines */}
            <motion.line
              x1="24" y1="18" x2="24" y2="22"
              stroke={`url(#lineGradient-${theme})`}
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            />
            <motion.line
              x1="22" y1="20" x2="26" y2="20"
              stroke={`url(#lineGradient-${theme})`}
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            />
          </motion.g>
          
          {/* Elegant corner indicators */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.8 }}
          >
            {[
              { cx: 8, cy: 8 },
              { cx: 40, cy: 8 },
              { cx: 8, cy: 40 },
              { cx: 40, cy: 40 }
            ].map((dot, i) => (
              <motion.circle
                key={i}
                cx={dot.cx}
                cy={dot.cy}
                r="1.5"
                fill={theme === 'dark' ? 'rgba(96, 165, 250, 0.6)' : 'rgba(59, 130, 246, 0.5)'}
                whileHover={{
                  r: 2,
                  fill: theme === 'dark' ? '#60A5FA' : '#3B82F6'
                }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
              />
            ))}
          </motion.g>
          
          {/* Professional gradient definitions for both themes */}
          <defs>
            {/* Dark theme gradients */}
            <linearGradient id="innerGradient-dark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(96, 165, 250, 0.6)" />
              <stop offset="100%" stopColor="rgba(167, 139, 250, 0.4)" />
            </linearGradient>
            
            <linearGradient id="centerGradient-dark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.8)" />
              <stop offset="100%" stopColor="rgba(139, 92, 246, 0.6)" />
            </linearGradient>

            <linearGradient id="centerHoverGradient-dark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(96, 165, 250, 0.9)" />
              <stop offset="100%" stopColor="rgba(167, 139, 250, 0.8)" />
            </linearGradient>
            
            <linearGradient id="strokeGradient-dark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(96, 165, 250, 0.8)" />
              <stop offset="100%" stopColor="rgba(167, 139, 250, 0.6)" />
            </linearGradient>
            
            <linearGradient id="lineGradient-dark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(96, 165, 250, 0.7)" />
              <stop offset="100%" stopColor="rgba(167, 139, 250, 0.5)" />
            </linearGradient>

            {/* Light theme gradients */}
            <linearGradient id="innerGradient-light" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.4)" />
              <stop offset="100%" stopColor="rgba(139, 92, 246, 0.3)" />
            </linearGradient>
            
            <linearGradient id="centerGradient-light" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.6)" />
              <stop offset="100%" stopColor="rgba(139, 92, 246, 0.4)" />
            </linearGradient>

            <linearGradient id="centerHoverGradient-light" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.8)" />
              <stop offset="100%" stopColor="rgba(139, 92, 246, 0.6)" />
            </linearGradient>
            
            <linearGradient id="strokeGradient-light" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.6)" />
              <stop offset="100%" stopColor="rgba(139, 92, 246, 0.4)" />
            </linearGradient>
            
            <linearGradient id="lineGradient-light" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.5)" />
              <stop offset="100%" stopColor="rgba(139, 92, 246, 0.3)" />
            </linearGradient>
          </defs>
        </motion.svg>
      </motion.div>
    </Link>
  );
};

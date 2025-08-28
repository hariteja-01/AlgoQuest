import React from 'react';
import { motion } from 'framer-motion';

interface AlgoQuestIconProps {
  className?: string;
  size?: number;
}

export const AlgoQuestIcon: React.FC<AlgoQuestIconProps> = ({ 
  className = "", 
  size = 32 
}) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      whileHover={{ rotate: 360 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Outer ring with gradient */}
      <motion.circle
        cx="24"
        cy="24"
        r="22"
        fill="none"
        stroke="url(#outerGradient)"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      
      {/* Inner geometric pattern */}
      <motion.g
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
      >
        {/* Central diamond */}
        <polygon
          points="24,8 36,20 24,32 12,20"
          fill="url(#centerGradient)"
          stroke="url(#strokeGradient)"
          strokeWidth="1.5"
        />
        
        {/* Algorithm nodes */}
        <circle cx="24" cy="13" r="3" fill="url(#nodeGradient1)" />
        <circle cx="31" cy="20" r="3" fill="url(#nodeGradient2)" />
        <circle cx="24" cy="27" r="3" fill="url(#nodeGradient3)" />
        <circle cx="17" cy="20" r="3" fill="url(#nodeGradient1)" />
        
        {/* Connecting lines */}
        <motion.line
          x1="24" y1="16" x2="24" y2="24"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        />
        <motion.line
          x1="28" y1="20" x2="20" y2="20"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        />
      </motion.g>
      
      {/* Corner accent dots */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.5 }}
      >
        <circle cx="8" cy="8" r="2" fill="url(#accentGradient)" />
        <circle cx="40" cy="8" r="2" fill="url(#accentGradient)" />
        <circle cx="8" cy="40" r="2" fill="url(#accentGradient)" />
        <circle cx="40" cy="40" r="2" fill="url(#accentGradient)" />
      </motion.g>
      
      {/* Gradient definitions */}
      <defs>
        <linearGradient id="outerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
        
        <linearGradient id="centerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.8" />
        </linearGradient>
        
        <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        
        <radialGradient id="nodeGradient1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F59E0B" />
        </radialGradient>
        
        <radialGradient id="nodeGradient2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#10B981" />
        </radialGradient>
        
        <radialGradient id="nodeGradient3" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F472B6" />
          <stop offset="100%" stopColor="#EC4899" />
        </radialGradient>
        
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>
        
        <radialGradient id="accentGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.6" />
        </radialGradient>
      </defs>
    </motion.svg>
  );
};

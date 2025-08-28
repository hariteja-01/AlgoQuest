import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

interface NavIconProps {
  className?: string;
  size?: number;
}

export const NavIcon: React.FC<NavIconProps> = ({ 
  className = "", 
  size = 28 
}) => {
  const { theme } = useApp();
  
  // Dynamic colors based on theme
  const iconColors = {
    primary: theme === 'dark' ? 'rgba(255,255,255,0.95)' : 'rgba(37,99,235,0.95)',
    secondary: theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(59,130,246,0.7)',
    tertiary: theme === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(99,102,241,0.6)',
    accent: theme === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(147,51,234,0.8)',
    glow: theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(37,99,235,0.2)',
    stroke: theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(37,99,235,0.3)'
  };

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      whileHover={{ 
        rotate: 360, 
        scale: 1.15,
        filter: `drop-shadow(0 0 8px ${iconColors.glow})`
      }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Main geometric shape */}
      <motion.g
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Central diamond/rhombus */}
        <polygon
          points="16,4 28,16 16,28 4,16"
          fill={iconColors.primary}
          stroke={iconColors.stroke}
          strokeWidth="0.5"
        />
        
        {/* Inner pattern */}
        <polygon
          points="16,8 24,16 16,24 8,16"
          fill="none"
          stroke={iconColors.secondary}
          strokeWidth="1.5"
        />
        
        {/* Center dot */}
        <circle 
          cx="16" 
          cy="16" 
          r="2" 
          fill={iconColors.primary}
        />
        
        {/* Algorithm connection points */}
        <circle cx="16" cy="10" r="1.5" fill={iconColors.accent} />
        <circle cx="22" cy="16" r="1.5" fill={iconColors.accent} />
        <circle cx="16" cy="22" r="1.5" fill={iconColors.accent} />
        <circle cx="10" cy="16" r="1.5" fill={iconColors.accent} />
        
        {/* Connecting lines */}
        <motion.line
          x1="16" y1="12" x2="16" y2="20"
          stroke={iconColors.tertiary}
          strokeWidth="1"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        />
        <motion.line
          x1="12" y1="16" x2="20" y2="16"
          stroke={iconColors.tertiary}
          strokeWidth="1"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        />
      </motion.g>
      
      {/* Corner sparkles */}
      <motion.g
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.8 }}
      >
        <circle cx="6" cy="6" r="1" fill={iconColors.secondary} />
        <circle cx="26" cy="6" r="1" fill={iconColors.secondary} />
        <circle cx="6" cy="26" r="1" fill={iconColors.secondary} />
        <circle cx="26" cy="26" r="1" fill={iconColors.secondary} />
      </motion.g>
      
      {/* Pulsing outer ring */}
      <motion.circle
        cx="16"
        cy="16"
        r="15"
        fill="none"
        stroke={iconColors.glow}
        strokeWidth="0.5"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: [0.8, 1.1, 0.8],
          opacity: [0, 0.3, 0]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.svg>
  );
};

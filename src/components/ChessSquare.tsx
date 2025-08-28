import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChessSquareProps {
  row: number;
  col: number;
  hasQueen: boolean;
  isUnderAttack: boolean;
  isHovered: boolean;
  wouldBeValid: boolean;
  onClick: (row: number, col: number) => void;
  onHover: (row: number, col: number) => void;
  mode: 'manual' | 'solve' | 'solutions';
  boardSize?: number;
  theme?: string; // Add theme prop
}

const ChessSquare: React.FC<ChessSquareProps> = React.memo(({
  row,
  col,
  hasQueen,
  isUnderAttack,
  isHovered,
  wouldBeValid,
  onClick,
  onHover,
  mode,
  boardSize = 8,
  theme = 'light'
}) => {
  const handleMouseEnter = useCallback(() => {
    onHover(row, col);
  }, [row, col, onHover]);

  const handleMouseLeave = useCallback(() => {
    onHover(-1, -1); // Reset hover state
  }, [onHover]);

  // Dynamic sizing based on board size
  const queenSize = boardSize <= 6 ? 'text-3xl' : boardSize <= 8 ? 'text-2xl' : 'text-xl';

  // Get square colors based on theme
  const lightSquareColor = theme === 'dark' ? 'bg-amber-200' : 'bg-amber-100';
  const darkSquareColor = theme === 'dark' ? 'bg-amber-700' : 'bg-amber-800';
  
  // Attack and valid move colors for dark mode
  const attackRingColor = theme === 'dark' ? 'ring-red-400' : 'ring-red-500';
  const attackBgColor = theme === 'dark' ? 'bg-red-500/20' : 'bg-red-100/30';
  const validRingColor = theme === 'dark' ? 'ring-green-400' : 'ring-green-500';
  const validBgColor = theme === 'dark' ? 'bg-green-500/20' : 'bg-green-100/30';

  return (
    <motion.div
      className={`aspect-square flex items-center justify-center cursor-pointer relative transition-all duration-200 rounded-sm
      ${(row + col) % 2 === 0 ? lightSquareColor : darkSquareColor}
      ${isUnderAttack && !hasQueen ? `ring-2 ${attackRingColor}/70 ${attackBgColor}` : ''}
      ${wouldBeValid && !hasQueen ? `ring-2 ${validRingColor}/70 ${validBgColor}` : ''}
      ${isHovered && !wouldBeValid && mode === 'manual' ? `ring-2 ${theme === 'dark' ? 'ring-red-400' : 'ring-red-400'}/70` : ''}`}
      onClick={() => onClick(row, col)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <AnimatePresence>
        {hasQueen && (
          <motion.div
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -180 }}
            className={queenSize}
          >
            👑
          </motion.div>
        )}
      </AnimatePresence>

      {isUnderAttack && !hasQueen && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-3 h-3 bg-red-500 rounded-full shadow-lg"
          />
        </div>
      )}

      {wouldBeValid && !hasQueen && !isUnderAttack && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-2 h-2 bg-green-500 rounded-full shadow-lg"
          />
        </div>
      )}
    </motion.div>
  );
});

export default ChessSquare;

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
  mode
}) => {
  const handleMouseEnter = useCallback(() => {
    onHover(row, col);
  }, [row, col, onHover]);

  const handleMouseLeave = useCallback(() => {
    onHover(-1, -1); // Reset hover state
  }, [onHover]);

  return (
    <motion.div
      className={`aspect-square flex items-center justify-center cursor-pointer relative transition-all duration-200
      ${isUnderAttack ? 'bg-red-200 dark:bg-red-900/30' : ''}
      ${wouldBeValid ? 'bg-green-200 dark:bg-green-900/30' : ''}
      ${isHovered && !wouldBeValid && mode === 'manual' ? 'bg-red-300 dark:bg-red-800/40' : ''}`}
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
            className="text-4xl"
          >
            👑
          </motion.div>
        )}
      </AnimatePresence>

      {isUnderAttack && !hasQueen && (
        <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        </div>
      )}
    </motion.div>
  );
});

export default ChessSquare;

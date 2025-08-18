import React from 'react';
import { motion } from 'framer-motion';

interface DPCellProps {
  value: number;
  isCurrentStep: boolean;
  isInPath: boolean;
  isMatch: boolean | undefined;
  theme: string;
}

const DPCell: React.FC<DPCellProps> = ({ value, isCurrentStep, isInPath, isMatch, theme }) => {
  return (
    <motion.td
      className={`p-2 border text-center transition-all duration-300 ${
        theme === 'dark' ? 'border-slate-600' : 'border-slate-300'
      } ${
        isInPath
          ? isMatch
            ? 'bg-green-200 dark:bg-green-900/30 font-bold'
            : 'bg-blue-200 dark:bg-blue-900/30'
          : isCurrentStep
          ? 'bg-yellow-200 dark:bg-yellow-900/30'
          : ''
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: isCurrentStep ? 1 : 0.3 }}
      transition={{ duration: 0.3 }}
    >
      {isCurrentStep ? value : ''}
    </motion.td>
  );
};

export default React.memo(DPCell);

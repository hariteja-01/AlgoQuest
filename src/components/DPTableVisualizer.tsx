import React from 'react';
import { motion } from 'framer-motion';

interface DPTableVisualizerProps {
  dpTable: number[][];
  strings: string[];
  currentStep: { row: number; col: number; char?: string }[];
  theme: string;
  setCurrentStep: React.Dispatch<React.SetStateAction<{ row: number; col: number; char?: string }>>;
}

const DPTableVisualizer: React.FC<DPTableVisualizerProps> = ({ dpTable = [[]], strings = ['', ''], currentStep, theme, setCurrentStep }) => {
  const renderPointer = (row: number, col: number) => {
    const isMatch = currentStep?.find(step => step.row === row && step.col === col)?.char;
    return isMatch ? (
      <div className="absolute top-1 right-1 flex items-start justify-end pointer-events-none">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      </div>
    ) : null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-6 rounded-2xl backdrop-blur-sm ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } shadow-lg border border-gray-500`}
    >
      <h3
        className={`text-lg font-semibold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}
      >
        Dynamic Programming Table
      </h3>
      <div className="overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className={`p-2 border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}></th>
              {["ε", ...strings[1]?.split("")].map((char, idx) => (
                <th key={idx} className={`p-2 border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} text-center`}>{char}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {["ε", ...strings[0]?.split("")].map((char1, i) => (
              <tr key={i}>
                <th className={`p-2 border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} text-center`}>{char1}</th>
                {Array.from({ length: (dpTable[0]?.length || 0) }, (_, j) => (
                  <td
                    key={j}
                    className={`p-2 border text-center relative ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}
                  >
                    {typeof dpTable[i]?.[j] === 'number' ? dpTable[i][j] : ''}
                    {renderPointer(i, j)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default React.memo(DPTableVisualizer);

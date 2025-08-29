import React from 'react';
import { useApp } from '../context/AppContext';
import { BackgroundPaths } from './FloatingPaths';
import { Meteors } from './Meteors';

export const DynamicBackground: React.FC = () => {
  const { theme } = useApp();

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Light mode background */}
      {theme === 'light' && (
        <div className="absolute inset-0">
          <BackgroundPaths />
          {/* Additional subtle gradient overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-white/20" />
        </div>
      )}

      {/* Dark mode background */}
      {theme === 'dark' && (
        <div className="absolute inset-0">
          <Meteors number={30} />
          {/* Subtle overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/5 to-slate-900/10" />
        </div>
      )}

      {/* Universal text protection overlay */}
      <div className={`absolute inset-0 ${
        theme === 'dark' 
          ? 'bg-gradient-to-b from-slate-900/20 via-transparent to-slate-900/30' 
          : 'bg-gradient-to-b from-blue-50/30 via-transparent to-blue-50/40'
      }`} />
    </div>
  );
};

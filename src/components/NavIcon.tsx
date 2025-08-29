import React from 'react';
import { AlgoQuestIcon } from './AlgoQuestIcon';

interface NavIconProps {
  className?: string;
  size?: number;
}

export const NavIcon: React.FC<NavIconProps> = ({ 
  className = "", 
  size = 40 // Increased from 28 to 40 for bigger size
}) => {
  return (
    <AlgoQuestIcon 
      className={className}
      size={size}
      useImage={true}
    />
  );
};

import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { Language, Theme } from '../types';
import { useTheme } from '../hooks/useTheme';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('javascript');
  const { theme, toggleTheme } = useTheme();

  const contextValue = useMemo(() => ({
    language,
    setLanguage,
    theme,
    toggleTheme
  }), [language, theme, toggleTheme]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
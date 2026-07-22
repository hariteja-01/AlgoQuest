import React from 'react';
import { useAuth } from '../context/AuthContext';
import AuthScreen from '../pages/AuthScreen';

const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading, isConfigured } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="text-center space-y-2">
          <div className="h-2 w-24 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 mx-auto" />
          <p className="text-sm text-slate-400">Preparing your workspace...</p>
        </div>
      </div>
    );
  }

  if (!isConfigured) {
    return <>{children}</>;
  }

  if (!user) {
    return <AuthScreen />;
  }

  return <>{children}</>;
};

export default AuthGate;

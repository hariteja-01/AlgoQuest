import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Check, Eye, EyeOff, LogOut, Mail, Shield, UserCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

interface UserPanelProps {
  onClose?: () => void;
  variant?: 'dropdown' | 'sidebar';
}

const UserPanel: React.FC<UserPanelProps> = ({ onClose, variant = 'dropdown' }) => {
  const { theme } = useApp();
  const { user, profile, isLoading, isConfigured, isAdmin, signIn, signUp, signOut, updateProfile } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState(profile?.role ?? 'Learner');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setFullName(profile?.full_name ?? '');
    setRole(profile?.role ?? 'Learner');
    setAvatarUrl(profile?.avatar_url ?? '');
  }, [profile]);

  const containerClass = useMemo(() => {
    return variant === 'sidebar'
      ? 'rounded-2xl border p-4'
      : 'rounded-2xl border p-4';
  }, [variant]);

  const handleAuth = async () => {
    if (!email || !password) {
      toast.error('Email and password are required.');
      return;
    }

    setSubmitting(true);
    const result = mode === 'signin'
      ? await signIn(email, password)
      : await signUp(email, password, fullName || undefined);

    setSubmitting(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success(mode === 'signin' ? 'Welcome back!' : 'Account created. Check your email if confirmation is required.');
    setEmail('');
    setPassword('');
    setFullName('');
    onClose?.();
  };

  const handleProfileUpdate = async () => {
    setSubmitting(true);
    const result = await updateProfile({
      full_name: fullName || profile?.full_name || null,
      role: role || profile?.role || null,
      avatar_url: avatarUrl || profile?.avatar_url || null,
    });
    setSubmitting(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success('Profile updated.');
  };

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success('Signed out.');
    onClose?.();
  };

  if (!isConfigured) {
    return (
      <div className={`${containerClass} ${theme === 'dark' ? 'border-slate-700 bg-slate-900/60' : 'border-slate-200 bg-white/80'}`}>
        <div className="flex items-start gap-3 text-sm">
          <AlertCircle className={`h-5 w-5 ${theme === 'dark' ? 'text-amber-300' : 'text-amber-500'}`} />
          <div>
            <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Supabase not configured</p>
            <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable accounts and feedback.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`${containerClass} ${theme === 'dark' ? 'border-slate-700 bg-slate-900/60 text-slate-300' : 'border-slate-200 bg-white/80 text-slate-600'}`}>
        Loading user profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`${containerClass} ${theme === 'dark' ? 'border-slate-700 bg-slate-900/60' : 'border-slate-200 bg-white/80'}`}>
        <div className="flex items-center justify-between mb-3">
          <div className={`flex items-center gap-2 font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            <UserCircle2 className="h-5 w-5" />
            {mode === 'signin' ? 'Sign in' : 'Create account'}
          </div>
          <button
            type="button"
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className={`text-xs font-semibold ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}
          >
            {mode === 'signin' ? 'Need an account?' : 'Have an account?'}
          </button>
        </div>

        <div className="space-y-3">
          {mode === 'signup' && (
            <div>
              <label className={`block text-xs font-medium mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                Full name
              </label>
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className={`w-full rounded-xl border px-3 py-2 text-sm ${
                  theme === 'dark'
                    ? 'border-slate-700 bg-slate-800 text-slate-100'
                    : 'border-slate-200 bg-white text-slate-900'
                }`}
                placeholder="AlgoQuest Learner"
              />
            </div>
          )}
          <div>
            <label className={`block text-xs font-medium mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={`w-full rounded-xl border px-3 py-2 text-sm ${
                theme === 'dark'
                  ? 'border-slate-700 bg-slate-800 text-slate-100'
                  : 'border-slate-200 bg-white text-slate-900'
              }`}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className={`block text-xs font-medium mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={`w-full rounded-xl border px-3 py-2 pr-10 text-sm ${
                  theme === 'dark'
                    ? 'border-slate-700 bg-slate-800 text-slate-100'
                    : 'border-slate-200 bg-white text-slate-900'
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className={`absolute right-2 top-2 rounded-md p-1 ${
                  theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'
                }`}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAuth}
            disabled={submitting}
            className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white"
          >
            {submitting ? 'Working...' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${containerClass} ${theme === 'dark' ? 'border-slate-700 bg-slate-900/60' : 'border-slate-200 bg-white/80'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`flex items-center gap-2 font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          <UserCircle2 className="h-5 w-5" />
          User profile
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${
          theme === 'dark' ? 'bg-emerald-900/40 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
        }`}>
          <Check className="h-3 w-3" /> Signed in
        </span>
      </div>

      <div className="space-y-3">
        <div className={`rounded-xl border px-3 py-2 text-xs ${
          theme === 'dark' ? 'border-slate-700 text-slate-300' : 'border-slate-200 text-slate-600'
        }`}>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            {user.email}
          </div>
        </div>

        <div>
          <label className={`block text-xs font-medium mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
            Full name
          </label>
          <input
            value={fullName || profile?.full_name || ''}
            onChange={(event) => setFullName(event.target.value)}
            className={`w-full rounded-xl border px-3 py-2 text-sm ${
              theme === 'dark'
                ? 'border-slate-700 bg-slate-800 text-slate-100'
                : 'border-slate-200 bg-white text-slate-900'
            }`}
            placeholder="AlgoQuest Learner"
          />
        </div>

        <div>
          <label className={`block text-xs font-medium mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
            Role
          </label>
          <div className="relative">
            <Shield className={`absolute left-3 top-2.5 h-4 w-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} />
            <input
              value={role}
              onChange={(event) => setRole(event.target.value)}
              disabled={!isAdmin}
              className={`w-full rounded-xl border py-2 pl-9 pr-3 text-sm ${
                theme === 'dark'
                  ? 'border-slate-700 bg-slate-800 text-slate-100'
                  : 'border-slate-200 bg-white text-slate-900'
              }`}
              placeholder="Learner"
            />
          </div>
          {!isAdmin && (
            <p className={`mt-1 text-[11px] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
              Role is managed by the project admin.
            </p>
          )}
        </div>

        <div>
          <label className={`block text-xs font-medium mb-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
            Avatar URL
          </label>
          <input
            value={avatarUrl}
            onChange={(event) => setAvatarUrl(event.target.value)}
            className={`w-full rounded-xl border px-3 py-2 text-sm ${
              theme === 'dark'
                ? 'border-slate-700 bg-slate-800 text-slate-100'
                : 'border-slate-200 bg-white text-slate-900'
            }`}
            placeholder="https://..."
          />
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleProfileUpdate}
            disabled={submitting}
            className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold ${
              theme === 'dark'
                ? 'bg-slate-700 text-white'
                : 'bg-slate-900 text-white'
            }`}
          >
            {submitting ? 'Saving...' : 'Update profile'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSignOut}
            className={`rounded-xl border px-4 py-2 text-sm font-semibold ${
              theme === 'dark'
                ? 'border-slate-600 text-slate-200'
                : 'border-slate-200 text-slate-700'
            }`}
          >
            <LogOut className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default UserPanel;

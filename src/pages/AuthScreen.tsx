import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, EyeOff, Lock, Sparkles, Star, UserPlus, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const AuthScreen: React.FC = () => {
  const { signIn, signUp, isConfigured } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const headline = useMemo(() => (
    mode === 'signin'
      ? 'Welcome back to AlgoQuest'
      : 'Join AlgoQuest in seconds'
  ), [mode]);

  const handleSubmit = async () => {
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

    toast.success(mode === 'signin' ? 'Signed in successfully!' : 'Account created. Check your email if confirmation is required.');
  };

  if (!isConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white px-6">
        <div className="max-w-lg text-center space-y-4">
          <h1 className="text-3xl font-black">Supabase is not configured</h1>
          <p className="text-slate-400">Add your Supabase keys in <span className="font-mono">.env</span> to enable authentication.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900" />
      <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-500/30 blur-[140px]" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-400/20 blur-[140px]" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-10 px-6 py-12 lg:flex-row">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 space-y-6"
          style={{ fontFamily: '"Space Grotesk", "Segoe UI", sans-serif' }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
            <Sparkles className="h-4 w-4" />
            AlgoQuest Access
          </div>
          <h1 className="text-4xl font-black text-white sm:text-5xl">{headline}</h1>
          <p className="max-w-xl text-base text-slate-300">
            Explore interactive algorithm worlds, earn XP streaks, and unlock advanced puzzles with a stunning guided path.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: Star, title: 'Guided Path', copy: 'Duolingo-style map with unlocks.' },
              { icon: Zap, title: 'Instant Code', copy: 'Java, C#, C++, Python, JS.' },
              { icon: Lock, title: 'Secure Profiles', copy: 'Supabase-backed accounts.' },
              { icon: UserPlus, title: 'Progress Sync', copy: 'Your streak follows you.' },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <item.icon className="h-5 w-5 text-cyan-300" />
                <p className="mt-3 text-sm font-semibold text-white">{item.title}</p>
                <p className="mt-1 text-xs text-slate-400">{item.copy}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Auth card */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md rounded-[2rem] border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur"
          style={{ fontFamily: '"Space Grotesk", "Segoe UI", sans-serif' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-cyan-200">{mode === 'signin' ? 'Sign in' : 'Create account'}</p>
              <p className="text-2xl font-black text-white">Enter AlgoQuest</p>
            </div>
            <button
              type="button"
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white/80"
            >
              {mode === 'signin' ? 'Need account?' : 'Have account?'}
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-300">Full name</label>
                <input
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white"
                  placeholder="AlgoQuest Learner"
                />
              </div>
            )}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-300">Password</label>
              <div className="relative mt-2">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 pr-10 text-sm text-white"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-2 rounded-md p-1 text-slate-300"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 px-4 py-3 text-sm font-semibold text-white"
            >
              {submitting ? 'Working...' : mode === 'signin' ? 'Sign in' : 'Create account'}
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </div>

          <p className="mt-6 text-xs text-slate-400">
            By continuing you agree to securely store your progress in Supabase.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthScreen;

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

export interface UserProfile {
  id: string;
  full_name: string | null;
  role: string | null;
  avatar_url: string | null;
  progress: Record<string, unknown> | null;
  updated_at: string | null;
}

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isConfigured: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>; 
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error?: string }>;
  signOut: () => Promise<{ error?: string }>;
  verifyPassword: (password: string) => Promise<{ error?: string }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error?: string }>;
  submitFeedback: (payload: { category: string; message: string; rating: number; page: string }) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const defaultError = 'Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const adminEmails = useMemo(() => {
    const raw = import.meta.env.VITE_ADMIN_EMAILS as string | undefined;
    return (raw ?? '')
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);
  }, []);

  const isAdmin = useMemo(() => {
    const email = user?.email?.toLowerCase() ?? '';
    if (adminEmails.length > 0) {
      return adminEmails.includes(email);
    }
    return profile?.role === 'Admin';
  }, [adminEmails, user?.email, profile?.role]);

  const loadProfile = async (userId: string, email?: string | null, fullName?: string | null) => {
    if (!supabase) {
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, role, avatar_url, progress, updated_at')
      .eq('id', userId)
      .single();

    if (error && error.code === 'PGRST116') {
      const { data: createdProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          full_name: fullName ?? email ?? 'AlgoQuest Learner',
          role: 'Learner',
          progress: {},
          updated_at: new Date().toISOString(),
        })
        .select('id, full_name, role, avatar_url, progress, updated_at')
        .single();

      if (!insertError) {
        setProfile(createdProfile as UserProfile);
      }
      return;
    }

    if (!error && data) {
      setProfile(data as UserProfile);
    }
  };

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        const displayName = data.session.user.user_metadata?.full_name as string | undefined;
        loadProfile(data.session.user.id, data.session.user.email, displayName ?? null);
      }
      setIsLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        const displayName = newSession.user.user_metadata?.full_name as string | undefined;
        loadProfile(newSession.user.id, newSession.user.email, displayName ?? null);
      } else {
        setProfile(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn: AuthContextValue['signIn'] = async (email, password) => {
    if (!supabase) {
      return { error: defaultError };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? { error: error.message } : {};
  };

  const signUp: AuthContextValue['signUp'] = async (email, password, fullName) => {
    if (!supabase) {
      return { error: defaultError };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName ?? 'AlgoQuest Learner' },
      },
    });

    if (error) {
      return { error: error.message };
    }

    if (data.user) {
      await loadProfile(data.user.id, data.user.email, fullName ?? null);
    }

    return {};
  };

  const signOut: AuthContextValue['signOut'] = async () => {
    if (!supabase) {
      return { error: defaultError };
    }
    const { error } = await supabase.auth.signOut();
    return error ? { error: error.message } : {};
  };

  const verifyPassword: AuthContextValue['verifyPassword'] = async (password) => {
    if (!supabase || !user?.email) {
      return { error: defaultError };
    }
    const { error } = await supabase.auth.signInWithPassword({
      email: user.email,
      password,
    });
    return error ? { error: error.message } : {};
  };

  const updateProfile: AuthContextValue['updateProfile'] = async (updates) => {
    if (!supabase || !user) {
      return { error: defaultError };
    }

    const nextRole = isAdmin
      ? (updates.role ?? profile?.role ?? null)
      : (profile?.role ?? null);

    const payload = {
      id: user.id,
      full_name: updates.full_name ?? profile?.full_name ?? null,
      role: nextRole,
      avatar_url: updates.avatar_url ?? profile?.avatar_url ?? null,
      progress: updates.progress ?? profile?.progress ?? {},
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('profiles')
      .upsert(payload)
      .select('id, full_name, role, avatar_url, progress, updated_at')
      .single();

    if (error) {
      return { error: error.message };
    }

    setProfile(data as UserProfile);
    return {};
  };

  const submitFeedback: AuthContextValue['submitFeedback'] = async ({ category, message, rating, page }) => {
    if (!supabase || !user) {
      return { error: 'Sign in to submit feedback.' };
    }

    const { error } = await supabase
      .from('feedback')
      .insert({
        user_id: user.id,
        category,
        message,
        rating,
        page,
        user_email: user.email ?? null,
        user_name: profile?.full_name ?? user.user_metadata?.full_name ?? null,
      });

    return error ? { error: error.message } : {};
  };

  const value = useMemo(() => ({
    session,
    user,
    profile,
    isLoading,
    isConfigured: isSupabaseConfigured,
    isAdmin,
    signIn,
    signUp,
    signOut,
    verifyPassword,
    updateProfile,
    submitFeedback,
  }), [session, user, profile, isLoading, isAdmin]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

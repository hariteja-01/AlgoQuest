import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, RefreshCw, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

interface FeedbackItem {
  id: string;
  category: string;
  message: string;
  rating: number;
  page: string;
  created_at: string;
  user_id: string | null;
  user_email: string | null;
  user_name: string | null;
}

const FeedbackInbox: React.FC = () => {
  const { theme } = useApp();
  const { isAdmin, isConfigured } = useAuth();
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFeedback = async () => {
    if (!supabase) return;
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('feedback')
      .select('id, category, message, rating, page, created_at, user_id, user_email, user_name')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setItems((data as FeedbackItem[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin && isConfigured) {
      loadFeedback();
    }
  }, [isAdmin, isConfigured]);

  if (!isConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-lg text-center">
          <h1 className="text-2xl font-bold">Supabase not configured</h1>
          <p className="mt-2 text-slate-500">Add your Supabase keys to enable feedback inbox.</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-lg text-center space-y-3">
          <ShieldAlert className="mx-auto h-10 w-10 text-amber-500" />
          <h1 className="text-2xl font-bold">Admin access required</h1>
          <p className="text-slate-500">Ask the project owner to grant admin access.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen px-4 py-10 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-4 py-1.5 text-xs font-semibold text-fuchsia-300">
              <MessageSquare className="h-4 w-4" /> Feedback Inbox
            </div>
            <h1 className="mt-3 text-3xl font-black">Customer Feedback</h1>
            <p className="mt-2 text-sm text-slate-400">Every submission, tied to the creator for quick follow-up.</p>
          </div>
          <button
            type="button"
            onClick={loadFeedback}
            className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold ${
              theme === 'dark'
                ? 'border-slate-700 bg-slate-800 text-slate-200'
                : 'border-slate-200 bg-white text-slate-700'
            }`}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {loading && (
          <div className="rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-8 text-center text-slate-400">
            Loading feedback...
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-8 text-center text-slate-400">
            No feedback yet.
          </div>
        )}

        <div className="space-y-4">
          {items.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.02 }}
              className={`rounded-2xl border p-4 ${
                theme === 'dark'
                  ? 'border-slate-700/60 bg-slate-900/60'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-fuchsia-500/20 px-3 py-1 text-xs font-semibold text-fuchsia-200">
                    {item.category}
                  </div>
                  <div className="text-xs text-slate-400">{new Date(item.created_at).toLocaleString()}</div>
                </div>
                <div className="text-xs text-yellow-400">Rating: {item.rating}/5</div>
              </div>
              <p className="mt-3 text-sm text-slate-200">{item.message}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <span>Page: {item.page}</span>
                <span>•</span>
                <span>User: {item.user_name ?? item.user_email ?? item.user_id ?? 'Anonymous'}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedbackInbox;

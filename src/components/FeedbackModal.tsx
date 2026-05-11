import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageSquare, Star, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, currentPage }) => {
  const { theme } = useApp();
  const { submitFeedback } = useAuth();
  const [category, setCategory] = useState('Visuals');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (message.trim().length < 8) {
      toast.error('Please add a bit more detail.');
      return;
    }

    setSubmitting(true);
    const result = await submitFeedback({
      category,
      message: message.trim(),
      rating,
      page: currentPage,
    });
    setSubmitting(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success('Feedback received. Thank you!');
    setMessage('');
    setCategory('Visuals');
    setRating(5);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            className={`w-full max-w-lg rounded-3xl border shadow-2xl ${
              theme === 'dark'
                ? 'border-slate-700 bg-slate-900/95 text-slate-100'
                : 'border-slate-200 bg-white text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-200/10 px-6 py-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Share Feedback</h3>
              </div>
              <button type="button" onClick={onClose}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 px-6 py-5">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Category</label>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className={`mt-2 w-full rounded-xl border px-3 py-2 text-sm ${
                    theme === 'dark'
                      ? 'border-slate-700 bg-slate-800 text-slate-100'
                      : 'border-slate-200 bg-white text-slate-900'
                  }`}
                >
                  {['Visuals', 'Inputs', 'Code Generation', 'Performance', 'Navigation', 'Other'].map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Rating</label>
                <div className="mt-2 flex items-center gap-2">
                  {Array.from({ length: 5 }, (_, index) => {
                    const value = index + 1;
                    const isActive = (hoverRating ?? rating) >= value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRating(value)}
                        onMouseEnter={() => setHoverRating(value)}
                        onMouseLeave={() => setHoverRating(null)}
                        className={`rounded-full p-1 transition ${isActive ? 'text-yellow-400' : 'text-slate-400'}`}
                        aria-pressed={rating === value}
                      >
                        <Star className="h-5 w-5" />
                      </button>
                    );
                  })}
                </div>
                <p className="mt-1 text-[11px] text-slate-500">Selected: {rating} / 5</p>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Your feedback</label>
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows={4}
                  className={`mt-2 w-full rounded-xl border px-3 py-2 text-sm ${
                    theme === 'dark'
                      ? 'border-slate-700 bg-slate-800 text-slate-100'
                      : 'border-slate-200 bg-white text-slate-900'
                  }`}
                  placeholder="Tell us what to improve or what you loved..."
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Page: {currentPage}</span>
                <span>We reply within 48 hours.</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white"
              >
                {submitting ? 'Sending...' : 'Send feedback'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackModal;

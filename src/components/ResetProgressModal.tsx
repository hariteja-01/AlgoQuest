import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Eye, EyeOff, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useLearning } from '../context/LearningContext';

interface ResetProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ResetProgressModal: React.FC<ResetProgressModalProps> = ({ isOpen, onClose }) => {
  const { theme } = useApp();
  const { user, verifyPassword } = useAuth();
  const { resetProgress } = useLearning();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleReset = async () => {
    if (!user) {
      toast.error('Sign in to reset your progress.');
      return;
    }
    if (!password) {
      toast.error('Enter your password to confirm.');
      return;
    }

    setSubmitting(true);
    const verify = await verifyPassword(password);
    if (verify.error) {
      setSubmitting(false);
      toast.error(verify.error);
      return;
    }

    const result = await resetProgress();
    setSubmitting(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success('Progress reset successfully.');
    setPassword('');
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
                <AlertTriangle className="h-5 w-5 text-amber-400" />
                <h3 className="text-lg font-semibold">Reset Learning Progress</h3>
              </div>
              <button type="button" onClick={onClose}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 px-6 py-5">
              <div className={`rounded-2xl border px-4 py-3 text-sm ${
                theme === 'dark' ? 'border-amber-500/30 bg-amber-500/10 text-amber-200' : 'border-amber-200 bg-amber-50 text-amber-700'
              }`}>
                This will permanently delete your streak, XP, and algorithm progress from the database.
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Confirm password</label>
                <div className="relative mt-2">
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
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReset}
                disabled={submitting}
                className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-red-500 px-4 py-2 text-sm font-semibold text-white"
              >
                {submitting ? 'Resetting...' : 'Reset everything'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResetProgressModal;

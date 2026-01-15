'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Clock, User } from 'lucide-react';

export default function AISummaryModal({ isOpen, onClose, summary, meta, userRole }) {
  if (!summary) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">AI Summary</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1 text-xs text-white/60">
                      <User className="h-3 w-3" />
                      {userRole === 'junior' ? 'Junior-focused' : 'Senior-focused'}
                    </div>
                    {meta?.generatedAt && (
                      <div className="flex items-center gap-1 text-xs text-white/60">
                        <Clock className="h-3 w-3" />
                        {new Date(meta.generatedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="prose prose-invert max-w-none">
                <div className="space-y-3">
                  {summary.split('\n').map((line, index) => {
                    // Clean up bullet points and ensure proper formatting
                    const cleanLine = line.replace(/^[-•*]\s*/, '').trim();
                    if (!cleanLine) return null;
                    
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="flex gap-3"
                      >
                        <span className="mt-2 size-1.5 flex-shrink-0 rounded-full bg-purple-400/60" />
                        <p className="text-sm text-white/80 leading-relaxed">{cleanLine}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <p className="text-xs text-white/50 text-center">
                  AI-generated summary • {meta?.model || 'GPT-4 Turbo'}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

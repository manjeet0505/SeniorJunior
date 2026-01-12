'use client';

import { useState } from 'react';
import { MessageSquare, X, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Chat from './Chat';

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50" suppressHydrationWarning>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mb-4"
          >
            <div className="w-96 h-[600px] bg-[#1A0B2E] rounded-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col"
                 style={{ touchAction: 'none' }} // Prevent touch scroll on parent
            >
              <Chat onClose={() => setIsOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        suppressHydrationWarning
      >
        {isOpen ? <X size={20} /> : <Bot size={20} />}
      </motion.button>
    </div>
  );
}

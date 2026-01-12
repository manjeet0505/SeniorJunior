'use client';

import { motion } from 'framer-motion';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A0B2E] text-white p-4 pt-24">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/60 via-transparent to-blue-900/40 z-0"></div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white">{title}</h2>
            <p className="text-gray-400 mt-2">{subtitle}</p>
          </div>
          {children}
        </div>
      </motion.div>
    </div>
  );
}

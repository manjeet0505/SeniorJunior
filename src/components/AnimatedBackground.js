'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = ({ 
  children, 
  variant = 'default',
  className = '',
  disabled = false 
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Skip animation if disabled or user prefers reduced motion
  if (disabled || (mounted && typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    return (
      <div className={`fixed inset-0 -z-10 bg-slate-900 ${className}`}>
        <div className="relative z-0">
          {children}
        </div>
      </div>
    );
  }

  // Different background variants
  const getBackgroundClass = () => {
    switch (variant) {
      case 'subtle':
        return 'bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900';
      case 'minimal':
        return 'bg-slate-900';
      case 'gradient':
        return 'bg-gradient-to-br from-indigo-900 via-purple-900/30 to-slate-900';
      case 'orbs':
        return 'bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900';
      default:
        return 'bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900';
    }
  };

  return (
    <div className={`fixed inset-0 -z-10 ${getBackgroundClass()} ${className}`}>
      {/* Animated gradient orbs */}
      {variant === 'orbs' && (
        <>
          {/* Orb 1 */}
          <motion.div
            className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              top: '10%',
              left: '10%',
            }}
          />
          
          {/* Orb 2 */}
          <motion.div
            className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-blue-600/15 to-purple-600/15 blur-2xl"
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              top: '60%',
              right: '15%',
            }}
          />
          
          {/* Orb 3 */}
          <motion.div
            className="absolute w-80 h-80 rounded-full bg-gradient-to-r from-indigo-600/10 to-purple-600/10 blur-2xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              bottom: '20%',
              left: '20%',
            }}
          />
        </>
      )}

      {/* Floating particles for subtle variant */}
      {variant === 'subtle' && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-purple-500/20 rounded-full"
              animate={{
                y: [0, -30, 0],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2
              }}
              style={{
                top: `${20 + i * 15}%`,
                left: `${10 + i * 15}%`,
              }}
            />
          ))}
        </>
      )}

      {/* Overlay gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-0">
        {children}
      </div>
    </div>
  );
};

export default AnimatedBackground;

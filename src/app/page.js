'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Zap, Award } from 'lucide-react';

const specialists = [
  { id: 1, name: 'Ananya Sharma', role: 'Growth Hacker', img: `https://i.pravatar.cc/150?u=1` },
  { id: 2, name: 'David Lee', role: 'SEO Expert', img: `https://i.pravatar.cc/150?u=2` },
  { id: 3, name: 'Maria Garcia', role: 'Creative Director', img: `https://i.pravatar.cc/150?u=3` },
  { id: 4, name: 'Tom Chen', role: 'Content Strategist', img: `https://i.pravatar.cc/150?u=4` },
  { id: 5, name: 'Linda Kim', role: 'PPC Specialist', img: `https://i.pravatar.cc/150?u=5` },
  { id: 6, name: 'John Smith', role: 'Brand Manager', img: `https://i.pravatar.cc/150?u=6` },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1A0B2E] text-white overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/60 via-transparent to-blue-900/40 z-0"></div>
      <main className="relative z-10 flex flex-col items-center justify-center h-screen px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full max-w-6xl mx-auto">
          <div className="text-center lg:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tighter leading-snug"
            >
              Unlock Top <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Marketing Talent</span> You Thought Was Out of Reach —
              <span className="block">Now Just One Click Away!</span>
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="mt-8"
            >
              <Link
                href="/start-project"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full text-lg font-semibold hover:bg-white/20 transition-all duration-300 shadow-[0_0_20px_rgba(192,132,252,0.5)] hover:shadow-[0_0_30px_rgba(192,132,252,0.7)] transform hover:scale-105"
              >
                Start Project <ArrowRight size={22} />
              </Link>
            </motion.div>
          </div>

          <div className="relative w-full h-[500px] flex items-center justify-center">
            <motion.div className="absolute w-full h-full">
              <svg viewBox="0 0 500 500" className="w-full h-full">
                <motion.path
                  d="M 250, 50 a 200,200 0 1,1 0,400 a 200,200 0 1,1 0,-400"
                  fill="none"
                  stroke="url(#gradient)" strokeOpacity="0.15"
                  strokeWidth="1"
                  strokeDasharray="4 8"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
                <defs>
                  <linearGradient id="gradient" gradientTransform="rotate(90)">
                    <stop offset="0%" stopColor="#8A2BE2" />
                    <stop offset="100%" stopColor="#4169E1" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
            {specialists.map((specialist, index) => {
              const angle = (index / specialists.length) * 2 * Math.PI;
              const x = 250 + 200 * Math.cos(angle) - 50; // 50 is half card width
              const y = 250 + 200 * Math.sin(angle) - 60; // 60 is half card height
              return (
                <motion.div
                  key={specialist.id}
                  className="absolute"
                  initial={{ x, y, opacity: 0, scale: 0.5 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: [y, y - 10, y],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.1,
                  }}
                  whileHover={{ scale: 1.15, zIndex: 10, boxShadow: '0 0 40px rgba(138, 43, 226, 0.8)' }}
                >
                  <div className="w-48 p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl text-center">
                    <img src={specialist.img} alt={specialist.name} className="w-20 h-20 rounded-full mx-auto mb-3 border-2 border-purple-400/50 filter grayscale hover:grayscale-0 transition-all duration-300" />
                    <h4 className="font-bold text-white">{specialist.name}</h4>
                    <p className="text-xs text-gray-400">{specialist.role}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Features Section */}
      <motion.section
        id="features"
        className="py-36 px-4"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="container mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12"
          >
            Why Choose SeniorJunior?
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <FeatureCard 
              icon={<Users className="h-10 w-10 text-purple-300" />} 
              title="Expert Mentorship"
              description="Connect with industry veterans and get personalized guidance to level up your skills."
              className="lg:col-span-1"
            />
            <FeatureCard 
              icon={<Zap className="h-10 w-10 text-blue-300" />} 
              title="Accelerated Learning"
              description="Gain real-world experience through collaborative projects and targeted feedback."
              className="lg:col-span-2"
            />
            <FeatureCard 
              icon={<Award className="h-10 w-10 text-pink-300" />} 
              title="Career Opportunities"
              description="Unlock exclusive access to job boards and networking events with top tech companies."
              className="lg:col-span-3"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        id="how-it-works"
        className="py-20 px-4"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="container mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-16"
          >
            Get Started in 3 Easy Steps
          </motion.h2>
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute left-1/2 -translate-x-1/2 w-1 h-full bg-white/10 rounded-full"></div>
            <Step number="1" title="Create Your Profile" description="Sign up and tell us about your skills and goals." />
            <Step number="2" title="Find Your Match" description="Browse our community of mentors and mentees to find the perfect fit." />
            <Step number="3" title="Start Connecting" description="Initiate conversations, schedule sessions, and start learning." />
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-20 px-4"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="relative container mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl opacity-20 blur-3xl"></div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative text-center bg-black/30 backdrop-blur-xl rounded-2xl p-12 border border-white/10 shadow-2xl"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold">Ready to Elevate Your Career?</h2>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">Join thousands of developers who are already benefiting from SeniorJunior.</p>
            <div className="mt-8">
              <Link href="/register" className="inline-block px-10 py-4 bg-white text-space-navy rounded-full shadow-2xl hover:bg-gray-200 transition-colors duration-300 font-bold text-lg transform hover:scale-105">
                Sign Up for Free
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}

// Helper Components
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const FeatureCard = ({ icon, title, description, className }) => (
  <motion.div 
    variants={itemVariants}
    className={`bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-8 text-left ${className}`}
  >
    <div className="mb-4 w-16 h-16 flex items-center justify-center rounded-2xl bg-black/20 shadow-inner-lg">
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </motion.div>
);

const Step = ({ number, title, description }) => (
  <motion.div 
    initial={{ opacity: 0, x: number % 2 === 0 ? 50 : -50 }} 
    whileInView={{ opacity: 1, x: 0 }} 
    transition={{ duration: 0.6, ease: 'easeOut' }}
    viewport={{ once: true }}
    className="relative mb-16 pl-16 md:pl-24"
  >
    <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-8 h-8 rounded-full bg-purple-500 border-4 border-[#1A0B2E] shadow-lg"></div>
    <div className="absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 text-7xl font-extrabold text-white/10 select-none">
      {number}
    </div>
    <div className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10 hover:border-purple-400/50 transition-colors duration-300">
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  </motion.div>
);

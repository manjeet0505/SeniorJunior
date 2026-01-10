"use client";
import React from 'react';

import { reactIcon, nodeIcon, jsIcon, mentorIcon } from "./resourceIcons";
import { reactImg, nodeImg, jsImg, mentorImg, mdnImg, freecodecampImg, cssTricksImg, leetcodeImg } from "./resourceImages";

const resources = [
  { title: 'React Official Docs', url: 'https://react.dev/', description: 'Comprehensive React documentation.', icon: reactIcon, image: reactImg, accent: 'from-cyan-400 to-blue-500' },
  { title: 'Node.js Best Practices', url: 'https://github.com/goldbergyoni/nodebestpractices', description: 'Community-driven Node.js best practices.', icon: nodeIcon, image: nodeImg, accent: 'from-green-400 to-emerald-500' },
  { title: 'JavaScript.info', url: 'https://javascript.info/', description: 'Modern JavaScript tutorials and guides.', icon: jsIcon, image: jsImg, accent: 'from-yellow-300 to-yellow-500' },
  { title: 'Frontend Mentor', url: 'https://www.frontendmentor.io/', description: 'Practice real-world HTML, CSS, and JavaScript challenges.', icon: mentorIcon, image: mentorImg, accent: 'from-indigo-400 to-pink-400' },
  { title: 'MDN Web Docs', url: 'https://developer.mozilla.org/', description: 'The best reference for HTML, CSS, and JavaScript documentation.', image: mdnImg, accent: 'from-blue-400 to-blue-700' },
  { title: 'freeCodeCamp', url: 'https://www.freecodecamp.org/', description: 'Learn to code for free with millions of other people.', image: freecodecampImg, accent: 'from-green-300 to-green-600' },
  { title: 'CSS-Tricks', url: 'https://css-tricks.com/', description: 'Tips, tricks, and guides for CSS and front-end development.', image: cssTricksImg, accent: 'from-pink-300 to-orange-400' },
  { title: 'LeetCode', url: 'https://leetcode.com/', description: 'Practice coding interview problems and improve your skills.', image: leetcodeImg, accent: 'from-yellow-300 to-yellow-600' },
];

const LearningResourcesPage = () => (
  <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-300 animate-gradient-x">
    {/* Semi-transparent background illustration */}
    <img
      src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80"
      alt="Man working on laptop background"
      className="pointer-events-none select-none fixed inset-0 w-full h-full object-cover opacity-60 blur-[2px] z-0"
    />
    {/* Dark overlay for readability */}
    <div className="fixed inset-0 w-full h-full bg-gradient-to-b from-black/60 via-black/40 to-black/60 z-10 pointer-events-none" />
    {/* Animated background blobs */}
    <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
      <div className="absolute left-[-10%] top-[-10%] w-[400px] h-[400px] bg-pink-400 opacity-30 rounded-full blur-3xl animate-blob" />
      <div className="absolute right-[-10%] top-[30%] w-[350px] h-[350px] bg-indigo-400 opacity-30 rounded-full blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute left-[30%] bottom-[-10%] w-[300px] h-[300px] bg-purple-400 opacity-30 rounded-full blur-3xl animate-blob animation-delay-4000" />
    </div>
    <div className="relative z-10 w-full max-w-6xl px-2 md:px-8 py-16">
      <h1 className="text-5xl font-black text-center text-white drop-shadow-xl mb-14 tracking-tight" style={{textShadow: '0 2px 24px #2228'}}>Learning Resources</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {resources.map((res, idx) => (
  <a
    key={idx}
    href={res.url}
    target="_blank"
    rel="noopener noreferrer"
    className={`group flex flex-col md:flex-row items-center gap-4 bg-white bg-opacity-95 rounded-2xl shadow-xl transition transform hover:scale-[1.035] hover:shadow-2xl px-7 py-7 border-l-8 border-transparent hover:border-pink-400 relative overflow-hidden hover:bg-gradient-to-r ${res.accent}`}
    style={{ minHeight: '120px' }}
  >
    <span className="flex-shrink-0 mb-3 md:mb-0 md:mr-4">
      {res.image ? (
        <img
          src={res.image}
          alt={res.title + ' logo'}
          className="w-16 h-16 rounded-xl shadow border-2 border-gray-200 object-contain bg-white"
          style={{ background: '#fff', maxWidth: 64, maxHeight: 64 }}
        />
      ) : (
        res.icon
      )}
    </span>
    <div className="flex-1 text-center md:text-left">
      <h2 className="text-xl font-extrabold text-gray-900 mb-1 group-hover:text-pink-600 transition-all">{res.title}</h2>
      <p className="text-gray-700 text-base font-medium opacity-90">{res.description}</p>
    </div>
    <span className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-200 text-pink-500 text-3xl font-bold flex items-center">
      <svg width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 6l8 8-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </span>
  </a>
))}
      </div>
    </div>
    {/* Tailwind keyframes for gradient and blob animation */}
    <style jsx>{`
      .animate-gradient-x {
        background-size: 200% 200%;
        animation: gradient-x 8s ease-in-out infinite;
      }
      @keyframes gradient-x {
        0%, 100% { background-position: left top; }
        50% { background-position: right bottom; }
      }
      .animate-blob {
        animation: blob 16s infinite ease-in-out;
      }
      .animation-delay-2000 {
        animation-delay: 2s;
      }
      .animation-delay-4000 {
        animation-delay: 4s;
      }
      @keyframes blob {
        0%, 100% { transform: translateY(0px) scale(1); }
        33% { transform: translateY(-30px) scale(1.1); }
        66% { transform: translateY(20px) scale(0.95); }
      }
    `}</style>
  </div>
);

export default LearningResourcesPage;

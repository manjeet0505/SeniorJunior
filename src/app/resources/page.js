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
  <div className="min-h-screen bg-[#1A0B2E] text-white pt-24">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Learning Resources</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">Explore these curated resources to enhance your skills.</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((res, idx) => (
          <a
            key={idx}
            href={res.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center gap-4 mb-4">
              {res.image ? (
                <img
                  src={res.image}
                  alt={res.title + ' logo'}
                  className="w-16 h-16 rounded-xl object-contain bg-white"
                />
              ) : (
                res.icon
              )}
              <h2 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">{res.title}</h2>
            </div>
            <p className="text-gray-400 mb-4">{res.description}</p>
            <div className="flex items-center text-purple-400 font-semibold">
              <span>Explore</span>
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>
        ))}
      </div>
    </div>
  </div>
);

export default LearningResourcesPage;

'use client';

import React, { useState } from 'react';

const questions = [
  {
    question: 'What is a closure in JavaScript?',
    options: [
      'A function having access to the parent scope',
      'A way to close a browser tab',
      'A CSS property',
      'A React lifecycle method'
    ],
    answer: 0
  },
  {
    question: 'Which command initializes a new Node.js project?',
    options: [
      'npm start',
      'npm install',
      'npm init',
      'node app.js'
    ],
    answer: 2
  },
  {
    question: 'Which HTML tag is used for inserting a line break?',
    options: [
      '<break>',
      '<br>',
      '<lb>',
      '<hr>'
    ],
    answer: 1
  }
];

const SkillAssessmentPage = () => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleNext = () => {
    if (selected === questions[current].answer) setScore(score + 1);
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A0B2E] text-white pt-24 flex items-center justify-center">
      <div className="max-w-xl w-full px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-12 text-center">Skill Assessment</h1>
        <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
          {!finished ? (
            <div>
              <p className="mb-6 font-semibold text-lg">{questions[current].question}</p>
              <div className="space-y-3 mb-8">
                {questions[current].options.map((opt, idx) => (
                  <button
                    key={idx}
                    className={`block w-full text-left px-4 py-3 rounded-xl border transition-all ${
                      selected === idx 
                        ? 'bg-purple-600 border-purple-600 text-white' 
                        : 'border-white/20 hover:border-purple-500/50 text-white'
                    }`}
                    onClick={() => setSelected(idx)}
                    disabled={selected !== null}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <button
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full py-3 font-semibold hover:scale-105 transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleNext}
                disabled={selected === null}
              >
                {current + 1 < questions.length ? 'Next' : 'Finish'}
              </button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-2xl font-bold mb-4">Assessment Complete!</p>
              <p className="text-lg text-gray-300">Your Score: <span className="font-bold text-purple-400">{score} / {questions.length}</span></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillAssessmentPage;

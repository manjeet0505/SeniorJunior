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
    <div className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Skill Assessment</h1>
      <div className="bg-white rounded-lg shadow p-6">
        {!finished ? (
          <div>
            <p className="mb-4 font-semibold">{questions[current].question}</p>
            <div className="space-y-2 mb-6">
              {questions[current].options.map((opt, idx) => (
                <button
                  key={idx}
                  className={`block w-full text-left px-4 py-2 rounded border ${selected === idx ? 'bg-blue-100 border-blue-500' : 'border-gray-300'} hover:bg-blue-50`}
                  onClick={() => setSelected(idx)}
                  disabled={selected !== null}
                >
                  {opt}
                </button>
              ))}
            </div>
            <button
              className="w-full bg-blue-500 text-white rounded py-2 hover:bg-blue-600"
              onClick={handleNext}
              disabled={selected === null}
            >
              {current + 1 < questions.length ? 'Next' : 'Finish'}
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-xl font-semibold mb-4">Assessment Complete!</p>
            <p className="text-lg">Your Score: <span className="font-bold">{score} / {questions.length}</span></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillAssessmentPage;

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FAQPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  
  useEffect(() => {
    setIsClient(true);
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const toggleFAQ = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  const faqItems = [
    {
      question: "What is SeniorJunior Connect?",
      answer: "SeniorJunior Connect is a platform designed to bridge the gap between experienced developers and those just starting their journey. We facilitate mentorship connections, provide structured learning paths, and foster a supportive community for developers at all stages of their journey."
    },
    {
      question: "How does the mentorship matching work?",
      answer: "Our platform uses a sophisticated matching algorithm that considers skills, experience levels, learning goals, and communication preferences to connect junior developers with senior mentors. Both parties can review potential matches and decide if they want to establish a connection."
    },
    {
      question: "Is SeniorJunior Connect free to use?",
      answer: "We offer a free basic tier that allows users to create profiles, browse potential connections, and participate in community discussions. Premium features, such as advanced matching, unlimited connections, and specialized learning resources, are available through our subscription plans."
    },
    {
      question: "I'm a senior developer. Why should I become a mentor?",
      answer: "Mentoring offers numerous benefits: it helps you solidify your own knowledge, develop leadership and communication skills, expand your professional network, and give back to the developer community. Many mentors report that teaching others has significantly improved their own understanding and career prospects."
    },
    {
      question: "How much time commitment is expected from mentors?",
      answer: "The time commitment is flexible and determined by both parties. Some mentorship relationships involve weekly hour-long sessions, while others might be more casual with occasional check-ins. We encourage clear communication about availability and expectations when establishing a connection."
    },
    {
      question: "What technologies and programming languages do you support?",
      answer: "We support a wide range of technologies and programming languages, including but not limited to JavaScript, Python, Java, Ruby, C#, PHP, Go, Swift, React, Angular, Vue, Node.js, Django, Rails, and many more. Our platform is designed to accommodate developers across various specializations."
    },
    {
      question: "How do I report inappropriate behavior?",
      answer: "We take community safety seriously. You can report inappropriate behavior through the 'Report' button available in chats and user profiles, or by contacting our support team directly. All reports are handled confidentially and investigated promptly."
    },
    {
      question: "Can I switch between being a mentor and a mentee?",
      answer: "Absolutely! Many developers on our platform serve as both mentors and mentees in different areas. You might mentor someone in a technology you're proficient in while seeking guidance in areas where you're still developing skills."
    },
    {
      question: "Are there resources for specific career stages?",
      answer: "Yes, we offer tailored resources for different career stages, from beginners learning their first programming language to senior developers transitioning into leadership roles. Our learning paths, articles, and community discussions are organized to help you find relevant content for your current needs."
    },
    {
      question: "How can I provide feedback about the platform?",
      answer: "We value user feedback and continuously improve based on it. You can provide feedback through the feedback form in your account settings, by participating in our regular user surveys, or by contacting our support team directly."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Navbar */}
      <div className="w-full px-4 pt-8 pb-6">
        <nav className="bg-white/90 shadow-lg rounded-full px-4 sm:px-8 py-4 max-w-5xl mx-auto flex items-center justify-between z-10 border border-gray-100 relative">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
              SeniorJunior
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            {isClient && isLoggedIn ? (
              <Link href="/dashboard" className="text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg">
                Dashboard
              </Link>
            ) : (
              <Link href="/login" className="text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg">
                Sign In
              </Link>
            )}
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Frequently Asked</span>
            <span className="block text-indigo-600">Questions</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Find answers to common questions about SeniorJunior Connect.
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden divide-y divide-gray-200">
          {faqItems.map((item, index) => (
            <div key={index} className="px-4 py-5 sm:px-6">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center text-left focus:outline-none"
              >
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {item.question}
                </h3>
                <span className="ml-6 flex-shrink-0">
                  {activeIndex === index ? (
                    <svg className="h-6 w-6 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </span>
              </button>
              {activeIndex === index && (
                <div className="mt-4 text-base text-gray-500 transition-all duration-300 ease-in-out">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-base text-gray-500">
            Still have questions?
          </p>
          <a 
            href="mailto:mishramanjeet26@gmail.com" 
            className="mt-3 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Contact Us
            <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:order-2 space-x-6">
              <a href="https://www.linkedin.com/in/manjeet-mishra-175705260/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="https://github.com/manjeet0505" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://x.com/mishramanjeet26" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
            <div className="mt-8 md:mt-0 md:order-1">
              <p className="text-center text-base text-gray-400">
                &copy; {new Date().getFullYear()} SeniorJunior Connect. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

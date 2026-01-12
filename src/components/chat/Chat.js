'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Add custom scrollbar hide styles
const scrollbarHideStyles = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

if (typeof window !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = scrollbarHideStyles;
  document.head.appendChild(styleSheet);
}

const suggestedPrompts = [
  "How do I find a mentor?",
  "What skills should I learn?",
  "How does the platform work?"
];

export default function Chat({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [typingMessage, setTypingMessage] = useState('');
  const [isTypingAnimation, setIsTypingAnimation] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input, id: Date.now().toString() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setShowSuggestions(false);
    setIsTyping(true);
    setIsTypingAnimation(true);
    setTypingMessage('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      const aiMessage = { role: 'assistant', content: data.text, id: (Date.now() + 1).toString() };
      
      // Start typing animation
      await simulateTyping(data.text, (partialText) => {
        setTypingMessage(partialText);
      });
      
      // Add complete message and stop typing
      setMessages(prev => [...prev, aiMessage]);
      setTypingMessage('');
      setIsTypingAnimation(false);

    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage = { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.', id: (Date.now() + 1).toString() };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Simulate typing effect
  const simulateTyping = async (text, onUpdate) => {
    let currentText = '';
    const words = text.split(' ');
    
    for (let i = 0; i < words.length; i++) {
      currentText += (i > 0 ? ' ' : '') + words[i];
      onUpdate(currentText);
      await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 50)); // 30-80ms per word
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    setShowSuggestions(false);
  };

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  
  const scrollToBottom = () => {
    // Clear any existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    // Set new timeout to scroll after DOM update
    scrollTimeoutRef.current = setTimeout(() => {
      if (messagesContainerRef.current) {
        const scrollElement = messagesContainerRef.current;
        // Force scroll to bottom
        scrollElement.scrollTop = scrollElement.scrollHeight;
        
        // Double-check scroll worked
        setTimeout(() => {
          if (scrollElement.scrollTop < scrollElement.scrollHeight - scrollElement.clientHeight) {
            scrollElement.scrollTop = scrollElement.scrollHeight;
          }
        }, 10);
      }
    }, 50); // Reduced delay for faster response
  };

  useEffect(() => {
    scrollToBottom();
    
    // Cleanup timeout on unmount
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [messages, isTyping, typingMessage]);

  return (
    <div className="flex flex-col h-full w-full bg-[#1A0B2E]">
      {/* Chat Header */}
      <div className="bg-black/30 backdrop-blur-lg border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <Bot size={18} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">AI Assistant</h3>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Here to help you grow 🚀
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
        style={{ 
          minHeight: '0px', // Important for flex container with overflow
          maxHeight: '400px', // Ensure it has a max height for scrolling
          border: '1px solid rgba(255,255,255,0.1)', // Debug border
          overscrollBehavior: 'contain', // Prevent parent scrolling
          touchAction: 'pan-y' // Enable vertical scrolling only
        }}
        onWheel={(e) => {
          // Prevent event bubbling to parent
          e.stopPropagation();
        }}
        onTouchMove={(e) => {
          // Prevent touch scroll bubbling
          e.stopPropagation();
        }}
      >
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles size={24} className="text-purple-400" />
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 max-w-sm mx-auto">
              <p className="text-gray-300">
                Hi 👋 I'm your Senior-Junior assistant. Ask me about mentors, careers, or learning paths.
              </p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start gap-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === 'user' 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 ml-2' 
                  : 'bg-white/10 mr-2'
              }`}>
                {message.role === 'user' ? (
                  <User size={16} className="text-white" />
                ) : (
                  <Bot size={16} className="text-purple-400" />
                )}
              </div>
              <div className={`px-4 py-3 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'bg-white/10 backdrop-blur-lg text-gray-100 border border-white/20'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Typing Animation Message */}
        <AnimatePresence>
          {isTypingAnimation && typingMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex justify-start"
            >
              <div className="flex items-start gap-2 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-2">
                  <Bot size={16} className="text-purple-400" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20">
                  <p className="text-sm whitespace-pre-wrap">
                    {typingMessage}
                    <span className="inline-block w-2 h-4 bg-purple-400 animate-pulse ml-1"></span>
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesContainerRef} />
      </div>

      {/* Suggested Prompts */}
      {showSuggestions && messages.length === 0 && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleSuggestionClick(prompt)}
                className="px-3 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full text-xs text-gray-300 hover:bg-white/20 transition-colors"
              >
                {prompt}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-white/10 p-4 bg-black/30 backdrop-blur-lg">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              value={input}
              placeholder="Ask me anything..."
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping || isTypingAnimation}
            />
          </div>
          <motion.button
            type="submit"
            className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: input.trim() && !isTyping && !isTypingAnimation ? 1.05 : 1 }}
            whileTap={{ scale: input.trim() && !isTyping && !isTypingAnimation ? 0.95 : 1 }}
            disabled={!input.trim() || isTyping || isTypingAnimation}
          >
            <Send size={16} />
          </motion.button>
        </form>
      </div>
    </div>
  );
}

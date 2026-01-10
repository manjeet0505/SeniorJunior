'use client';

import { useState, useEffect, useRef } from 'react';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input, id: Date.now().toString() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

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
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage = { role: 'assistant', content: 'Sorry, I encountered an error.', id: (Date.now() + 1).toString() };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  return (
    <div className="flex flex-col h-full w-full max-w-3xl mx-auto bg-white rounded-lg">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length > 0 ? (
          messages.map(m => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-lg px-4 py-2 rounded-2xl whitespace-pre-wrap ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                <strong>{`${m.role === 'user' ? 'You' : 'AI'}: `}</strong>
                {m.content}
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-start">
            <div className="max-w-lg px-4 py-2 rounded-2xl whitespace-pre-wrap bg-gray-200 text-gray-800">
              <strong>AI: </strong>
              Hello! I'm the Senior-Junior Connect assistant. How can I help you today?
            </div>
          </div>
        )}

        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-lg px-4 py-2 rounded-2xl bg-gray-200 text-gray-500">
              Typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4 bg-gray-50">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            className="flex-grow w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={input}
            placeholder="Say something..."
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
          />
          <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            disabled={!input.trim() || isTyping}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

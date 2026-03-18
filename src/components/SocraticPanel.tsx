"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useGameStore, ChatMessage } from '../store/useGameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, HelpCircle, Send, Sparkles, User, BrainCircuit } from 'lucide-react';

export default function SocraticPanel() {
  const { socraticStep, chatHistory, askAide } = useGameStore();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSend = () => {
    if (!input.trim()) return;
    askAide(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full panel-card rounded-2xl overflow-hidden shadow-2xl transition-all duration-300">
      {/* Current Step Banner */}
      <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-900/20 shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={14} className="text-blue-500" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Current Reasoning</span>
        </div>
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 leading-snug">
          {socraticStep.doing}
        </p>
      </div>

      {/* Chat History */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar"
      >
        <AnimatePresence initial={false}>
          {chatHistory.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className={`flex items-center gap-2 mb-1.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  msg.role === 'user' ? 'bg-zinc-200 dark:bg-zinc-800' : 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                }`}>
                  {msg.role === 'user' ? <User size={12} /> : <BrainCircuit size={12} />}
                </div>
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase">
                  {msg.role === 'user' ? 'You' : 'Aide'}
                </span>
              </div>
              
              <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm transition-all ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-500/20 font-medium' 
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none shadow-sm'
              }`}>
                {msg.content}
              </div>
              <span className="text-[9px] text-zinc-400 dark:text-zinc-500 mt-1 px-1">
                {msg.timestamp}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20">
        <div className="relative group">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                }
            }}
            placeholder="Ask a question about the current step..."
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-4 pr-12 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none h-20 shadow-inner dark:shadow-none"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="absolute right-3 bottom-3 p-1.5 rounded-lg bg-blue-600 text-white disabled:opacity-30 disabled:hover:bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
        <div className="mt-2 flex items-center gap-3">
            <button 
                onClick={() => askAide("Give me a hint!")}
                className="text-[10px] font-bold text-zinc-500 hover:text-blue-600 transition-colors flex items-center gap-1"
            >
                <HelpCircle size={10} /> Get Hint
            </button>
            <button 
                onClick={() => askAide("Why are we doing this?")}
                className="text-[10px] font-bold text-zinc-500 hover:text-blue-600 transition-colors flex items-center gap-1"
            >
                <Info size={10} /> Why this step?
            </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function Visualizer() {
  const { visualization, currentProblem } = useGameStore();
  const { array, pointers, highlightedIndices } = visualization;
  
  const isLinkedList = currentProblem?.id === 'reverse-linked-list';

  return (
    <div className="flex-1 min-h-[400px] bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 p-8 flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-200">
      <div className={`flex ${isLinkedList ? 'gap-12' : 'gap-4'} items-end`}>
        <AnimatePresence>
          {array.map((value, index) => {
            const isHighlighted = highlightedIndices.includes(index);
            const activePointers = Object.entries(pointers).filter(([_, val]) => {
                // Handle both index pointers (numbers) and node pointers (objects with value)
                if (typeof val === 'number') return val === index;
                if (val && typeof val === 'object' && 'val' in val) return val.val === value; // Simple heuristic
                return false;
            });

            return (
              <div key={`${index}-${value}`} className="relative flex items-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ 
                      opacity: 1, 
                      scale: 1, 
                      y: 0,
                      backgroundColor: isHighlighted ? '#3b82f6' : '#ffffff' 
                  }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`w-16 h-16 rounded-full shadow-sm border ${
                    isHighlighted 
                      ? 'border-blue-500 text-white shadow-blue-500/20' 
                      : 'border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 dark:bg-zinc-900'
                  } flex items-center justify-center text-xl font-bold relative z-10`}
                >
                  {value}
                  
                  {/* Visual indicator for index (only for arrays) */}
                  {!isLinkedList && (
                    <div className="absolute -bottom-6 text-xs font-mono text-zinc-400">
                      {index}
                    </div>
                  )}

                  {/* Animated Pointers */}
                  {activePointers.map(([name, _], pIdx) => (
                    <motion.div
                      key={name}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 40 + (pIdx * 20), opacity: 1 }}
                      className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center"
                    >
                      <div className="h-4 w-px bg-zinc-400 mb-1" />
                      <span className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase">
                        {name}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Arrow for Linked List */}
                {isLinkedList && index < array.length - 1 && (
                    <motion.div 
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        className="absolute left-16 w-12 h-0.5 bg-zinc-300 dark:bg-zinc-700 origin-left"
                    >
                        <div className="absolute right-0 -top-1 border-t-4 border-b-4 border-l-8 border-t-transparent border-b-transparent border-l-zinc-300 dark:border-l-zinc-700" />
                    </motion.div>
                )}
              </div>
            );
          })}
        </AnimatePresence>
      </div>

      {array.length === 0 && (
        <div className="text-zinc-400 italic">
          No data structure initialized. Select a problem to begin.
        </div>
      )}

      {/* Background Grid Pattern for style */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(#000 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />
    </div>
  );
}

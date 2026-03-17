"use client";

import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function Visualizer() {
  const { visualization } = useGameStore();
  const { array, pointers, highlightedIndices } = visualization;

  return (
    <div className="flex-1 min-h-[400px] bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 p-8 flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-200">
      <div className="flex gap-4 items-end">
        <AnimatePresence>
          {array.map((value, index) => {
            const isHighlighted = highlightedIndices.includes(index);
            const activePointers = Object.entries(pointers).filter(([_, pos]) => pos === index);

            return (
              <motion.div
                key={`${index}-${value}`}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    y: 0,
                    backgroundColor: isHighlighted ? '#3b82f6' : '#ffffff' 
                }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`w-16 h-16 rounded-lg shadow-sm border ${
                  isHighlighted 
                    ? 'border-blue-500 text-white' 
                    : 'border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 dark:bg-zinc-900'
                } flex items-center justify-center text-xl font-bold relative`}
              >
                {value}
                
                {/* Visual indicator for index */}
                <div className="absolute -bottom-6 text-xs font-mono text-zinc-400">
                  {index}
                </div>

                {/* Animated Pointers (e.g., i, j) */}
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

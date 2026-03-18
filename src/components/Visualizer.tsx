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
          {isLinkedList && (
            <div className="relative flex items-center">
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-16 h-16 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-800 flex items-center justify-center text-xs font-mono font-bold text-zinc-400 dark:text-zinc-600 relative"
              >
                NULL
                {/* Pointers to NULL */}
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
                  {Object.entries(pointers).filter(([_, val]) => val === null).map(([name]) => (
                    <motion.div
                      key={name}
                      layout
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="flex flex-col items-center"
                    >
                      <div className="w-0.5 h-3 bg-zinc-300 dark:bg-zinc-700 mb-0.5" />
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 shadow-sm">
                        {name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              {array.length > 0 && (
                <div className="absolute left-16 w-12 h-0.5 bg-zinc-200 dark:bg-zinc-800 origin-left border-t border-dashed border-zinc-300 dark:border-zinc-700" />
              )}
            </div>
          )}

          {array.map((value, index) => {
            const isHighlighted = highlightedIndices.includes(index);
            const activePointers = Object.entries(pointers).filter(([_, val]) => {
                if (typeof val === 'number') return val === index;
                // For linked lists, we assume the object has a 'val' property matching the array value
                // and potentially an 'index' property if we want to be precise.
                if (val && typeof val === 'object' && 'val' in val) {
                    // If the node has an index property, use it. Otherwise fallback to value comparison.
                    if ('index' in val) return val.index === index;
                    return val.val === value;
                }
                return false;
            });

            return (
              <div key={`${index}-${value}`} className="relative flex items-center">
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ 
                      opacity: 1, 
                      scale: 1, 
                      y: 0,
                      backgroundColor: isHighlighted ? '#3b82f6' : 'transparent' 
                  }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30, mass: 1 }}
                  className={`w-16 h-16 rounded-full shadow-sm border transition-colors ${
                    isHighlighted 
                      ? 'border-blue-500 text-white shadow-blue-500/20 bg-blue-500' 
                      : 'border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-900'
                  } flex items-center justify-center text-xl font-bold relative z-10`}
                >
                  {value}
                  
                  {!isLinkedList && (
                    <div className="absolute -bottom-6 text-xs font-mono text-zinc-400">
                      {index}
                    </div>
                  )}

                  {/* Animated Pointers */}
                  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
                    <AnimatePresence>
                        {activePointers.map(([name, _], pIdx) => (
                            <motion.div
                                key={name}
                                layout
                                initial={{ y: -10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 10, opacity: 0 }}
                                className="flex flex-col items-center"
                            >
                                <div className="w-0.5 h-3 bg-blue-400/50 mb-0.5" />
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${
                                    name === 'curr' || name === 'i' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' :
                                    name === 'prev' || name === 'j' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' :
                                    'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                                } shadow-sm`}>
                                    {name}
                                </span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                  </div>
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

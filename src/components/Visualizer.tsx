"use client";

import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function Visualizer() {
  const { visualization, currentProblem } = useGameStore();
  const { array, pointers, highlightedIndices, tree, highlightedNodes } = visualization;
  
  const isLinkedList = currentProblem?.id === 'reverse-linked-list';
  const isTree = currentProblem?.id === 'binary-tree-inorder';

  const renderLines = (n: any, currX: number, currY: number, l: number) => {
    if (!n) return null;
    const hSpace = 200 / Math.pow(1.5, l);
    const vSpace = 80;
    return (
        <React.Fragment key={`lines-${n.id}`}>
            {n.left && (
                <>
                <motion.line
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    x1={currX} y1={currY} x2={currX - hSpace} y2={currY + vSpace}
                    stroke="currentColor" strokeWidth="2" className="text-zinc-200 dark:text-zinc-800"
                />
                {renderLines(n.left, currX - hSpace, currY + vSpace, l + 1)}
                </>
            )}
            {n.right && (
                <>
                <motion.line
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    x1={currX} y1={currY} x2={currX + hSpace} y2={currY + vSpace}
                    stroke="currentColor" strokeWidth="2" className="text-zinc-200 dark:text-zinc-800"
                />
                {renderLines(n.right, currX + hSpace, currY + vSpace, l + 1)}
                </>
            )}
        </React.Fragment>
    );
  };

  const renderNodes = (n: any, currX: number, currY: number, l: number) => {
    if (!n) return null;
    const hSpace = 200 / Math.pow(1.5, l);
    const vSpace = 80;
    const isHtd = highlightedNodes.includes(n.id);
    return (
        <React.Fragment key={`node-${n.id}`}>
            <motion.div
                layout
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                    scale: 1, opacity: 1,
                    backgroundColor: isHtd ? '#3b82f6' : 'transparent',
                    borderColor: isHtd ? '#3b82f6' : 'currentColor'
                }}
                style={{ left: currX - 24, top: currY - 24, position: 'absolute' }}
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold z-10 transition-colors ${
                    isHtd ? 'text-white shadow-lg shadow-blue-500/50' : 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-800'
                }`}
            >
                {n.val}
            </motion.div>
            {renderNodes(n.left, currX - hSpace, currY + vSpace, l + 1)}
            {renderNodes(n.right, currX + hSpace, currY + vSpace, l + 1)}
        </React.Fragment>
    );
  };

  return (
    <div className="flex-1 min-h-[400px] panel-card rounded-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-500">
      {isTree && tree ? (
        <div className="relative w-full h-full flex items-center justify-center p-10">
            <div className="relative w-full h-[400px]">
                {/* Positioning root at top center */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
                    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                        {renderLines(tree, 0, 0, 0)}
                    </svg>
                    <div className="absolute inset-0">
                        {renderNodes(tree, 0, 0, 0)}
                    </div>
                </div>
            </div>
        </div>
      ) : (
        <div className={`flex ${isLinkedList ? 'gap-12' : 'gap-4'} items-end`}>
            {/* ... rest of the original array/linked list logic ... */}
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
      )}

      {!isTree && array.length === 0 && (
        <div className="text-zinc-400 italic z-20">
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

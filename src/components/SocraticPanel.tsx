"use client";

import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, HelpCircle } from 'lucide-react';

export default function SocraticPanel() {
  const { socraticStep, stepHistory } = useGameStore();
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [stepHistory]);

  return (
    <div className="flex flex-col gap-4 p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm h-full overflow-hidden">
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        {/* History Timeline */}
        <div className="flex-1 flex flex-col gap-2 overflow-hidden">
          <div className="text-zinc-400 dark:text-zinc-500 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
             Timeline
          </div>
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2"
          >
            {stepHistory.slice(0, -1).map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 0.5, x: 0 }}
                className="relative pl-4 border-l border-zinc-200 dark:border-zinc-800 py-1"
              >
                <div className="absolute -left-[5px] top-3 w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 line-clamp-2">{step.doing}</p>
              </motion.div>
            ))}

            {/* Current Active Step in Timeline */}
            <motion.div 
              layout
              className="relative pl-4 border-l-2 border-blue-500 py-2 bg-blue-50/30 dark:bg-blue-900/10 rounded-r-lg"
            >
              <div className="absolute -left-[6px] top-4 w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-[10px] uppercase tracking-wider">
                    <Info size={12} /> Current Action
                  </div>
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-relaxed">
                    {socraticStep.doing}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-[10px] uppercase tracking-wider">
                    <HelpCircle size={12} /> Next Logical Move
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed italic border-l-2 border-amber-200 dark:border-amber-800 pl-3 py-1">
                    {socraticStep.next}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <p className="text-[10px] text-zinc-400 dark:text-zinc-500 leading-tight">
          Socratic Aide tracks your logical steps and provides hints based on your code's execution state.
        </p>
      </div>
    </div>
  );
}

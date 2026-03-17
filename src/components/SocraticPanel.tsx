"use client";

import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, HelpCircle } from 'lucide-react';

export default function SocraticPanel() {
  const { socraticStep } = useGameStore();

  return (
    <div className="flex flex-col gap-4 p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm h-full">
      <div className="space-y-6">
        {/* Current Action */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm tracking-wide uppercase">
            <Info size={16} />
            <span>What I am doing</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={socraticStep.doing}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-lg font-medium text-zinc-900 dark:text-zinc-100 leading-relaxed"
            >
              {socraticStep.doing}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="h-px bg-zinc-100 dark:bg-zinc-800" />

        {/* Next Step */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-sm tracking-wide uppercase">
            <HelpCircle size={16} />
            <span>What should I do next?</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={socraticStep.next}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-lg text-zinc-800 dark:text-zinc-200 leading-relaxed italic"
            >
              {socraticStep.next}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      <div className="mt-auto">
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          The Socratic Aide updates based on your current logical progress.
        </p>
      </div>
    </div>
  );
}

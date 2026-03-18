"use client";

import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { BookOpen, Hash, MoveRight } from 'lucide-react';

export default function ProblemPanel() {
  const { currentProblem } = useGameStore();

  if (!currentProblem) {
    return (
      <div className="flex flex-col gap-4 p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm h-full items-center justify-center text-zinc-400 italic">
        Select a problem to view details.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-8 panel-card rounded-2xl shadow-xl h-full overflow-y-auto custom-scrollbar transition-all duration-300">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <BookOpen className="text-blue-500" size={24} />
            {currentProblem.title}
          </h2>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
            currentProblem.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
            currentProblem.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
            'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
          }`}>
            {currentProblem.difficulty}
          </span>
        </div>

        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
            {currentProblem.description}
          </p>
        </div>

        <div className="space-y-4 pt-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 flex items-center gap-2">
            <Hash size={14} /> Constraints
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 text-sm">
              <MoveRight size={12} className="text-blue-400" />
              Time Complexity: O(n)
            </li>
            <li className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 text-sm">
              <MoveRight size={12} className="text-blue-400" />
              Space Complexity: O(n)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

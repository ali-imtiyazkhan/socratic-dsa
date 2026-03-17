"use client";

import React from 'react';
import Editor from '@monaco-editor/react';
import { useGameStore } from '../store/useGameStore';
import { Play } from 'lucide-react';

export default function CodeEditor() {
  const { currentProblem, runSimulation, isSimulating } = useGameStore();

  if (!currentProblem) {
    return (
      <div className="flex flex-col gap-4 p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm h-full items-center justify-center text-zinc-400 italic font-mono">
        // Start a problem to begin coding.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-800/50 border-b border-zinc-800">
        <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400/80" />
            <div className="w-3 h-3 rounded-full bg-amber-400/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
        </div>
        <button 
          onClick={() => runSimulation()}
          disabled={isSimulating}
          className={`flex items-center gap-2 px-4 py-1.5 ${isSimulating ? 'bg-zinc-700' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-md text-sm font-semibold transition-colors shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <Play size={14} fill="currentColor" />
          {isSimulating ? 'Running...' : 'Run'}
        </button>
      </div>
      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          defaultValue={currentProblem.initialCode}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          }}
        />
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';
import { Terminal as TerminalIcon, ChevronRight } from 'lucide-react';

export default function Terminal() {
  const { logs } = useGameStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="flex flex-col h-full bg-zinc-950 rounded-xl border border-zinc-800 shadow-2xl overflow-hidden font-mono text-sm transition-all duration-300">
      <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border-b border-zinc-800 text-zinc-400">
        <TerminalIcon size={14} />
        <span className="text-xs font-bold uppercase tracking-widest">Output Console</span>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-1"
      >
        {logs.length === 0 ? (
          <div className="text-zinc-600 italic">No output yet...</div>
        ) : (
          logs.map((log, i) => (
            <div key={i} className="flex gap-2 text-zinc-300 group">
              <ChevronRight size={14} className="mt-1 text-zinc-600 group-hover:text-blue-500 transition-colors" />
              <span className="break-all whitespace-pre-wrap">{log}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

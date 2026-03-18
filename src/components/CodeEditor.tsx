"use client";

import React from 'react';
import Editor from '@monaco-editor/react';
import { useGameStore } from '../store/useGameStore';
import { Play } from 'lucide-react';

export default function CodeEditor() {
  const { currentProblem, runSimulation, isSimulating, activeLine } = useGameStore();
  const editorRef = React.useRef<any>(null);
  const decorationsRef = React.useRef<string[]>([]);

  function handleEditorDidMount(editor: any) {
    editorRef.current = editor;
  }

  React.useEffect(() => {
    if (editorRef.current && activeLine !== null) {
      decorationsRef.current = editorRef.current.deltaDecorations(
        decorationsRef.current,
        [
          {
            range: { startLineNumber: activeLine, startColumn: 1, endLineNumber: activeLine, endColumn: 1 },
            options: {
              isWholeLine: true,
              className: 'active-line-highlight',
              glyphMarginClassName: 'active-line-glyph',
            },
          },
        ]
      );
      
      // Scroll to the active line if it's not visible
      editorRef.current.revealLineInCenterIfOutsideViewport(activeLine);
    } else if (editorRef.current && activeLine === null) {
      decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, []);
    }
  }, [activeLine]);

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
          onClick={() => {
            const code = editorRef.current?.getValue();
            runSimulation(code);
          }}
          disabled={isSimulating}
          className={`flex items-center gap-2 px-4 py-1.5 ${isSimulating ? 'bg-zinc-700' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-md text-sm font-semibold transition-colors shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <Play size={14} fill="currentColor" />
          {isSimulating ? 'Running...' : 'Run'}
        </button>
      </div>
      <div className="flex-1">
        <Editor
          key={currentProblem.id}
          height="100%"
          defaultLanguage="javascript"
          defaultValue={currentProblem.initialCode}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            glyphMargin: true,
          }}
        />
        <style jsx global>{`
          .active-line-highlight {
            background-color: rgba(59, 130, 246, 0.15) !important;
            border-left: 3px solid #3b82f6 !important;
          }
          .active-line-glyph {
            background-color: #3b82f6;
            margin-left: 5px;
            width: 4px !important;
            border-radius: 2px;
          }
        `}</style>
      </div>
    </div>
  );
}

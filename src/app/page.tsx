"use client";

import React, { useEffect } from 'react';
import { useGameStore, Problem } from '../store/useGameStore';
import ProblemPanel from '../components/ProblemPanel';
import CodeEditor from '../components/CodeEditor';
import Visualizer from '../components/Visualizer';
import SocraticPanel from '../components/SocraticPanel';
import Terminal from '../components/Terminal';
import { Layout, BrainCircuit, Terminal as TerminalIcon, Eye, Book } from 'lucide-react';

const problems: Problem[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    initialCode: `// nums and target are provided!
for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
        // Update Socratic Aide and Pointers!
        step(\`Checking if \${nums[i]} + \${nums[j]} = \${target}\`, 
             "We are comparing the current sum with the target.",
             { i, j }, 5); // Line 5: step call
        
        console.log(\`Searching: index[\${i}]=\${nums[i]}, index[\${j}]=\${nums[j]}, sum=\${nums[i] + nums[j]}\`);

        if (nums[i] + nums[j] === target) {
            step("Found it!", "Final result reached.", { i, j }, 12); // Line 12: found it
            return [i, j];
        }
    }
}`
  },
  {
    id: 'reverse-linked-list',
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    initialCode: `let prev = null;
let curr = head;
let index = 0; // Tracking for visualizer

while (curr !== null) {
    // Add index to node for precision in visualizer
    curr.index = index++; 
    
    step(\`Reversing node with value \${curr.val}\`, 
         "Point the current node's 'next' to the previous node.", 
         { prev, curr }, 9); // Line 9: step inside loop
    
    console.log(\`Reversing: curr value is \${curr.val}, prev is \${prev ? prev.val : 'NULL'}\`);

    let nextTemp = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextTemp;
}

step("Finished reversing!", "The list is now reversed.", { prev, curr }, 21); // Line 21: final step
return prev;`
  }
];

export default function Home() {
  const { setProblem, updateVisualization, currentProblem } = useGameStore();

  useEffect(() => {
  
    setProblem(problems[0]);
    updateVisualization({ 
        array: [2, 7, 11, 15],
        pointers: { i: 0, j: 1 },
        highlightedIndices: [0, 1]
    });
  }, [setProblem, updateVisualization]);

  return (
    <div className="flex flex-col h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 overflow-hidden font-sans">
      {/* Header */}
      <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-6 bg-white dark:bg-zinc-950 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <BrainCircuit size={18} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            Socratic<span className="text-blue-600">DSA</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <select 
            className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 py-1.5 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            onChange={(e) => {
                const p = problems.find(prob => prob.id === e.target.value);
                if (p) setProblem(p);
            }}
            value={currentProblem?.id || ''}
          >
            {problems.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
          <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
            <span className="text-xs font-bold">ME</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* Left: Problem Description */}
        <section className="w-1/4 flex flex-col gap-2">
            <div className="flex items-center gap-2 px-2 text-zinc-500 text-xs font-bold uppercase tracking-widest">
                <Book size={14} /> Problem
            </div>
            <ProblemPanel />
        </section>

        {/* Middle: Code & Visualizer */}
        <section className="flex-1 flex flex-col gap-4 overflow-hidden">
            <div className="flex-1 flex flex-col gap-2 min-h-0">
                <div className="flex items-center gap-2 px-2 text-zinc-500 text-xs font-bold uppercase tracking-widest">
                    <TerminalIcon size={14} /> Editor
                </div>
                <CodeEditor />
            </div>
            
            <div className="h-[450px] flex flex-col gap-4 shrink-0">
                <div className="flex-1 flex flex-col gap-2 min-h-0">
                    <div className="flex items-center gap-2 px-2 text-zinc-500 text-xs font-bold uppercase tracking-widest">
                        <Eye size={14} /> Visualization
                    </div>
                    <Visualizer />
                </div>
                
                <div className="h-40 flex flex-col gap-2 shrink-0">
                    <div className="flex items-center gap-2 px-2 text-zinc-500 text-xs font-bold uppercase tracking-widest">
                        <TerminalIcon size={14} /> Output
                    </div>
                    <Terminal />
                </div>
            </div>
        </section>

        {/* Right: Socratic Aide */}
        <section className="w-1/4 flex flex-col gap-2">
            <div className="flex items-center gap-2 px-2 text-zinc-500 text-xs font-bold uppercase tracking-widest">
                <Layout size={14} /> Socratic Aide
            </div>
            <SocraticPanel />
        </section>
      </main>

      {/* Glassmorphic overlay for style */}
      <div className="fixed bottom-0 left-0 right-0 h-32 pointer-events-none bg-gradient-to-t from-white dark:from-black to-transparent opacity-50" />
    </div>
  );
}

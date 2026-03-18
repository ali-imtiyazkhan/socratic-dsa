"use client";

import React, { useEffect } from 'react';
import { useGameStore, Problem } from '../store/useGameStore';
import ProblemPanel from '../components/ProblemPanel';
import CodeEditor from '../components/CodeEditor';
import Visualizer from '../components/Visualizer';
import SocraticPanel from '../components/SocraticPanel';
import Terminal from '../components/Terminal';
import { Layout, BrainCircuit, Terminal as TerminalIcon, Eye, Book, Play, User } from 'lucide-react';

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
  },
  {
    id: 'binary-tree-inorder',
    title: 'Binary Tree Inorder Traversal',
    difficulty: 'Easy',
    description: 'Given the root of a binary tree, return the inorder traversal of its nodes values.',
    initialCode: `function inorder(node) {
    if (!node) return;
    
    step(\`Moving left from node \${node.val}\`, 
         "Check if there is a left subtree to traverse.", 
         { node }, 4);
    inorder(node.left);
    
    step(\`Processing node \${node.val}\`, 
         "Visit the current node and collect its value.", 
         { node }, 8);
    console.log(\`Visited node: \${node.val}\`);
    
    step(\`Moving right from node \${node.val}\`, 
         "Check if there is a right subtree to traverse.", 
         { node }, 12);
    inorder(node.right);
}

inorder(head);`
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
      <header className="h-16 border-b border-zinc-800/50 flex items-center justify-between px-8 bg-zinc-950/50 backdrop-blur-md z-20">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <BrainCircuit size={22} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight leading-none">
              Socratic<span className="text-blue-600">DSA</span>
            </h1>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Mastering Algorithms</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-800/50 rounded-xl px-4 py-1.5">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-tighter">Current Problem</span>
            <select 
                className="bg-transparent border-none text-sm font-bold outline-none focus:ring-0 cursor-pointer text-zinc-100"
                onChange={(e) => {
                    const p = problems.find(prob => prob.id === e.target.value);
                    if (p) setProblem(p);
                }}
                value={currentProblem?.id || ''}
            >
                {problems.map(p => (
                <option key={p.id} value={p.id} className="bg-zinc-900">{p.title}</option>
                ))}
            </select>
          </div>

          <button
            onClick={() => {
                // In a real app we'd trigger the editor's run logic. 
                // For now, we'll assume the store handles the state or trigger a global run.
                // We'll keep the actual run logic inside the Editor but maybe add a shortcut here.
            }}
            className="hidden md:flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/10 active:scale-95"
          >
            <Play size={14} fill="currentColor" /> Run Simulation
          </button>
          
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800/50 flex items-center justify-center text-zinc-400">
            <User size={20} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden p-6 gap-6">
        {/* Column 1: Problem Definition (22%) */}
        <div className="w-[22%] flex flex-col min-w-[280px]">
            <div className="flex items-center gap-2 mb-3 px-1 text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">
                <Book size={12} className="text-blue-500" /> Specification
            </div>
            <div className="flex-1 overflow-hidden">
                <ProblemPanel />
            </div>
        </div>

        {/* Column 2: Visualization & Code (48%) */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
            {/* Visualizer (Hero) */}
            <div className="h-[55%] flex flex-col min-h-0">
                <div className="flex items-center gap-2 mb-3 px-1 text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">
                    <Eye size={12} className="text-blue-500" /> Live Execution
                </div>
                <div className="flex-1 overflow-hidden">
                    <Visualizer />
                </div>
            </div>
            
            {/* Editor Workspace */}
            <div className="flex-1 flex flex-col min-h-0">
                <div className="flex items-center gap-2 mb-3 px-1 text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">
                    <TerminalIcon size={12} className="text-blue-500" /> Solution Implementation
                </div>
                <div className="flex-1 flex flex-col min-h-0 gap-4">
                    <div className="flex-1 overflow-hidden rounded-2xl border border-zinc-800/50 shadow-xl bg-zinc-900/50">
                        <CodeEditor />
                    </div>
                    <div className="h-32 rounded-2xl border border-zinc-800/50 bg-black/40 overflow-hidden shrink-0">
                        <Terminal />
                    </div>
                </div>
            </div>
        </div>

        {/* Column 3: Socratic Aide (30%) */}
        <div className="w-[30%] flex flex-col min-w-[340px]">
            <div className="flex items-center gap-2 mb-3 px-1 text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">
                <Layout size={12} className="text-blue-500" /> Socratic Guidance
            </div>
            <div className="flex-1 overflow-hidden">
                <SocraticPanel />
            </div>
        </div>
      </main>

      {/* Glassmorphic overlay for style */}
      <div className="fixed bottom-0 left-0 right-0 h-32 pointer-events-none bg-gradient-to-t from-white dark:from-black to-transparent opacity-50" />
    </div>
  );
}

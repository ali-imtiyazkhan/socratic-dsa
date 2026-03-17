"use client";

import React, { useEffect } from 'react';
import { useGameStore, Problem } from '../store/useGameStore';
import ProblemPanel from '../components/ProblemPanel';
import CodeEditor from '../components/CodeEditor';
import Visualizer from '../components/Visualizer';
import SocraticPanel from '../components/SocraticPanel';
import { Layout, BrainCircuit, Terminal, Eye, Book } from 'lucide-react';

const problems: Problem[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    initialCode: '/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    // Write your code here\n};'
  },
  {
    id: 'valid-anagram',
    title: 'Valid Anagram',
    difficulty: 'Easy',
    description: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise. An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.',
    initialCode: '/**\n * @param {string} s\n * @param {string} t\n * @return {boolean}\n */\nvar isAnagram = function(s, t) {\n    \n};'
  }
];

export default function Home() {
  const { setProblem, updateVisualization, currentProblem } = useGameStore();

  useEffect(() => {
    // Initial setup with Two Sum
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
                    <Terminal size={14} /> Editor
                </div>
                <CodeEditor />
            </div>
            <div className="h-[320px] flex flex-col gap-2 shrink-0">
                <div className="flex items-center gap-2 px-2 text-zinc-500 text-xs font-bold uppercase tracking-widest">
                    <Eye size={14} /> Visualization
                </div>
                <Visualizer />
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

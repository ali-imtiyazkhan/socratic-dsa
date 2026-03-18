import { create } from 'zustand';
import { ExecutionBridge } from '../lib/ExecutionBridge';

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  initialCode: string;
}

export interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  id?: string; // For React keys and animation
}

export interface VisualizationState {
  array: number[];
  tree: TreeNode | null; // For new Tree problems
  pointers: Record<string, any>;
  highlightedIndices: number[]; // For arrays
  highlightedNodes: string[]; // For trees (node IDs)
  activeStepIndex: number;
}

export interface SocraticStep {
  doing: string;
  next: string;
  line?: number;
}

export interface ChatMessage {
  role: 'user' | 'aide';
  content: string;
  timestamp: string;
}

interface StepData {
  pointers: Record<string, number>;
  highlightedIndices: number[];
  doing: string;
  next: string;
}

interface GameStore {
  currentProblem: Problem | null;
  visualization: VisualizationState;
  socraticStep: SocraticStep;
  stepHistory: SocraticStep[];
  chatHistory: ChatMessage[];
  logs: string[];
  currentStepIndex: number;
  activeLine: number | null;
  isSimulating: boolean;
  
  // Actions
  setProblem: (problem: Problem) => void;
  updateVisualization: (update: Partial<VisualizationState>) => void;
  setSocraticStep: (step: SocraticStep) => void;
  addLog: (log: string) => void;
  addChatMessage: (message: ChatMessage) => void;
  runSimulation: (code?: string) => void;
  resetSimulation: () => void;
  askAide: (query: string) => void;
}

const initialVisualization: VisualizationState = {
  array: [],
  tree: null,
  pointers: {},
  highlightedIndices: [],
  highlightedNodes: [],
  activeStepIndex: 0,
};

const initialSocratic: SocraticStep = {
  doing: "Select a problem to begin.",
  next: "Read the problem description and constraints."
};

const TWO_SUM_STEPS: StepData[] = [
    {
        pointers: { i: 0, j: 1 },
        highlightedIndices: [0, 1],
        doing: "Checking if 2 + 7 = 9",
        next: "Since it matches the target, we found the solution!"
    },
    {
        pointers: { i: 0, j: 2 },
        highlightedIndices: [0, 2],
        doing: "Checking if 2 + 11 = 9",
        next: "Sum is 13 (sum > target), so we keep looking."
    },
    {
        pointers: { i: 1, j: 2 },
        highlightedIndices: [1, 2],
        doing: "Incrementing pointers to find a pair.",
        next: "Check the next combination."
    }
];

export const useGameStore = create<GameStore>((set, get) => ({
  currentProblem: null,
  visualization: initialVisualization,
  socraticStep: initialSocratic,
  stepHistory: [],
  chatHistory: [{
    role: 'aide',
    content: "Greetings! I am your Socratic Aide. Let's tackle some DSA problems together.",
    timestamp: new Date().toLocaleTimeString()
  }],
  logs: [],
  currentStepIndex: -1,
  activeLine: null,
  isSimulating: false,

  setProblem: (problem) => {
    let initialArray: number[] = [];
    let initialTree: TreeNode | null = null;
    
    if (problem.id === 'two-sum') initialArray = [2, 7, 11, 15];
    if (problem.id === 'reverse-linked-list') initialArray = [1, 2, 3, 4, 5];
    if (problem.id === 'binary-tree-inorder') {
        // Build a simple tree: [1, null, 2, 3]
        initialTree = {
            val: 1, id: 'n1',
            left: null,
            right: {
                val: 2, id: 'n2',
                left: { val: 3, id: 'n3', left: null, right: null },
                right: null
            }
        };
    }

    set({ 
        currentProblem: problem,
        visualization: { ...initialVisualization, array: initialArray, tree: initialTree },
        socraticStep: {
            doing: `Solving ${problem.title}`,
            next: problem.id === 'binary-tree-inorder' ? "Think about the recursive steps: Left, Root, Right." : "Analyze the input and think about the brute force approach."
        },
        stepHistory: [],
        chatHistory: [{
            role: 'aide',
            content: `Alright, let's look at ${problem.title}. ${problem.description} What's your first intuition for an initial approach?`,
            timestamp: new Date().toLocaleTimeString()
        }],
        logs: [],
        currentStepIndex: -1,
        activeLine: null,
        isSimulating: false
    });
  },

  updateVisualization: (update) => set((state) => ({
    visualization: { ...state.visualization, ...update }
  })),

  setSocraticStep: (step) => set((state) => ({ 
    socraticStep: step,
    stepHistory: [...state.stepHistory, step],
    activeLine: step.line ?? state.activeLine
  })),

  addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),

  addChatMessage: (message) => set((state) => ({ 
    chatHistory: [...state.chatHistory, message] 
  })),

  askAide: (query) => {
    const { chatHistory, socraticStep, visualization } = get();
    
    // 1. Add user message
    const userMsg: ChatMessage = {
        role: 'user',
        content: query,
        timestamp: new Date().toLocaleTimeString()
    };
    
    set({ chatHistory: [...chatHistory, userMsg] });

    // 2. Logic for Aide response (Socratic-ish)
    // In a real app, this would call an LLM with context.
    // For now, we simulate with rule-based responses based on state.
    setTimeout(() => {
        let aideResponse = "That's an interesting thought. How do you think that relates to our current step of " + socraticStep.doing.toLowerCase() + "?";
        
        const q = query.toLowerCase();
            if (q.includes("why") || q.includes("reason")) {
                aideResponse = `We are doing this because: ${socraticStep.doing}. Think about what happens if we don't do this step. What state would our variables be in?`;
            } else if (q.includes("hint") || q.includes("help")) {
                aideResponse = `Here's a small nudge: ${socraticStep.next}. Try to visualize the data moving in your mind.`;
            } else if (q.includes("pointer") || q.includes("i") || q.includes("j")) {
                const pointers = Object.entries(visualization.pointers)
                    .map(([name, val]) => `${name} is at index ${val}`)
                    .join(", ");
                aideResponse = `Let's look at the pointers. Currently, ${pointers}. Does their position match what you'd expect for this algorithm?`;
            } else if (q.includes("recursion") || q.includes("call stack") || q.includes("depth")) {
                aideResponse = "Recursion is like exploring a maze. We keep going deeper until we hit a dead end (base case), then we trace our steps back. Where are we in the 'maze' right now?";
            } else if (q.includes("tree") || q.includes("left") || q.includes("right")) {
                aideResponse = "In a binary tree, each node is the root of its own subtree. By going left, we are solving a smaller version of the problem for the left side. What do you expect to find there?";
            }

        get().addChatMessage({
            role: 'aide',
            content: aideResponse,
            timestamp: new Date().toLocaleTimeString()
        });
    }, 1000);
  },

  runSimulation: async (code?: string) => {
    const { currentProblem, isSimulating } = get();
    if (!currentProblem || isSimulating) return;

    set({ isSimulating: true, logs: [], stepHistory: [] });

    if (code) {
        // Dynamic Execution Phase
        const bridge = new ExecutionBridge(
            (result) => {
                console.log('Result:', result);
                set({ isSimulating: false, activeLine: null });
            },
            (err) => {
                set({ 
                    socraticStep: { doing: "Error In Code", next: err },
                    isSimulating: false,
                    activeLine: null
                });
            }
        );

        // Parameters for the code execution
        const params: any = {
            nums: get().visualization.array,
            target: 9
        };

        // Problem-specific code injection
        if (currentProblem.id === 'reverse-linked-list') {
            const listData = get().visualization.array;
            params.listData = listData;
            code = `
                function ListNode(val, next) {
                    this.val = val;
                    this.next = next || null;
                }
                function buildList(arr) {
                    if (!arr.length) return null;
                    let head = new ListNode(arr[0]);
                    let curr = head;
                    for(let i=1; i<arr.length; i++) {
                        curr.next = new ListNode(arr[i]);
                        curr = curr.next;
                    }
                    return head;
                }
                const head = buildList(listData);
                ${code}
            `;
        } else if (currentProblem.id === 'binary-tree-inorder') {
            const treeData = get().visualization.tree;
            params.treeData = treeData;
            code = `
                function TreeNode(val, left, right) {
                    this.val = val;
                    this.left = left || null;
                    this.right = right || null;
                }
                const head = treeData; 
                ${code}
            `;
        }

        bridge.run(code, params);
        return;
    }

    if (currentProblem.id === 'two-sum') {
        // Fallback to simulation if no code provided
        for (let i = 0; i < TWO_SUM_STEPS.length; i++) {
// ... existing TWO_SUM_STEPS logic ...
            const step = TWO_SUM_STEPS[i];
            set({ 
                currentStepIndex: i,
                visualization: { 
                    ...get().visualization, 
                    pointers: step.pointers,
                    highlightedIndices: step.highlightedIndices
                },
                socraticStep: {
                    doing: step.doing,
                    next: step.next
                }
            });
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    set({ isSimulating: false });
  },

  resetSimulation: () => set({ 
    visualization: { ...initialVisualization, array: get().currentProblem?.id === 'two-sum' ? [2, 7, 11, 15] : [] },
    currentStepIndex: -1,
    activeLine: null,
    isSimulating: false,
    socraticStep: initialSocratic,
    stepHistory: [],
    chatHistory: [{
        role: 'aide',
        content: "Simulation reset. I'm ready for your questions!",
        timestamp: new Date().toLocaleTimeString()
    }],
    logs: []
  }),
}));

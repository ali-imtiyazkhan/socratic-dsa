import { create } from 'zustand';
import { ExecutionBridge } from '../lib/ExecutionBridge';

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  initialCode: string;
}

export interface VisualizationState {
  array: number[];
  pointers: Record<string, any>;
  highlightedIndices: number[];
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
  pointers: {},
  highlightedIndices: [],
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
    if (problem.id === 'two-sum') initialArray = [2, 7, 11, 15];
    if (problem.id === 'reverse-linked-list') initialArray = [1, 2, 3, 4, 5];

    set({ 
        currentProblem: problem,
        visualization: { ...initialVisualization, array: initialArray },
        socraticStep: {
            doing: `Solving ${problem.title}`,
            next: "Analyze the input and think about the brute force approach."
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

        // If it's a linked list problem, we provide 'head'
        if (currentProblem.id === 'reverse-linked-list') {
            // Helper to build a linked list from array inside the worker context
            const listData = get().visualization.array;
            params.listData = listData;
            // Inject helper to build list in worker
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

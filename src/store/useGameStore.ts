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
  logs: string[];
  currentStepIndex: number;
  isSimulating: boolean;
  
  // Actions
  setProblem: (problem: Problem) => void;
  updateVisualization: (update: Partial<VisualizationState>) => void;
  setSocraticStep: (step: SocraticStep) => void;
  addLog: (log: string) => void;
  runSimulation: (code?: string) => void;
  resetSimulation: () => void;
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
  logs: [],
  currentStepIndex: -1,
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
        logs: [],
        currentStepIndex: -1,
        isSimulating: false
    });
  },

  updateVisualization: (update) => set((state) => ({
    visualization: { ...state.visualization, ...update }
  })),

  setSocraticStep: (step) => set((state) => ({ 
    socraticStep: step,
    stepHistory: [...state.stepHistory, step]
  })),

  addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),

  runSimulation: async (code?: string) => {
    const { currentProblem, isSimulating } = get();
    if (!currentProblem || isSimulating) return;

    set({ isSimulating: true, logs: [], stepHistory: [] });

    if (code) {
        // Dynamic Execution Phase
        const bridge = new ExecutionBridge(
            (result) => {
                console.log('Result:', result);
                set({ isSimulating: false });
            },
            (err) => {
                set({ 
                    socraticStep: { doing: "Error In Code", next: err },
                    isSimulating: false 
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
    isSimulating: false,
    socraticStep: initialSocratic,
    stepHistory: [],
    logs: []
  }),
}));

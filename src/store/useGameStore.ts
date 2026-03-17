import { create } from 'zustand';

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  initialCode: string;
}

export interface VisualizationState {
  array: number[];
  pointers: Record<string, number>;
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
  currentStepIndex: number;
  isSimulating: boolean;
  
  // Actions
  setProblem: (problem: Problem) => void;
  updateVisualization: (update: Partial<VisualizationState>) => void;
  setSocraticStep: (step: SocraticStep) => void;
  runSimulation: () => void;
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
  currentStepIndex: -1,
  isSimulating: false,

  setProblem: (problem) => set({ 
    currentProblem: problem,
    visualization: { ...initialVisualization, array: problem.id === 'two-sum' ? [2, 7, 11, 15] : [] },
    socraticStep: {
        doing: `Solving ${problem.title}`,
        next: "Analyze the input and think about the brute force approach."
    },
    currentStepIndex: -1,
    isSimulating: false
  }),

  updateVisualization: (update) => set((state) => ({
    visualization: { ...state.visualization, ...update }
  })),

  setSocraticStep: (step) => set({ socraticStep: step }),

  runSimulation: async () => {
    const { currentProblem, isSimulating } = get();
    if (!currentProblem || isSimulating) return;

    set({ isSimulating: true });

    if (currentProblem.id === 'two-sum') {
        for (let i = 0; i < TWO_SUM_STEPS.length; i++) {
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
    socraticStep: initialSocratic
  }),
}));

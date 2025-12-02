import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MiniProblem {
  id: string;
  text: string;
}

export interface GoalItem {
  id: string;
  text: string;
}

export interface SixStepData {
  // Step 1: Understand the Problem
  step1?: {
    understanding: string;
    selectedMiniProblem: string;
    miniProblems: MiniProblem[];
  };
  // Step 2: Define Objective
  step2?: {
    goals: GoalItem[];
    selectedGoal?: GoalItem;
  };
  // Step 3: Answer Questions
  step3?: {
    questions: string;
  };
  // Step 4: Formulate Contradiction
  step4?: {
    contradiction: string;
  };
  // Step 5: Generate Ideas
  step5?: {
    ideas: string;
  };
  // Step 6: Make Decision
  step6?: {
    decision: string;
  };
}

interface SixStepDataStore {
  // Current step (0 = introduction, 1-7 = actual steps)
  currentStep: number;

  // Has the user started the workflow?
  hasStarted: boolean;

  // Data for each step
  stepData: SixStepData;

  // Actions
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  setHasStarted: (started: boolean) => void;

  // Update data for specific steps
  updateStep1: (data: SixStepData['step1']) => void;
  updateStep2: (data: SixStepData['step2']) => void;
  updateStep3: (data: SixStepData['step3']) => void;
  updateStep4: (data: SixStepData['step4']) => void;
  updateStep5: (data: SixStepData['step5']) => void;
  updateStep6: (data: SixStepData['step6']) => void;

  // Reset the entire workflow
  resetWorkflow: () => void;

  // Reset only the data but keep the progress
  resetData: () => void;
}

const initialState = {
  currentStep: 1,
  hasStarted: false,
  stepData: {},
};

export const useSixStepDataStore = create<SixStepDataStore>()(
  persist(
    (set) => ({
      ...initialState,

      // Navigation actions
      setCurrentStep: (step: number) => set({ currentStep: step }),

      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(7, state.currentStep + 1),
        })),

      previousStep: () =>
        set((state) => ({
          currentStep: Math.max(1, state.currentStep - 1),
        })),

      setHasStarted: (started: boolean) => set({ hasStarted: started }),

      // Step data updates
      updateStep1: (data) =>
        set((state) => ({
          stepData: {
            ...state.stepData,
            step1: data,
          },
        })),

      updateStep2: (data) =>
        set((state) => ({
          stepData: {
            ...state.stepData,
            step2: data,
          },
        })),

      updateStep3: (data) =>
        set((state) => ({
          stepData: {
            ...state.stepData,
            step3: data,
          },
        })),

      updateStep4: (data) =>
        set((state) => ({
          stepData: {
            ...state.stepData,
            step4: data,
          },
        })),

      updateStep5: (data) =>
        set((state) => ({
          stepData: {
            ...state.stepData,
            step5: data,
          },
        })),

      updateStep6: (data) =>
        set((state) => ({
          stepData: {
            ...state.stepData,
            step6: data,
          },
        })),

      // Reset actions
      resetWorkflow: () => set(initialState),

      resetData: () =>
        set((state) => ({
          ...state,
          stepData: {},
        })),
    }),
    {
      name: 'six-step-workflow-storage',
      // Only persist the data, not the current step or started state
      partialize: (state) => ({
        stepData: state.stepData,
      }),
    },
  ),
);

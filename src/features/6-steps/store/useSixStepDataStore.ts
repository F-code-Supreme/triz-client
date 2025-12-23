import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { PhysicalContradiction } from '../types';

export interface MiniProblem {
  id: string;
  text: string;
}

export interface GoalItem {
  id: string;
  text: string;
}

export interface RequiredStateItem {
  id: string;
  text: string;
}

export interface SixStepData {
  // Step 1: Understand the Problem
  step1?: {
    understanding: string;
    understandingSummary: string;
    systemContext: {
      mainObject: string;
      environment: string;
    };
    psychologicalInertia: string[];
    miniProblems: MiniProblem[];
    selectedMiniProblem: string;
    clarificationNeeded: string[] | null;
  };
  // Step 2: Define Objective
  step2?: {
    goal: string;
    constraints: string[];
    scope: string;
    idealFinalResult: string | null;
    secondaryGoals: string[] | null;
    clarificationNeeded: string[] | null;
  };
  // Step 3: Answer Questions
  step3?: {
    systemIdentified: string;
    elements: string[];
    objectType: 'Moving' | 'Stationary';
    requiredStates: Record<string, RequiredStateItem[]>;
  };
  // Step 4: Formulate Contradiction
  step4?: {
    physicalContradictions: {
      element: string;
      stateA: string;
      stateB: string;
      benefitA: string;
      benefitB: string;
      contradictionStatement: string;
    }[];
    selectedPhysicalContradictionIndex?: number;
    selectedPhysicalContradiction?: PhysicalContradiction;
    technicalContradictions?: {
      element: string;
      sourceML: string;
      mk1: {
        direction: string;
        improvingParameter: {
          name: string;
          number: string;
          reasoning: string;
        };
        worseningParameter: {
          name: string;
          number: string;
          reasoning: string;
        };
        contradictionStatement: string;
      };
      mk2: {
        direction: string;
        improvingParameter: {
          name: string;
          number: string;
          reasoning: string;
        };
        worseningParameter: {
          name: string;
          number: string;
          reasoning: string;
        };
        contradictionStatement: string;
      };
    }[];
    selectedPrinciples?: {
      id: number;
      name: string;
      priority: number;
      description: string;
      examples: string[];
    }[];
    selectedTechnicalContradictionId?: string;
    matrixParams?: {
      improving: number;
      worsening: number;
      improvingName: string;
      worseningName: string;
    };
  };
  // Step 5: Generate Ideas
  step5?: {
    targetML: string;
    ideas: {
      id: number;
      element: string;
      sourceType: string;
      principleUsed: {
        id: number;
        name: string;
        priority: number;
        subPoint?: string;
      };
      ideaStatement: string;
      howItAddresses: string;
      abstractionLevel: string;
    }[];
    selectedIdeas?: {
      id: number;
      element: string;
      sourceType: string;
      principleUsed: {
        id: number;
        name: string;
        priority: number;
        subPoint?: string;
      };
      ideaStatement: string;
      howItAddresses: string;
      abstractionLevel: string;
    }[];
  };
  // Step 6: Make Decision
  step6?: {
    evaluations: {
      ideaId: number;
      status: 'SELECTED' | 'RESERVE' | 'REJECTED';
      analysis: {
        screening: string;
        resourcesAndInertia: string;
        overallBenefit: string;
      };
      decisionMessage: string;
      actionSuggestion: string;
      userComment?: string;
      userRating?: number;
    }[];
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

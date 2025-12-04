import type { PhysicalContradiction } from '../../types';
import type { IGetPrinciplesLookupDataResponse } from '../queries/types';

// Step 1
export interface IStep1SuggestionPayload {
  rawProblem: string;
}

export interface IStep1SuggestionResponse {
  understandingSummary: string;
  miniProblems: string[];
  systemRepresentation: {
    elements: string[];
    flows: string[];
    interactions: string[];
  };
  scope: {
    inScope: string[];
    outOfScope: string[];
  };
  refinedProblem: string;
  potentialContradictions: string[];
  psychologicalInertia: string[];
  clarificationNeeded?: string[];
}

// Step 2
export interface IStep2SuggestionPayload {
  miniProblem: string;
}

export interface IStep2SuggestionResponse {
  goal: string;
  constraints: string[];
  scope: string;
  idealFinalResult: string | null;
  secondaryGoals: string[] | null;
  clarificationNeeded: string[] | null;
}

// Step 3
export interface IStep3SuggestionPayload {
  miniProblem: string;
  goal: string;
}

export interface IStep3SuggestionResponse {
  systemIdentified: string;
  elements: string[];
  requiredStates: Record<string, string[]>;
}

// Step 4
export interface IStep4SuggestionPayload {
  goal: string;
  systemIdentified: string;
  elements: string[];
  requiredStates: Record<string, string[]>;
}

export interface IStep4SuggestionResponse {
  physicalContradictions: PhysicalContradiction[];
}

export interface IConvertMLtoMKPayload {
  physicalContradictions: PhysicalContradiction[];
}

export interface TRIZParameter {
  name: string;
  number: string;
  reasoning: string;
}

export interface TechnicalContradictionDirection {
  direction: string;
  improvingParameter: TRIZParameter;
  worseningParameter: TRIZParameter;
  contradictionStatement: string;
}

export interface TechnicalContradiction {
  element: string;
  sourceML: string;
  MK1: TechnicalContradictionDirection;
  MK2: TechnicalContradictionDirection;
  matrixUsage: {
    MK1_lookup: string;
    MK2_lookup: string;
  };
}

export interface IConvertMLtoMKResponse {
  technicalContradictions: TechnicalContradiction[];
}

// Step 5
export interface IStep5SuggestionPayload {
  miniProblem: string;
  goal: string;
  systemIdentified: string;
  physicalContradictions: PhysicalContradiction[];
  trizPrinciples: IGetPrinciplesLookupDataResponse;
}

export interface PrincipleUsed {
  id: number;
  name: string;
  priority: number;
  subPoint: string;
}

export interface Idea {
  id: number;
  element: string;
  sourceType: 'TRIZ_Principle';
  principleUsed: PrincipleUsed;
  ideaStatement: string;
  howItAddresses: string;
  abstractionLevel: 'concept';
}

export interface IStep5SuggestionResponse {
  ideaGenerationSession: {
    targetML: string;
    totalIdeasGenerated: number;
    ideas: Idea[];
  };
}

// Step 6
export interface IStep6SuggestionPayload {
  targetML: string;
  idea: Idea;
  physicalContradictions: PhysicalContradiction[];
}

export interface IStep6SuggestionResponse {
  ideaId: number;
  status: 'passing' | 'rejected';
  evaluation: {
    scores: {
      mlResolution: number;
      feasibility: number;
      systemImpact: number;
      total: number;
    };
    category: 'excellent' | 'good' | 'average' | 'poor';
    keyStrengths: string[];
    keyWeaknesses: string[];
    explanation: {
      mlResolution: string;
      feasibility: string;
      systemImpact: string;
    };
  } | null;
  message: string;
  rejectionReason: string | null;
  category: 'constraint_violation' | 'not_solving_ml' | 'not_feasible' | null;
  suggestion: string | null;
  assumption: string | null;
  note: string | null;
}

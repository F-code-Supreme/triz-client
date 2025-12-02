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
  physicalContradictions: Array<{
    element: string;
    propertyDimension: string;
    stateA: string;
    stateB: string;
    benefitA: string;
    benefitB: string;
    contradictionStatement: string;
  }>;
}

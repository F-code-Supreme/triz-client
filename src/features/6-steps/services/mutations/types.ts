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

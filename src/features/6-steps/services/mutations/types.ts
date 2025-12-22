import type {
  ObjectType,
  PhysicalContradiction,
  Step1Understand,
  Step2Objectives,
  Step3Analysis,
  Step4Contradiction,
  Step6Decision,
} from '../../types';
import type { IGetPrinciplesLookupDataResponse } from '../queries/types';

// Step 1
export interface IStep1SuggestionPayload {
  rawProblem: string;
}

export interface IStep1SuggestionResponse {
  understandingSummary: string;
  systemContext: {
    mainObject: string;
    environment: string;
  };
  psychologicalInertia: string[];
  miniProblems: string[];
  clarificationNeeded: string[] | null;
}

// Step 2
export interface IStep2SuggestionPayload {
  understandingSummary: string;
  systemContext: {
    mainObject: string;
    environment: string;
  };
  psychologicalInertia: string[];
  miniProblem: string;
  clarificationNeeded: string[] | null;
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
  goal: string;
  constraints: string[];
  scope: string;
  idealFinalResult: string;
}

export interface IStep3SuggestionResponse {
  systemIdentified: string;
  elements: string[];
  objectType: ObjectType;
  requiredStates: Record<string, string[]>;
}

// Step 4
export interface IStep4SuggestionPayload {
  systemIdentified: string;
  elements: string[];
  objectType: ObjectType;
  requiredStates: Record<string, string[]>;
}

export interface IStep4SuggestionResponse {
  physicalContradictions: PhysicalContradiction[];
}

export interface IConvertMLtoMKPayload {
  systemInfo: {
    objectType: ObjectType;
  };
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
  mk1: TechnicalContradictionDirection;
  mk2: TechnicalContradictionDirection;
}

export interface IConvertMLtoMKResponse {
  technicalContradictions: TechnicalContradiction[];
}

// Step 5
export interface IStep5SuggestionPayload {
  step5Data: {
    technicalContradictions: TechnicalContradiction[];
  };
  trizPrinciples: IGetPrinciplesLookupDataResponse;
}

export interface PrincipleUsed {
  id: number;
  name: string;
}

export interface Idea {
  id: number;
  element: string;
  sourceType: 'TRIZ_Principle';
  principleUsed: PrincipleUsed;
  ideaStatement: string;
  howItAddresses: string;
}

export interface IStep5SuggestionResponse {
  ideaGenerationSession: {
    targetML: string;
    ideas: Idea[];
  };
}

// Step 6
export interface IStep6SuggestionPayload {
  ideaGenerationSession: {
    targetML: string;
    ideas: Idea[];
  };
}

export interface IStep6EvaluatedIdea {
  ideaId: number;
  status: 'SELECTED' | 'RESERVE';
  analysis: {
    screening: string;
    resourcesAndInertia: string;
    overallBenefit: string;
  };
  decisionMessage: string;
  actionSuggestion: string;
}

export interface IStep6SuggestionResponse {
  evaluatedIdeas: IStep6EvaluatedIdea[];
}

// Journal
export interface ICreateSixStepJournalPayload {
  step1Understand: Step1Understand;
  step2Objectives: Step2Objectives;
  step3Analysis: Step3Analysis;
  step4Contradiction: Step4Contradiction;
  step5Ideas: {
    selectedIdeas: Idea[];
  };
  step6Decision: Step6Decision;
}

export interface IPublishSixStepJournalToForumPayload {
  problemId: string;
  userId: string;
}

export interface Principle {
  id: number;
  name: string;
  description: string;
  examples: string[];
}

export interface PhysicalContradiction {
  element: string;
  propertyDimension: string;
  stateA: string;
  stateB: string;
  benefitA: string;
  benefitB: string;
  contradictionStatement: string;
}

export interface SelectedIdea {
  id: number;
  ideaStatement: string;
}

export interface IdeaEvaluation {
  ideaId: number;
  ideaStatement: string;
  aiComment: string;
  userComment: string;
  userRating: number;
}

export interface Step1Understand {
  rawProblem: string;
  selectedMiniProblem: string;
}

export interface Step2Objectives {
  goal: string;
}

export interface Step3Analysis {
  systemIdentified: string;
  elements: string[];
  requiredStates: Record<string, string[]>;
}

export interface Step4Contradiction {
  physicalContradictions: PhysicalContradiction[];
}

export interface Step5Ideas {
  selectedIdeas: SelectedIdea[];
}

export interface Step6Decision {
  evaluatedIdeas: IdeaEvaluation[];
}

export interface Problem {
  id: string;
  title: string;
  status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED';
  stepData: {
    step1Understand?: Step1Understand;
    step2Objectives?: Step2Objectives;
    step3Analysis?: Step3Analysis;
    step4Contradiction?: Step4Contradiction;
    step5Ideas?: Step5Ideas;
    step6Decision?: Step6Decision;
  };
}

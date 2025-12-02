import { useState } from 'react';

import { HorizontalStepper } from './stepper';
import {
  Step0Introduction,
  Step1UnderstandProblem,
  Step2DefineObjective,
  Step3AnswerQuestions,
  Step4FormulateContradiction,
  Step5GenerateIdeas,
  Step6MakeDecision,
  Step7Summary,
} from './steps';

interface StepData {
  step1?: { understanding: string };
  step2?: { objective: string };
  step3?: { questions: string };
  step4?: { contradiction: string };
  step5?: { ideas: string };
  step6?: { decision: string };
}

const STEPS = [
  { number: 1, label: 'Hiểu bài toán' },
  { number: 2, label: 'Đề ra mục đích' },
  { number: 3, label: 'Trả lời câu hỏi' },
  { number: 4, label: 'Phát biểu ML' },
  { number: 5, label: 'Phát ý tưởng' },
  { number: 6, label: 'Ra quyết định' },
  { number: 7, label: 'Tóm tắt' },
];

export const SixStepsWorkflow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepData, setStepData] = useState<StepData>({});
  const [hasStarted, setHasStarted] = useState(false);

  const handleStepNext = (step: number, data: Record<string, unknown>) => {
    setStepData((prev) => ({
      ...prev,
      [`step${step}`]: data,
    }));
    setCurrentStep(step + 1);
  };

  const handleStepBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleStart = () => {
    setHasStarted(true);
  };

  // Show intro screen (Step 0) before starting
  if (!hasStarted) {
    return <Step0Introduction onStart={handleStart} />;
  }

  return (
    <div className="space-y-8">
      {/* Stepper - Only show when started */}
      <HorizontalStepper steps={STEPS} currentStep={currentStep} />

      {/* Step Content */}
      <div className="min-h-[calc(100%-64px)]">
        {currentStep === 1 && (
          <Step1UnderstandProblem
            onNext={(data) => handleStepNext(1, data)}
            initialData={stepData.step1}
          />
        )}

        {currentStep === 2 && (
          <Step2DefineObjective
            onNext={(data) => handleStepNext(2, data)}
            onBack={handleStepBack}
            initialData={stepData.step2}
          />
        )}

        {currentStep === 3 && (
          <Step3AnswerQuestions
            onNext={(data) => handleStepNext(3, data)}
            onBack={handleStepBack}
            initialData={stepData.step3}
          />
        )}

        {currentStep === 4 && (
          <Step4FormulateContradiction
            onNext={(data: Record<string, unknown>) => handleStepNext(4, data)}
            onBack={handleStepBack}
            initialData={stepData.step4}
          />
        )}

        {currentStep === 5 && (
          <Step5GenerateIdeas
            onNext={(data: Record<string, unknown>) => handleStepNext(5, data)}
            onBack={handleStepBack}
            initialData={stepData.step5}
          />
        )}

        {currentStep === 6 && (
          <Step6MakeDecision
            onNext={(data: Record<string, unknown>) => handleStepNext(6, data)}
            onBack={handleStepBack}
            initialData={stepData.step6}
          />
        )}

        {currentStep === 7 && (
          <Step7Summary onBack={handleStepBack} stepData={stepData} />
        )}
      </div>
    </div>
  );
};

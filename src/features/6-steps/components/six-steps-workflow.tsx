import { HorizontalStepper } from './stepper';
import {
  Step1UnderstandProblem,
  Step2DefineObjective,
  Step3AnswerQuestions,
  Step4FormulateContradiction,
  Step5GenerateIdeas,
  Step6MakeDecision,
  Step7Summary,
} from './steps';
import { useSixStepDataStore } from '../store/useSixStepDataStore';

// Re-export for backward compatibility
export type { SixStepData as StepData } from '../store/useSixStepDataStore';

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
  const {
    stepData,
    currentStep,
    nextStep,
    previousStep,
    updateStep1,
    updateStep2,
    updateStep3,
    updateStep4,
    updateStep5,
    updateStep6,
  } = useSixStepDataStore();

  const handleStepNext = (step: number, data: unknown) => {
    // Update the appropriate step data based on step number
    switch (step) {
      case 1:
        updateStep1(data as typeof stepData.step1);
        // Clear subsequent steps when step 1 is updated
        updateStep2(undefined);
        updateStep3(undefined);
        updateStep4(undefined);
        updateStep5(undefined);
        updateStep6(undefined);
        break;
      case 2:
        updateStep2(data as typeof stepData.step2);
        // Clear subsequent steps when step 2 is updated
        updateStep3(undefined);
        updateStep4(undefined);
        updateStep5(undefined);
        updateStep6(undefined);
        break;
      case 3:
        updateStep3(data as typeof stepData.step3);
        // Clear subsequent steps when step 3 is updated
        updateStep4(undefined);
        updateStep5(undefined);
        updateStep6(undefined);
        break;
      case 4:
        updateStep4(data as typeof stepData.step4);
        // Clear subsequent steps when step 4 is updated
        updateStep5(undefined);
        updateStep6(undefined);
        break;
      case 5:
        updateStep5(data as typeof stepData.step5);
        // Clear subsequent steps when step 5 is updated
        updateStep6(undefined);
        break;
      case 6:
        updateStep6(data as typeof stepData.step6);
        break;
    }
    nextStep();
  };

  const handleStepBack = () => {
    previousStep();
  };

  return (
    <div className="space-y-8">
      {/* Stepper */}
      <HorizontalStepper steps={STEPS} currentStep={currentStep} />

      {/* Step Content */}
      <div className="h-[calc(100vh-230px)]">
        {currentStep === 1 && (
          <Step1UnderstandProblem onNext={(data) => handleStepNext(1, data)} />
        )}

        {currentStep === 2 && (
          <Step2DefineObjective
            onNext={(data) => handleStepNext(2, data)}
            onBack={handleStepBack}
          />
        )}

        {currentStep === 3 && (
          <Step3AnswerQuestions
            onNext={(data) => handleStepNext(3, data)}
            onBack={handleStepBack}
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

        {currentStep === 7 && <Step7Summary onBack={handleStepBack} />}
      </div>
    </div>
  );
};

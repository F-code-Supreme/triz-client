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
    nextStep,
    previousStep,
    setHasStarted,
    updateStep1,
    updateStep2,
    updateStep3,
    updateStep4,
    updateStep5,
    updateStep6,
  } = useSixStepDataStore();

  // TODO: Remove this development override - currently set to step 3 for development
  const devCurrentStep: number = 4;
  const devHasStarted = true;

  const handleStepNext = (step: number, data: unknown) => {
    // Update the appropriate step data based on step number
    switch (step) {
      case 1:
        updateStep1(data as typeof stepData.step1);
        break;
      case 2:
        updateStep2(data as typeof stepData.step2);
        break;
      case 3:
        updateStep3(data as typeof stepData.step3);
        break;
      case 4:
        updateStep4(data as typeof stepData.step4);
        break;
      case 5:
        updateStep5(data as typeof stepData.step5);
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

  const handleStart = () => {
    setHasStarted(true);
  };

  // Show intro screen (Step 0) before starting
  if (!devHasStarted) {
    return <Step0Introduction onStart={handleStart} />;
  }

  return (
    <div className="space-y-8">
      {/* Stepper - Only show when started */}
      <HorizontalStepper steps={STEPS} currentStep={devCurrentStep} />

      {/* Step Content */}
      <div className="h-[calc(100vh-230px)]">
        {devCurrentStep === 1 && (
          <Step1UnderstandProblem onNext={(data) => handleStepNext(1, data)} />
        )}

        {devCurrentStep === 2 && (
          <Step2DefineObjective
            onNext={(data) => handleStepNext(2, data)}
            onBack={handleStepBack}
          />
        )}

        {devCurrentStep === 3 && (
          <Step3AnswerQuestions
            onNext={(data) => handleStepNext(3, data)}
            onBack={handleStepBack}
          />
        )}

        {devCurrentStep === 4 && (
          <Step4FormulateContradiction
            onNext={(data: Record<string, unknown>) => handleStepNext(4, data)}
            onBack={handleStepBack}
            initialData={stepData.step4}
          />
        )}

        {devCurrentStep === 5 && (
          <Step5GenerateIdeas
            onNext={(data: Record<string, unknown>) => handleStepNext(5, data)}
            onBack={handleStepBack}
            initialData={stepData.step5}
          />
        )}

        {devCurrentStep === 6 && (
          <Step6MakeDecision
            onNext={(data: Record<string, unknown>) => handleStepNext(6, data)}
            onBack={handleStepBack}
            initialData={stepData.step6}
          />
        )}

        {devCurrentStep === 7 && <Step7Summary onBack={handleStepBack} />}
      </div>
    </div>
  );
};

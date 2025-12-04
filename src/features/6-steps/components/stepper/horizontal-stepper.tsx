import { cn } from '@/lib/utils';

interface Step {
  number: number;
  label: string;
}

interface HorizontalStepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export const HorizontalStepper = ({
  steps,
  currentStep,
  className,
}: HorizontalStepperProps) => {
  return (
    <div className={className}>
      <div className="flex justify-center gap-2">
        {steps.map((step) => {
          const isActive = currentStep === step.number;

          return (
            <div key={step.number}>
              <div
                className={cn(
                  'h-1 w-10 rounded-full transition-all duration-300',
                  isActive ? 'bg-secondary' : 'bg-muted',
                )}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

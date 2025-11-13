import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';

type Props = {
  step: number;
  goNext: () => void;
  goBack: () => void;
};

const StepPlaceholder: React.FC<Props> = ({ step, goNext, goBack }) => {
  return (
    <div className="rounded-md border p-6">
      <h3 className="font-semibold">Step {step} (placeholder)</h3>
      <p className="text-sm text-gray-600 mt-2">
        This is a placeholder for the next steps. You can continue implementing
        them similarly.
      </p>

      <div className="mt-6 flex justify-between border-t pt-6">
        <Button variant="outline" onClick={goBack}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={goNext}>
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default StepPlaceholder;

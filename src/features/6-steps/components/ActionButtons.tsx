import { ArrowLeft, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  onBack: () => void;
  onNext: () => void;
  disableNext?: boolean;
}

const ActionButtons = ({ onBack, onNext, disableNext }: ActionButtonsProps) => {
  return (
    <div className="flex justify-between">
      <Button variant="outline" onClick={onBack} size="lg">
        <ArrowLeft />
        Quay lại
      </Button>
      <Button onClick={onNext} disabled={disableNext} size="lg">
        Tiếp theo
        <ArrowRight />
      </Button>
    </div>
  );
};

export default ActionButtons;

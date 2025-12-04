import { ArrowLeft, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ActionButtonsProps {
  onBack?: () => void;
  onNext: () => void;
  disableNext?: boolean;
  hideBack?: boolean;
  nextLabel?: string;
}

const ActionButtons = ({
  onBack,
  onNext,
  disableNext,
  hideBack,
  nextLabel = 'Tiếp theo',
}: ActionButtonsProps) => {
  return (
    <div className={cn('flex justify-between mt-4', hideBack && 'justify-end')}>
      {!hideBack && (
        <Button variant="outline" onClick={onBack} size="lg">
          <ArrowLeft />
          Quay lại
        </Button>
      )}
      <Button onClick={onNext} disabled={disableNext} size="lg">
        {nextLabel}
        <ArrowRight />
      </Button>
    </div>
  );
};

export default ActionButtons;

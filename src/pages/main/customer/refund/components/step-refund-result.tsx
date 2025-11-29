import { useNavigate } from '@tanstack/react-router';
import { CheckCircle, Home, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { formatTrizilium } from '@/utils';

import type { Transaction } from '@/features/payment/transaction/types';
import type { DataTimestamp } from '@/types';

interface StepRefundResultProps {
  previewRefund: (Transaction & DataTimestamp) | null;
  onGoBack: () => void;
}

export const StepRefundResult = ({
  previewRefund,
  onGoBack,
}: StepRefundResultProps) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate({ to: '/' });
  };

  const handleNewRefund = () => {
    onGoBack();
  };

  return (
    <div className="space-y-8">
      {/* Success Message */}
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-green-600/20 rounded-full animate-pulse" />
            <CheckCircle className="h-20 w-20 text-green-600 relative" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
            Refund Successful!
          </h2>
          <p className="text-lg text-muted-foreground">
            Your refund has been processed successfully
          </p>
        </div>
      </div>

      {/* Quick Info Display */}
      <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg p-6 text-center space-y-3">
        <p className="text-sm text-muted-foreground">Refund Amount</p>
        <p className="text-3xl font-bold text-green-600">
          +{formatTrizilium(previewRefund?.amount || 0)}
        </p>
        <p className="text-xs text-muted-foreground pt-2">
          Refunded to your wallet
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <Button onClick={handleNewRefund} variant="outline" className="w-full">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Process Another Refund
        </Button>
        <Button
          onClick={handleGoHome}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          <Home className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </div>
    </div>
  );
};

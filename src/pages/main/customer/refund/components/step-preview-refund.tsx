import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import type { Transaction } from '@/features/payment/transaction/types';
import type { Subscription } from '@/features/subscription/types';
import type { DataTimestamp } from '@/types';

interface StepPreviewRefundProps {
  subscription: Subscription & DataTimestamp;
  previewRefund: (Transaction & DataTimestamp) | undefined;
  isLoading: boolean;
  isRefunding: boolean;
  onRefund: () => void;
  onGoBack: () => void;
}

export const StepPreviewRefund = ({
  subscription,
  previewRefund,
  isLoading,
  isRefunding,
  onRefund,
  onGoBack,
}: StepPreviewRefundProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Preview Refund</h2>
        <p className="text-muted-foreground">
          Review the refund details before confirming
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Please review the refund details carefully. Once confirmed, this
          action cannot be undone.
        </AlertDescription>
      </Alert>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      ) : (
        <div className="grid gap-6">
          {/* Subscription Details */}
          <Card>
            <CardHeader>
              <CardTitle>Subscription Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Package</p>
                  <p className="font-medium">{subscription.packageName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium">
                    <span className={'text-orange-600'}>
                      {subscription.status}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-medium">
                    {new Date(subscription.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">End Date</p>
                  <p className="font-medium">
                    {new Date(subscription.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Refund Details */}
          {previewRefund && (
            <Card>
              <CardHeader>
                <CardTitle>Refund Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Transaction ID
                    </p>
                    <p className="font-medium text-sm break-all">
                      {previewRefund.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Transaction Type
                    </p>
                    <div className="mt-1">
                      <Badge variant="secondary" className="capitalize">
                        {previewRefund.type?.toLowerCase() ?? 'N/A'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="font-medium text-green-600">
                      +{previewRefund.amount.toLocaleString()} VND
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <div className="mt-1">
                      <Badge
                        variant={
                          previewRefund.status === 'COMPLETED'
                            ? 'default'
                            : previewRefund.status === 'PENDING'
                              ? 'secondary'
                              : 'destructive'
                        }
                        className="capitalize"
                      >
                        {previewRefund.status?.toLowerCase() ?? 'N/A'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onGoBack}
              disabled={isRefunding}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
            <Button
              onClick={onRefund}
              disabled={isRefunding || !previewRefund}
              className="flex-1 gap-2"
            >
              {isRefunding && <Loader2 className="h-4 w-4 animate-spin" />}
              {isRefunding ? 'Processing Refund...' : 'Confirm Refund'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

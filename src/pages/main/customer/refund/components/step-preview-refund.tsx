import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/utils';

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
  const { t } = useTranslation('pages.refund');

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">{t('step_preview.title')}</h2>
        <p className="text-muted-foreground">{t('step_preview.description')}</p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{t('step_preview.warning')}</AlertDescription>
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
              <CardTitle>{t('step_preview.subscription_details')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t('step_preview.package')}
                  </p>
                  <p className="font-medium">{subscription.packageName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t('step_preview.status')}
                  </p>
                  <p className="font-medium">
                    <span className={'text-orange-600'}>
                      {subscription.status}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t('step_preview.start_date')}
                  </p>
                  <p className="font-medium">
                    {formatDate(new Date(subscription.startDate))}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t('step_preview.end_date')}
                  </p>
                  <p className="font-medium">
                    {formatDate(new Date(subscription.endDate))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Refund Details */}
          {previewRefund && (
            <Card>
              <CardHeader>
                <CardTitle>{t('step_preview.refund_details')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t('step_preview.transaction_id')}
                    </p>
                    <p className="font-medium text-sm break-all">
                      {previewRefund.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t('step_preview.transaction_type')}
                    </p>
                    <div className="mt-1">
                      <Badge variant="secondary" className="capitalize">
                        {previewRefund.type?.toLowerCase() ?? 'N/A'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t('step_preview.amount')}
                    </p>
                    <p className="font-medium text-green-600">
                      +{previewRefund.amount.toLocaleString()} VND
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t('step_preview.status')}
                    </p>
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
              {t('step_preview.go_back')}
            </Button>
            <Button
              onClick={onRefund}
              disabled={isRefunding || !previewRefund}
              className="flex-1 gap-2"
            >
              {isRefunding && <Loader2 className="h-4 w-4 animate-spin" />}
              {isRefunding
                ? t('step_preview.processing')
                : t('step_preview.confirm_button')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

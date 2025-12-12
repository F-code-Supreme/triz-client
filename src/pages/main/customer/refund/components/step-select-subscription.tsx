import { AlertCircle, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  SubscriptionStatus,
  type Subscription,
} from '@/features/subscription/types';

import type { DataTimestamp } from '@/types';

interface StepSelectSubscriptionProps {
  subscriptions: Array<Subscription & DataTimestamp>;
  isLoading: boolean;
  onSelectSubscription: (subscription: Subscription & DataTimestamp) => void;
}

export const StepSelectSubscription = ({
  subscriptions,
  isLoading,
  onSelectSubscription,
}: StepSelectSubscriptionProps) => {
  const { t } = useTranslation('pages.refund');
  // Filter for active and expired subscriptions only (can refund these)
  const refundableSubscriptions = subscriptions.filter((sub) => {
    const status = sub.status;
    return status === SubscriptionStatus.CANCELED;
  });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">{t('step_select.title')}</h2>
        <p className="text-muted-foreground">{t('step_select.description')}</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton key={idx} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      ) : refundableSubscriptions.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{t('step_select.no_eligible')}</AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-4">
          {refundableSubscriptions.map((subscription) => (
            <Card
              key={subscription.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      {subscription.packageName}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('step_select.subscription_id')}: {subscription.id}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">
                      {t('step_select.start_date')}
                    </p>
                    <p className="font-medium">
                      {new Date(subscription.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">
                      {t('step_select.end_date')}
                    </p>
                    <p className="font-medium">
                      {new Date(subscription.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">
                      {t('step_select.status')}
                    </p>
                    <p className="font-medium">
                      <span className={'text-orange-600'}>
                        {subscription.status}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">
                      {t('step_select.daily_tokens')}
                    </p>
                    <p className="font-medium">
                      {subscription.packageChatTokenPerDay}/day
                    </p>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={() => onSelectSubscription(subscription)}
                >
                  {t('step_select.select_button')}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

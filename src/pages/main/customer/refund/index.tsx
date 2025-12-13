import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import useAuth from '@/features/auth/hooks/use-auth';
import { useGetPreviewRefundTransactionQuery } from '@/features/payment/transaction/services/queries';
import { useRefundSubscriptionMutation } from '@/features/subscription/services/mutations';
import { useGetSubscriptionsByUserQuery } from '@/features/subscription/services/queries';
import { DefaultLayout } from '@/layouts/default-layout';

import { StepPreviewRefund } from './components/step-preview-refund';
import { StepRefundResult } from './components/step-refund-result';
import { StepSelectSubscription } from './components/step-select-subscription';

import type { Subscription } from '@/features/subscription/types';
import type { DataTimestamp } from '@/types';
import type { PaginationState, SortingState } from '@tanstack/react-table';

type StepType = 1 | 2 | 3;

// eslint-disable-next-line sonarjs/cognitive-complexity
const RefundPage = () => {
  const { t } = useTranslation('pages.refund');
  const { user } = useAuth();
  const [step, setStep] = useState<StepType>(1);
  const [selectedSubscription, setSelectedSubscription] = useState<
    (Subscription & DataTimestamp) | null
  >(null);

  // Pagination and sorting for subscriptions
  const [pagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 100,
  });
  const [sorting] = useState<SortingState>([]);

  // Fetch subscriptions
  const { data: subscriptionsData, isLoading: isLoadingSubscriptions } =
    useGetSubscriptionsByUserQuery(pagination, sorting, user?.id);

  // Fetch preview refund for selected subscription
  const { data: previewRefund, isLoading: isLoadingPreview } =
    useGetPreviewRefundTransactionQuery(selectedSubscription?.id, user?.id);

  // Refund mutation
  const { mutate: refundSubscription, isPending: isRefunding } =
    useRefundSubscriptionMutation();

  // Get subscriptions from response
  const subscriptions = useMemo(
    () => subscriptionsData?.content || [],
    [subscriptionsData],
  );

  // Handle subscription selection
  const handleSelectSubscription = (
    subscription: Subscription & DataTimestamp,
  ) => {
    setSelectedSubscription(subscription);
    setStep(2);
  };

  // Handle refund confirmation
  const handleRefund = () => {
    if (!selectedSubscription || !user) {
      toast.error(t('errors.missing_info'));
      return;
    }

    const transactionId = previewRefund?.id;
    if (!transactionId) {
      toast.error(t('errors.no_transaction'));
      return;
    }

    refundSubscription(
      { userId: user.id, transactionId },
      {
        onSuccess: () => {
          setStep(3);
          toast.success(t('step_result.title'));
        },
        onError: (error: unknown) => {
          const err = error as {
            response?: { data?: { message?: string } };
          };
          const errorMessage =
            err?.response?.data?.message || t('errors.refund_failed');
          toast.error(errorMessage);
        },
      },
    );
  };

  // Handle going back
  const handleGoBack = () => {
    if (step === 2) {
      setSelectedSubscription(null);
      setStep(1);
    } else if (step === 3) {
      setSelectedSubscription(null);
      setStep(1);
    }
  };

  return (
    <DefaultLayout meta={{ title: t('page_meta_title') }}>
      <div className="flex flex-col gap-8 p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground mt-2">{t('description')}</p>
        </div>

        {/* Step Content */}
        <div className="min-h-96">
          {step === 1 && (
            <StepSelectSubscription
              subscriptions={subscriptions}
              isLoading={isLoadingSubscriptions}
              onSelectSubscription={handleSelectSubscription}
            />
          )}

          {step === 2 && selectedSubscription && (
            <StepPreviewRefund
              subscription={selectedSubscription}
              previewRefund={previewRefund}
              isLoading={isLoadingPreview}
              isRefunding={isRefunding}
              onRefund={handleRefund}
              onGoBack={handleGoBack}
            />
          )}

          {step === 3 && previewRefund && (
            <StepRefundResult
              previewRefund={previewRefund}
              onGoBack={handleGoBack}
            />
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default RefundPage;

import { format } from 'date-fns';
import { Eye, MoreHorizontal, RefreshCw, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import useAuth from '@/features/auth/hooks/use-auth';

import { useCancelSubscriptionMutation } from '../services/mutations';
import { SubscriptionStatus, type Subscription } from '../types';

import type { DataTimestamp } from '@/types';

type SubscriptionWithTimestamp = Subscription & DataTimestamp;

interface SubscriptionsDataTableRowActionsProps {
  row: {
    original: SubscriptionWithTimestamp;
  };
  onAutoRenewalToggle?: (subscription: SubscriptionWithTimestamp) => void;
}

export const SubscriptionsDataTableRowActions = ({
  row,
  onAutoRenewalToggle,
}: SubscriptionsDataTableRowActionsProps) => {
  const { t } = useTranslation('pages.subscription');
  const subscription = row.original;
  const { user } = useAuth();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const { mutate: cancelSubscription, isPending: isCanceling } =
    useCancelSubscriptionMutation();

  const isActive = subscription.status === SubscriptionStatus.ACTIVE;

  const handleCancel = () => {
    if (!user) return;
    cancelSubscription(
      { userId: user.id, subscriptionId: subscription.id },
      {
        onSuccess: () => {
          setIsCancelDialogOpen(false);
          toast.success(t('cancel_dialog.success'));
        },
        onError: (error) => {
          toast.error((error as Error).message || t('cancel_dialog.error'));
        },
      },
    );
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            {t('subscription_history.columns.actions')}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsPreviewOpen(true)}>
            <Eye className="mr-2 h-4 w-4" />
            {t('subscription_history.actions.view_details')}
          </DropdownMenuItem>
          {isActive && onAutoRenewalToggle && (
            <DropdownMenuItem
              onClick={() => {
                onAutoRenewalToggle(subscription);
              }}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              {subscription.autoRenew
                ? t('subscription_history.actions.disable_auto_renewal')
                : t('subscription_history.actions.enable_auto_renewal')}
            </DropdownMenuItem>
          )}
          {isActive && (
            <DropdownMenuItem
              onClick={() => setIsCancelDialogOpen(true)}
              className="text-red-600 dark:text-red-400"
            >
              <X className="mr-2 h-4 w-4" />
              {t('subscription_history.actions.cancel_subscription')}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Sheet open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{t('subscription_history.details.title')}</SheetTitle>
            <SheetDescription>{subscription.id}</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 pt-6">
            <div>
              <p className="text-sm text-muted-foreground">
                {t('subscription_history.details.package')}
              </p>
              <p className="font-medium">{subscription.packageName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t('subscription_history.details.status')}
              </p>
              <Badge className="mt-1">{subscription.status}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t('subscription_history.details.start_date')}
              </p>
              <p className="font-medium">
                {format(new Date(subscription.startDate), 'MMM dd, yyyy HH:mm')}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t('subscription_history.details.end_date')}
              </p>
              <p className="font-medium">
                {format(new Date(subscription.endDate), 'MMM dd, yyyy HH:mm')}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t('subscription_history.details.tokens_per_day_remaining')}
              </p>
              <p className="font-medium">
                {subscription.tokensPerDayRemaining}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t('subscription_history.details.auto_renewal')}
              </p>
              <Badge variant={subscription.autoRenew ? 'default' : 'outline'}>
                {subscription.autoRenew
                  ? t('active_subscription.enabled')
                  : t('active_subscription.disabled')}
              </Badge>
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-6">
            <SheetClose asChild>
              <Button type="button" variant="outline">
                {t('subscription_history.details.close')}
              </Button>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('cancel_dialog.title')}</DialogTitle>
            <DialogDescription>
              {t('cancel_dialog.description')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCancelDialogOpen(false)}
              disabled={isCanceling}
            >
              {t('cancel_dialog.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={isCanceling}
            >
              {isCanceling
                ? t('cancel_dialog.canceling')
                : t('cancel_dialog.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

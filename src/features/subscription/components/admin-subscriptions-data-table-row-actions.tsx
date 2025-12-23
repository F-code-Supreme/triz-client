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
import { formatDate } from '@/utils';

import { useCancelSubscriptionMutation } from '../services/mutations';

import type { Subscription } from '../types';
import type { DataTimestamp } from '@/types';

type SubscriptionWithTimestamp = Subscription & DataTimestamp;

interface AdminSubscriptionsDataTableRowActionsProps {
  row: {
    original: SubscriptionWithTimestamp;
  };
  onAutoRenewalToggle?: (subscription: SubscriptionWithTimestamp) => void;
}

export const AdminSubscriptionsDataTableRowActions = ({
  row,
  onAutoRenewalToggle,
}: AdminSubscriptionsDataTableRowActionsProps) => {
  const { t } = useTranslation('pages.admin');
  const subscription = row.original;
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const { mutate: cancelSubscription, isPending: isCancelingSubscription } =
    useCancelSubscriptionMutation();

  const isActive = subscription.status === 'ACTIVE';

  const handleCancel = () => {
    cancelSubscription(
      { userId: subscription.userId, subscriptionId: subscription.id },
      {
        onSuccess: () => {
          setIsCancelDialogOpen(false);
          toast.success(t('subscriptions.toast.cancel_success'));
        },
        onError: (error) => {
          toast.error(
            (error as Error).message || t('subscriptions.toast.cancel_error'),
          );
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
            {t('subscriptions.columns.actions')}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsPreviewOpen(true)}>
            <Eye className="mr-2 h-4 w-4" />
            {t('subscriptions.actions.view_details')}
          </DropdownMenuItem>
          {isActive && onAutoRenewalToggle && (
            <DropdownMenuItem
              onClick={() => {
                onAutoRenewalToggle(subscription);
              }}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              {subscription.autoRenew
                ? t('subscriptions.actions.disable_auto_renewal')
                : t('subscriptions.actions.enable_auto_renewal')}
            </DropdownMenuItem>
          )}
          {isActive && (
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => setIsCancelDialogOpen(true)}
            >
              <X className="mr-2 h-4 w-4" />
              {t('subscriptions.actions.cancel_subscription')}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Sheet open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{t('subscriptions.details.title')}</SheetTitle>
            <SheetDescription>{subscription.id}</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 pt-6">
            <div>
              <p className="text-sm text-muted-foreground">
                {t('subscriptions.details.package')}
              </p>
              <p className="font-medium">{subscription.packageName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t('subscriptions.details.user_id')}
              </p>
              <p className="font-mono text-sm">{subscription.userId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t('subscriptions.details.status')}
              </p>
              <Badge className="mt-1">{subscription.status}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t('subscriptions.details.start_date')}
              </p>
              <p className="font-medium">
                {formatDate(new Date(subscription.startDate))}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t('subscriptions.details.end_date')}
              </p>
              <p className="font-medium">
                {formatDate(new Date(subscription.endDate))}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t('subscriptions.details.tokens_per_day_remaining')}
              </p>
              <p className="font-medium">
                {subscription.tokensPerDayRemaining}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t('subscriptions.details.auto_renewal')}
              </p>
              <Badge variant={subscription.autoRenew ? 'default' : 'outline'}>
                {subscription.autoRenew
                  ? t('subscriptions.status.enabled')
                  : t('subscriptions.status.disabled')}
              </Badge>
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-6">
            <SheetClose asChild>
              <Button type="button" variant="outline">
                {t('subscriptions.details.close')}
              </Button>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('subscriptions.cancel_dialog.title')}</DialogTitle>
            <DialogDescription>
              {t('subscriptions.cancel_dialog.message')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCancelDialogOpen(false)}
              disabled={isCancelingSubscription}
            >
              {t('subscriptions.cancel_dialog.keep')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={isCancelingSubscription}
            >
              {isCancelingSubscription
                ? t('subscriptions.cancel_dialog.cancelling')
                : t('subscriptions.cancel_dialog.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

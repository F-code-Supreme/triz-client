import { format } from 'date-fns';
import { Eye, MoreHorizontal, RefreshCw } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  const subscription = row.original;
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const isExpiredOrCanceled =
    subscription.status === 'EXPIRED' || subscription.status === 'CANCELED';

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
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsPreviewOpen(true)}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          {!isExpiredOrCanceled && onAutoRenewalToggle && (
            <DropdownMenuItem
              onClick={() => {
                onAutoRenewalToggle(subscription);
              }}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              {subscription.autoRenew ? 'Disable' : 'Enable'} Auto Renewal
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Sheet open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Subscription Details</SheetTitle>
            <SheetDescription>{subscription.id}</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Package</p>
              <p className="font-medium">{subscription.packageName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">User ID</p>
              <p className="font-mono text-sm">{subscription.userId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className="mt-1">{subscription.status}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Start Date</p>
              <p className="font-medium">
                {format(new Date(subscription.startDate), 'MMM dd, yyyy HH:mm')}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">End Date</p>
              <p className="font-medium">
                {format(new Date(subscription.endDate), 'MMM dd, yyyy HH:mm')}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Tokens Per Day Remaining
              </p>
              <p className="font-medium">
                {subscription.tokensPerDayRemaining}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Auto Renewal</p>
              <Badge variant={subscription.autoRenew ? 'default' : 'outline'}>
                {subscription.autoRenew ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-6">
            <SheetClose asChild>
              <Button type="button" variant="outline">
                Close
              </Button>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

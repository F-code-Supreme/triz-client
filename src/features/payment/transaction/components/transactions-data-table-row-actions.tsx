import { MoreHorizontal, Eye, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

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
import { Role } from '@/features/auth/types';

import {
  useCancelTransactionByUserMutation,
  useCancelTransactionMutation,
} from '../services/mutations';

import type { Transaction } from '../types';
import type { DataTimestamp } from '@/types';

type TransactionWithTimestamp = Transaction & DataTimestamp;

interface TransactionsDataTableRowActionsProps {
  row: {
    original: TransactionWithTimestamp;
  };
}

export const TransactionsDataTableRowActions = ({
  row,
}: TransactionsDataTableRowActionsProps) => {
  const transaction = row.original;
  const { user, hasRole } = useAuth();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const { mutate: cancelByUser, isPending: isCancelingByUser } =
    useCancelTransactionByUserMutation();
  const { mutate: cancelByAdmin, isPending: isCancelingByAdmin } =
    useCancelTransactionMutation();

  const isCanceling = isCancelingByUser || isCancelingByAdmin;
  const canCancel = transaction.status === 'PENDING';

  const handleCancel = () => {
    if (!hasRole(Role.ADMIN)) {
      if (!user) return;

      cancelByUser(
        { userId: user.id, transactionId: transaction.id },
        {
          onSuccess: () => {
            setIsCancelDialogOpen(false);
            toast.success('Transaction cancelled successfully');
          },
          onError: (error) => {
            toast.error(
              (error as Error).message || 'Failed to cancel transaction',
            );
          },
        },
      );
    } else {
      cancelByAdmin(
        { transactionId: transaction.id },
        {
          onSuccess: () => {
            setIsCancelDialogOpen(false);
            toast.success('Transaction cancelled successfully');
          },
          onError: (error) => {
            toast.error(
              (error as Error).message || 'Failed to cancel transaction',
            );
          },
        },
      );
    }
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
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsPreviewOpen(true)}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          {canCancel && (
            <DropdownMenuItem
              onClick={() => setIsCancelDialogOpen(true)}
              className="text-red-600 dark:text-red-400"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel Transaction
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Sheet open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Transaction Details</SheetTitle>
            <SheetDescription>
              Order Code: {transaction.orderCode}
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Type</p>
              <p className="font-medium">{transaction.type}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="font-medium">
                {transaction.amount.toLocaleString()} VND
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Provider</p>
              <p className="font-medium capitalize">
                {transaction.provider?.toLowerCase() || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Provider Tx Ref</p>
              <p className="font-medium capitalize">
                {transaction.providerTxRef?.toLowerCase() || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium">{transaction.status}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">
                {new Date(transaction.createdAt).toLocaleString()}
              </p>
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

      {/* Cancel Confirmation Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Transaction</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this transaction? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCancelDialogOpen(false)}
              disabled={isCanceling}
            >
              No, Keep It
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={isCanceling}
            >
              {isCanceling ? 'Cancelling...' : 'Yes, Cancel Transaction'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

import { MoreHorizontal, Eye, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('pages.admin');
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            toast.success(t('transactions.toast.cancel_success' as any));
          },
          onError: (error) => {
            toast.error(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (error as Error).message ||
                t('transactions.toast.cancel_error' as any),
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            toast.success(t('transactions.toast.cancel_success' as any));
          },
          onError: (error) => {
            toast.error(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (error as Error).message ||
                t('transactions.toast.cancel_error' as any),
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
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <DropdownMenuLabel>
            {t('transactions.columns.actions' as any)}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsPreviewOpen(true)}>
            <Eye className="mr-2 h-4 w-4" />
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {t('transactions.actions.view_details' as any)}
          </DropdownMenuItem>
          {canCancel && (
            <DropdownMenuItem
              onClick={() => setIsCancelDialogOpen(true)}
              className="text-red-600 dark:text-red-400"
            >
              <X className="mr-2 h-4 w-4" />
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {t('transactions.actions.cancel_transaction' as any)}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Sheet open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <SheetContent>
          <SheetHeader>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <SheetTitle>{t('transactions.details.title' as any)}</SheetTitle>
            <SheetDescription>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {t('transactions.details.order_code' as any)}:{' '}
              {transaction.orderCode}
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 pt-6">
            <div>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <p className="text-sm text-muted-foreground">
                {t('transactions.details.type' as any)}
              </p>
              <p className="font-medium">{transaction.type}</p>
            </div>
            <div>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <p className="text-sm text-muted-foreground">
                {t('transactions.details.amount' as any)}
              </p>
              <p className="font-medium">
                {transaction.amount.toLocaleString()} VND
              </p>
            </div>
            <div>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <p className="text-sm text-muted-foreground">
                {t('transactions.details.provider' as any)}
              </p>
              <p className="font-medium capitalize">
                {transaction.provider?.toLowerCase() || 'N/A'}
              </p>
            </div>
            <div>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <p className="text-sm text-muted-foreground">
                {t('transactions.details.provider_tx_ref' as any)}
              </p>
              <p className="font-medium capitalize">
                {transaction.providerTxRef?.toLowerCase() || 'N/A'}
              </p>
            </div>
            <div>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <p className="text-sm text-muted-foreground">
                {t('transactions.details.status' as any)}
              </p>
              <p className="font-medium">{transaction.status}</p>
            </div>
            <div>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <p className="text-sm text-muted-foreground">
                {t('transactions.details.date' as any)}
              </p>
              <p className="font-medium">
                {new Date(transaction.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-6">
            <SheetClose asChild>
              <Button type="button" variant="outline">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {t('transactions.details.close' as any)}
              </Button>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <DialogTitle>
              {t('transactions.cancel_dialog.title' as any)}
            </DialogTitle>
            <DialogDescription>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {t('transactions.cancel_dialog.message' as any)}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCancelDialogOpen(false)}
              disabled={isCanceling}
            >
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {t('transactions.cancel_dialog.keep' as any)}
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={isCanceling}
            >
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {isCanceling
                ? t('transactions.cancel_dialog.cancelling' as any)
                : t('transactions.cancel_dialog.confirm' as any)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

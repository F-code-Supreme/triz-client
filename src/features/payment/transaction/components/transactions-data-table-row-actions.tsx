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
  namespace?: 'pages.admin' | 'pages.wallet';
}

export const TransactionsDataTableRowActions = ({
  row,
  namespace = 'pages.admin',
}: TransactionsDataTableRowActionsProps) => {
  const transaction = row.original;
  const { t } = useTranslation(namespace);
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
            toast.success(t('transactions.toast.cancel_success'));
          },
          onError: (error) => {
            toast.error(
              (error as Error).message || t('transactions.toast.cancel_error'),
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
            toast.success(t('transactions.toast.cancel_success'));
          },
          onError: (error) => {
            toast.error(
              (error as Error).message || t('transactions.toast.cancel_error'),
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
          <DropdownMenuLabel>
            {t('transactions.columns.actions')}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsPreviewOpen(true)}>
            <Eye className="mr-2 h-4 w-4" />
            {t('transactions.actions.view_details')}
          </DropdownMenuItem>
          {canCancel && (
            <DropdownMenuItem
              onClick={() => setIsCancelDialogOpen(true)}
              className="text-red-600 dark:text-red-400"
            >
              <X className="mr-2 h-4 w-4" />
              {t('transactions.actions.cancel_transaction')}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Sheet open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{t('transactions.details.title')}</SheetTitle>
            <SheetDescription>
              {t('transactions.details.order_code')}: {transaction.orderCode}
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 pt-6">
            <div>
              <p className="text-sm text-muted-foreground">
                {t('transactions.details.type')}
              </p>
              <p className="font-medium">{transaction.type}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t('transactions.details.amount')}
              </p>
              <p className="font-medium">
                {transaction.amount.toLocaleString()} VND
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t('transactions.details.provider')}
              </p>
              <p className="font-medium capitalize">
                {transaction.provider?.toLowerCase() || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t('transactions.details.provider_tx_ref')}
              </p>
              <p className="font-medium capitalize">
                {transaction.providerTxRef?.toLowerCase() || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t('transactions.details.status')}
              </p>
              <p className="font-medium">{transaction.status}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t('transactions.details.date')}
              </p>
              <p className="font-medium">
                {new Date(transaction.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-6">
            <SheetClose asChild>
              <Button type="button" variant="outline">
                {t('transactions.details.close')}
              </Button>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('transactions.cancel_dialog.title')}</DialogTitle>
            <DialogDescription>
              {t('transactions.cancel_dialog.message')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCancelDialogOpen(false)}
              disabled={isCanceling}
            >
              {t('transactions.cancel_dialog.keep')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={isCanceling}
            >
              {isCanceling
                ? t('transactions.cancel_dialog.cancelling')
                : t('transactions.cancel_dialog.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

import { MoreHorizontal, Eye } from 'lucide-react';
import { useState } from 'react';

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
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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
    </>
  );
};

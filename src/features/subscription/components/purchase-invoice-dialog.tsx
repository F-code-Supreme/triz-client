import { useNavigate } from '@tanstack/react-router';
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  ShoppingCart,
  Wallet,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatNumber } from '@/utils';

import { usePurchasePackageMutation } from '../services/mutations';

import type { Package } from '@/features/packages/types';

interface PurchaseInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  package: Package | null;
  walletBalance: number;
}

export const PurchaseInvoiceDialog: React.FC<PurchaseInvoiceDialogProps> = ({
  open,
  onOpenChange,
  package: pkg,
  walletBalance,
}) => {
  const navigate = useNavigate();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { mutate: purchasePackage, isPending } = usePurchasePackageMutation();

  if (!pkg) return null;

  const priceInTokens = pkg.priceInTokens;
  const sufficiendBalance = walletBalance >= priceInTokens;

  const handlePurchase = () => {
    if (!sufficiendBalance) {
      toast.error('Insufficient wallet balance');
      return;
    }

    if (!agreedToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    purchasePackage(
      { packageId: pkg.id, autoRenew: false },
      {
        onSuccess: () => {
          toast.success('Package purchased successfully!');
          onOpenChange(false);
          setAgreedToTerms(false);
        },
        onError: (error: unknown) => {
          const err = error as { response?: { data?: { message?: string } } };
          const errorMessage =
            err?.response?.data?.message || 'Failed to purchase package';
          toast.error(errorMessage);
        },
      },
    );
  };

  const handleTopup = () => {
    onOpenChange(false);
    navigate({ to: '/wallet' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Purchase Invoice</DialogTitle>
          <DialogDescription>
            Review your purchase details before confirming
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Package Details */}
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{pkg.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Access duration: {pkg.durationInDays} days
                </p>
              </div>
              <Badge className="bg-primary">Package</Badge>
            </div>
          </div>

          {/* Price Breakdown Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead className="font-semibold">Description</TableHead>
                  <TableHead className="text-right font-semibold">
                    Amount
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="py-3">
                    <div>
                      <p className="font-medium">{pkg.name} Package</p>
                      <p className="text-sm text-muted-foreground">
                        {pkg.durationInDays} days access
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right py-3">
                    <p className="font-semibold">
                      {formatNumber(priceInTokens)} tokens
                    </p>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            {/* Total */}
            <div className="bg-muted p-4 flex justify-between items-center border-t">
              <p className="font-semibold text-lg">Total</p>
              <p className="text-2xl font-bold">
                {formatNumber(priceInTokens)} tokens
              </p>
            </div>
          </div>

          {/* Wallet Balance */}
          <div
            className={`border rounded-lg p-4 flex items-start gap-3 ${
              sufficiendBalance
                ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800'
                : 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800'
            }`}
          >
            <Wallet
              className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                sufficiendBalance
                  ? 'text-green-600 dark:text-green-500'
                  : 'text-red-600 dark:text-red-500'
              }`}
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-medium">Wallet Balance</p>
                <p
                  className={`text-lg font-semibold ${
                    sufficiendBalance
                      ? 'text-green-600 dark:text-green-500'
                      : 'text-red-600 dark:text-red-500'
                  }`}
                >
                  {formatNumber(walletBalance)} tokens
                </p>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {sufficiendBalance ? (
                  <span className="flex items-center gap-1 text-green-600 dark:text-green-500">
                    <CheckCircle className="h-4 w-4" />
                    Sufficient balance to complete this purchase
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-red-600 dark:text-red-500">
                    <AlertCircle className="h-4 w-4" />
                    Insufficient balance. You need{' '}
                    {formatNumber(priceInTokens - walletBalance)} more tokens
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Insufficient Balance Warning */}
          {!sufficiendBalance && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your wallet balance is insufficient to complete this purchase.
                Please top up your wallet first.
              </AlertDescription>
            </Alert>
          )}

          {/* Terms & Conditions */}
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1"
                disabled={!sufficiendBalance}
              />
              <label
                htmlFor="terms"
                className="text-sm leading-relaxed cursor-pointer flex-1"
              >
                I agree to the{' '}
                <span className="font-medium">Terms and Conditions</span> and
                acknowledge that:
                <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                  <li>
                    This purchase grants me {pkg.durationInDays} days of access
                  </li>
                  <li>
                    I will receive {formatNumber(pkg.chatTokenPerDay)} tokens
                    daily
                  </li>
                  <li>Tokens are non-refundable once consumed</li>
                  <li>The subscription cannot be transferred</li>
                </ul>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                setAgreedToTerms(false);
              }}
              disabled={isPending}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>

            {!sufficiendBalance ? (
              <Button onClick={handleTopup} className="gap-2">
                <Wallet className="h-4 w-4" />
                Go to Wallet
              </Button>
            ) : (
              <Button
                onClick={handlePurchase}
                disabled={!agreedToTerms || isPending}
                className="gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    Confirm Purchase
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

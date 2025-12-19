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
import { useTranslation } from 'react-i18next';
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
import { formatTrizilium, formatDailyTrizilium } from '@/utils';

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
  const { t } = useTranslation('components');
  const navigate = useNavigate();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { mutate: purchasePackage, isPending } = usePurchasePackageMutation();

  if (!pkg) return null;

  const priceInTokens = pkg.priceInTokens;
  const sufficiendBalance = walletBalance >= priceInTokens;

  const handlePurchase = () => {
    if (!sufficiendBalance) {
      toast.error(t('purchase_invoice_dialog.insufficient_balance_error'));
      return;
    }

    if (!agreedToTerms) {
      toast.error(t('purchase_invoice_dialog.agree_terms_error'));
      return;
    }

    purchasePackage(
      { packageId: pkg.id, autoRenew: false },
      {
        onSuccess: () => {
          toast.success(t('purchase_invoice_dialog.purchase_success'));
          onOpenChange(false);
          setAgreedToTerms(false);
        },
        onError: (error: unknown) => {
          const err = error as { response?: { data?: { message?: string } } };
          const errorMessage =
            err?.response?.data?.message ||
            t('purchase_invoice_dialog.purchase_failed_error');
          toast.error(errorMessage);
        },
      },
    );
  };

  const handleTopup = () => {
    onOpenChange(false);
    const neededAmount = priceInTokens - walletBalance;
    navigate({
      to: '/wallet',
      search: { topup: 'open', amount: neededAmount },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('purchase_invoice_dialog.title')}</DialogTitle>
          <DialogDescription>
            {t('purchase_invoice_dialog.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Package Details */}
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{pkg.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('purchase_invoice_dialog.access_duration', {
                    days: pkg.durationInDays,
                  })}
                </p>
              </div>
              <Badge className="bg-primary">
                {t('purchase_invoice_dialog.package_badge')}
              </Badge>
            </div>
          </div>

          {/* Price Breakdown Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead className="font-semibold">
                    {t('purchase_invoice_dialog.table_description')}
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    {t('purchase_invoice_dialog.table_amount')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="py-3">
                    <div>
                      <p className="font-medium">
                        {t('purchase_invoice_dialog.package_name', {
                          name: pkg.name,
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t('purchase_invoice_dialog.days_access', {
                          days: pkg.durationInDays,
                        })}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right py-3">
                    <p className="font-semibold">
                      {formatTrizilium(priceInTokens)}
                    </p>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            {/* Total */}
            <div className="bg-muted p-4 flex justify-between items-center border-t">
              <p className="font-semibold text-lg">
                {t('purchase_invoice_dialog.total')}
              </p>
              <p className="text-2xl font-bold">
                {formatTrizilium(priceInTokens)}
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
                <p className="font-medium">
                  {t('purchase_invoice_dialog.wallet_balance')}
                </p>
                <p
                  className={`text-lg font-semibold ${
                    sufficiendBalance
                      ? 'text-green-600 dark:text-green-500'
                      : 'text-red-600 dark:text-red-500'
                  }`}
                >
                  {formatTrizilium(walletBalance)}
                </p>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {sufficiendBalance ? (
                  <span className="flex items-center gap-1 text-green-600 dark:text-green-500">
                    <CheckCircle className="h-4 w-4" />
                    {t('purchase_invoice_dialog.sufficient_balance')}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-red-600 dark:text-red-500">
                    <AlertCircle className="h-4 w-4" />
                    {t('purchase_invoice_dialog.insufficient_balance', {
                      amount: formatTrizilium(priceInTokens - walletBalance),
                    })}
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
                {t('purchase_invoice_dialog.insufficient_balance_alert')}
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
                {t('purchase_invoice_dialog.terms_checkbox').split('<bold>')[0]}
                <span className="font-medium">
                  {
                    t('purchase_invoice_dialog.terms_checkbox')
                      .split('<bold>')[1]
                      .split('</bold>')[0]
                  }
                </span>
                {
                  t('purchase_invoice_dialog.terms_checkbox').split(
                    '</bold>',
                  )[1]
                }
                <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                  <li>
                    {t('purchase_invoice_dialog.terms_duration', {
                      days: pkg.durationInDays,
                    })}
                  </li>
                  <li>
                    {t('purchase_invoice_dialog.terms_tokens', {
                      tokens: formatDailyTrizilium(pkg.chatTokenPerDay, {
                        shortForm: true,
                      }),
                    })}
                  </li>
                  <li>{t('purchase_invoice_dialog.terms_non_refundable')}</li>
                  <li>{t('purchase_invoice_dialog.terms_non_transferable')}</li>
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
              {t('purchase_invoice_dialog.cancel_button')}
            </Button>

            {!sufficiendBalance ? (
              <Button onClick={handleTopup} className="gap-2">
                <Wallet className="h-4 w-4" />
                {t('purchase_invoice_dialog.go_to_wallet_button')}
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
                    {t('purchase_invoice_dialog.processing_button')}
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    {t('purchase_invoice_dialog.confirm_purchase_button')}
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

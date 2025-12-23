import { useNavigate } from '@tanstack/react-router';
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  MessageSquare,
  Wallet,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { Alert, AlertDescription } from '@/components/ui/alert';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { REVIEW_REQUEST_FEE } from '@/constants';
import { formatTrizilium } from '@/utils';

import { useCreateRootReviewMutation } from '../services/mutations';

interface ReviewRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  journalId: string | null;
  journalTitle?: string;
  walletBalance: number;
}

export const ReviewRequestDialog: React.FC<ReviewRequestDialogProps> = ({
  open,
  onOpenChange,
  journalId,
  journalTitle = 'Nhật ký',
  walletBalance,
}) => {
  const { t } = useTranslation('components');
  const navigate = useNavigate();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [reviewContent, setReviewContent] = useState('');
  const { mutate: createReview, isPending } = useCreateRootReviewMutation();

  if (!journalId) return null;

  const sufficientBalance = walletBalance >= REVIEW_REQUEST_FEE;

  const handleCreateReview = () => {
    if (!sufficientBalance) {
      toast.error(t('review_request_dialog.insufficient_balance_error'));
      return;
    }

    if (!agreedToTerms) {
      toast.error(t('review_request_dialog.agree_terms_error'));
      return;
    }

    if (!reviewContent.trim()) {
      toast.error(t('review_request_dialog.empty_content_error'));
      return;
    }

    createReview(
      { problemId: journalId, content: reviewContent.trim() },
      {
        onSuccess: () => {
          toast.success(t('review_request_dialog.request_success'));
          onOpenChange(false);
          setAgreedToTerms(false);
          setReviewContent('');
        },
        onError: (error: unknown) => {
          const err = error as { response?: { data?: { message?: string } } };
          const errorMessage =
            err?.response?.data?.message ||
            t('review_request_dialog.request_failed_error');
          toast.error(errorMessage);
        },
      },
    );
  };

  const handleTopup = () => {
    onOpenChange(false);
    const neededAmount = REVIEW_REQUEST_FEE - walletBalance;
    navigate({
      to: '/wallet',
      search: { topup: 'open', amount: neededAmount },
    });
  };

  const handleClose = () => {
    onOpenChange(false);
    setAgreedToTerms(false);
    setReviewContent('');
  };

  // Parse terms checkbox text
  const termsText = t('review_request_dialog.terms_checkbox');
  const [termsStart, termsRest] = termsText.split('<bold>');
  const [termsBold, termsEnd] = (termsRest || '').split('</bold>');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('review_request_dialog.title')}</DialogTitle>
          <DialogDescription>
            {t('review_request_dialog.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Journal Details */}
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{journalTitle}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('review_request_dialog.journal_label')}
                </p>
              </div>
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
          </div>

          {/* Review Content */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                {t('review_request_dialog.content_label')}
              </label>
              <span className="text-xs text-gray-400">
                {reviewContent.length}/2000
              </span>
            </div>
            <Textarea
              placeholder={t('review_request_dialog.content_placeholder')}
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              rows={6}
              maxLength={2000}
              className="resize-none"
              disabled={!sufficientBalance}
            />
          </div>

          {/* Price Breakdown Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead className="font-semibold">
                    {t('review_request_dialog.table_description')}
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    {t('review_request_dialog.table_amount')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="py-3">
                    <div>
                      <p className="font-medium">
                        {t('review_request_dialog.service_name')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t('review_request_dialog.service_description')}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right py-3">
                    <p className="font-semibold">
                      {formatTrizilium(REVIEW_REQUEST_FEE)}
                    </p>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            {/* Total */}
            <div className="bg-muted p-4 flex justify-between items-center border-t">
              <p className="font-semibold text-lg">
                {t('review_request_dialog.total')}
              </p>
              <p className="text-2xl font-bold">
                {formatTrizilium(REVIEW_REQUEST_FEE)}
              </p>
            </div>
          </div>

          {/* Wallet Balance */}
          <div
            className={`border rounded-lg p-4 flex items-start gap-3 ${
              sufficientBalance
                ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800'
                : 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800'
            }`}
          >
            <Wallet
              className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                sufficientBalance
                  ? 'text-green-600 dark:text-green-500'
                  : 'text-red-600 dark:text-red-500'
              }`}
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-medium">
                  {t('review_request_dialog.wallet_balance')}
                </p>
                <p
                  className={`text-lg font-semibold ${
                    sufficientBalance
                      ? 'text-green-600 dark:text-green-500'
                      : 'text-red-600 dark:text-red-500'
                  }`}
                >
                  {formatTrizilium(walletBalance)}
                </p>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {sufficientBalance ? (
                  <span className="flex items-center gap-1 text-green-600 dark:text-green-500">
                    <CheckCircle className="h-4 w-4" />
                    {t('review_request_dialog.sufficient_balance')}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-red-600 dark:text-red-500">
                    <AlertCircle className="h-4 w-4" />
                    {t('review_request_dialog.insufficient_balance', {
                      amount: formatTrizilium(
                        REVIEW_REQUEST_FEE - walletBalance,
                      ),
                    })}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Insufficient Balance Warning */}
          {!sufficientBalance && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {t('review_request_dialog.insufficient_balance_alert')}
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
                disabled={!sufficientBalance}
              />
              <label
                htmlFor="terms"
                className="text-sm leading-relaxed cursor-pointer flex-1"
              >
                {termsStart}
                <span className="font-medium">{termsBold}</span>
                {termsEnd}
                <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                  <li>
                    {t('review_request_dialog.terms_fee', {
                      fee: formatTrizilium(REVIEW_REQUEST_FEE),
                    })}
                  </li>
                  <li>{t('review_request_dialog.terms_expert_review')}</li>
                  <li>{t('review_request_dialog.terms_non_refundable')}</li>
                  <li>{t('review_request_dialog.terms_processing_time')}</li>
                </ul>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
            >
              <X className="h-4 w-4 mr-2" />
              {t('review_request_dialog.cancel_button')}
            </Button>

            {!sufficientBalance ? (
              <Button onClick={handleTopup} className="gap-2">
                <Wallet className="h-4 w-4" />
                {t('review_request_dialog.go_to_wallet_button')}
              </Button>
            ) : (
              <Button
                onClick={handleCreateReview}
                disabled={!agreedToTerms || isPending || !reviewContent.trim()}
                className="gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t('review_request_dialog.processing_button')}
                  </>
                ) : (
                  <>
                    <MessageSquare className="h-4 w-4" />
                    {t('review_request_dialog.confirm_request_button')}
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatTrizilium } from '@/utils';

import { useTopupWalletMutation } from '../services/mutations';

import type { PaymentProvider } from '@/features/payment';

const TOPUP_PRESETS = [10000, 100000, 250000, 500000, 1000000];

type TopupFormValues = {
  amount: number;
  provider: 'PAYOS' | 'STRIPE';
};

interface TopupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialAmount?: number;
}

export const TopupDialog: React.FC<TopupDialogProps> = ({
  open,
  onOpenChange,
  initialAmount,
}) => {
  const { t } = useTranslation('pages.wallet');
  const { mutate: topupWallet, isPending } = useTopupWalletMutation();
  const [selectedPreset, setSelectedPreset] = useState<number>(
    initialAmount || 10000,
  );

  const topupSchema = z.object({
    amount: z.coerce
      .number()
      .min(1000, t('topup_dialog.amount_min', { amount: '1,000' }))
      .max(
        2000000000,
        t('topup_dialog.amount_max', { amount: '2,000,000,000' }),
      ),
    provider: z.enum(['PAYOS', 'STRIPE'] as const),
  });

  const form = useForm<TopupFormValues>({
    resolver: zodResolver(topupSchema),
    defaultValues: {
      amount: 10000,
      provider: 'PAYOS',
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      const amount = initialAmount || 10000;
      form.reset({
        amount,
        provider: 'PAYOS',
      });
      setSelectedPreset(amount);
    }
  }, [open, form, initialAmount]);

  const handlePresetAmount = (preset: number) => {
    form.setValue('amount', preset);
    setSelectedPreset(preset);
  };

  const onSubmit = async (values: TopupFormValues) => {
    // Create return URL with success parameter
    const returnUrl = `${window.location.origin}/wallet?topup=success`;

    topupWallet(
      {
        amount: values.amount,
        provider: values.provider as PaymentProvider,
        returnUrl,
      },
      {
        onSuccess: (response) => {
          const data = response.data;

          if (data?.paymentUrl) {
            // Redirect to payment URL
            window.location.href = data.paymentUrl;
          } else {
            toast.error(t('topup_dialog.error_no_payment_url'));
          }
        },
        onError: (error: unknown) => {
          const errorMessage =
            error instanceof Error
              ? error.message
              : t('topup_dialog.error_initiate');
          toast.error(String(errorMessage));
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('topup_dialog.title')}</DialogTitle>
          <DialogDescription>{t('topup_dialog.description')}</DialogDescription>
        </DialogHeader>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{t('topup_dialog.alert_message')}</AlertDescription>
        </Alert>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('topup_dialog.amount_label')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={t('topup_dialog.amount_placeholder')}
                      step="1000"
                      min="1000"
                      max="2000000000"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground mt-2">
                    {t('topup_dialog.amount_hint', {
                      min: formatTrizilium(1000),
                      max: formatTrizilium(2000000000),
                    })}
                  </p>
                </FormItem>
              )}
            />

            {/* Quick preset amounts */}
            <div>
              <p className="text-sm font-medium mb-2">
                {t('topup_dialog.quick_amounts')}
              </p>
              <div className="grid grid-cols-4 gap-2">
                {TOPUP_PRESETS.map((preset) => (
                  <Button
                    key={preset}
                    type="button"
                    variant={selectedPreset === preset ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePresetAmount(preset)}
                    className="text-xs"
                  >
                    {(preset / 1000).toFixed(0)}K
                  </Button>
                ))}
              </div>
            </div>

            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('topup_dialog.provider_label')}</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PAYOS">
                        <span className="flex items-center gap-2">
                          {t('topup_dialog.provider_payos')}
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 justify-end pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                {t('topup_dialog.cancel')}
              </Button>
              <Button type="submit" disabled={isPending} className="gap-2">
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t('topup_dialog.processing')}
                  </>
                ) : (
                  t('topup_dialog.confirm')
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

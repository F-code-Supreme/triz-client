import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
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

import { useTopupWalletMutation } from '../services/mutations';

import type { PaymentProvider } from '@/features/payment';

const TOPUP_PRESETS = [10000, 100000, 250000, 500000, 1000000];

const topupSchema = z.object({
  amount: z.coerce
    .number()
    .min(1000, 'Minimum amount is 1,000 VND')
    .max(2000000000, 'Maximum amount is 2,000,000,000 VND'),
  provider: z.enum(['PAYOS', 'STRIPE', 'PAYPAL'] as const),
});

type TopupFormValues = z.infer<typeof topupSchema>;

interface TopupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TopupDialog: React.FC<TopupDialogProps> = ({
  // open,
  onOpenChange,
}) => {
  const { mutate: topupWallet, isPending } = useTopupWalletMutation();
  const [selectedPreset, setSelectedPreset] = useState<number>(10000);

  const form = useForm<TopupFormValues>({
    resolver: zodResolver(topupSchema),
    defaultValues: {
      amount: 10000,
      provider: 'PAYOS',
    },
  });

  // Reset form when dialog opens
  //   useEffect(() => {
  //     if (open) {
  //       form.reset({
  //         amount: 10000,
  //         provider: 'PAYOS',
  //       });
  //       setSelectedPreset(10000);
  //     }
  //   }, [open, form]);

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
            toast.error('Failed to get payment URL');
          }
        },
        onError: (error: unknown) => {
          const errorMessage =
            error instanceof Error
              ? error.message
              : 'Failed to initiate top-up. Please try again.';
          toast.error(errorMessage);
        },
      },
    );
  };

  return (
    <Dialog open={false} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Top up Wallet</DialogTitle>
          <DialogDescription>
            Add funds to your wallet. You will be redirected to the payment
            provider to complete the transaction.
          </DialogDescription>
        </DialogHeader>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You will be redirected to PayOS, Stripe, or PayPal based on your
            selection. Your return URL will be processed securely.
          </AlertDescription>
        </Alert>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (VND)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="100,000"
                      step="1000"
                      min="1000"
                      max="2000000000"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground mt-2">
                    Minimum: 1,000 VND | Maximum: 2,000,000,000 VND
                  </p>
                </FormItem>
              )}
            />

            {/* Quick preset amounts */}
            <div>
              <p className="text-sm font-medium mb-2">Quick amounts</p>
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
                  <FormLabel>Payment Provider</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PAYOS">
                        <span className="flex items-center gap-2">
                          PayOS (Vietnam)
                        </span>
                      </SelectItem>
                      <SelectItem value="STRIPE">
                        <span className="flex items-center gap-2">
                          Stripe (International)
                        </span>
                      </SelectItem>
                      <SelectItem value="PAYPAL">
                        <span className="flex items-center gap-2">
                          PayPal (International)
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
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="gap-2">
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Proceed to Payment'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

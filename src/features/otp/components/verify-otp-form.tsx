import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import { FormCard } from '@/components/card/form-card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { STRING_EMPTY } from '@/constants';
import { useCountdown } from '@/hooks';

import {
  useSendOtpMutation,
  useVerifyOtpMutation,
} from '../services/mutations';
import { OtpPurpose } from '../services/mutations/types';

const formSchema = z.object({
  otp: z.string().min(6, { message: 'OTP must be 6 digits' }).max(6),
});

interface VerifyOtpFormProps {
  email: string;
  purpose?: OtpPurpose;
  onSuccess?: () => void;
  onVerify?: (otp: string) => void;
  isVerifying?: boolean;
}

const VerifyOtpForm: React.FC<VerifyOtpFormProps> = ({
  email,
  purpose = OtpPurpose.REGISTRATION,
  onSuccess,
  onVerify,
  isVerifying: externalIsVerifying,
}) => {
  const { t } = useTranslation(['pages.sign_up.verify_otp', 'datetime']);
  const [countdown, { startCountdown, resetCountdown }] = useCountdown({
    countStart: 60,
  });
  const [canResend, setCanResend] = useState(false);

  const { mutate: verifyOtp, isPending: internalIsVerifying } =
    useVerifyOtpMutation();
  const { mutate: sendOtp, isPending: isResending } = useSendOtpMutation();

  // Use external isVerifying state if provided, otherwise use internal state
  const isVerifying =
    externalIsVerifying !== undefined
      ? externalIsVerifying
      : internalIsVerifying;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: STRING_EMPTY,
    },
  });

  useEffect(() => {
    startCountdown();
    setCanResend(false); // Ensure canResend is false when countdown starts
  }, [startCountdown]);

  useEffect(() => {
    if (countdown === 0) {
      setCanResend(true);
    } else {
      setCanResend(false);
    }
  }, [countdown]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (onVerify) {
      // Use the custom verification logic
      onVerify(values.otp);
    } else {
      // Use the default verification logic
      verifyOtp(
        {
          email,
          otp: values.otp,
          purpose,
        },
        {
          onSuccess: () => {
            toast.success('OTP verified successfully!');
            if (onSuccess) onSuccess();
          },
          onError: (error) => {
            toast.error(
              error.response?.data?.message ||
                'Failed to verify OTP. Please try again.',
            );
          },
        },
      );
    }
  }

  function handleResendOtp() {
    sendOtp(
      {
        email,
        purpose,
      },
      {
        onSuccess: () => {
          toast.success('OTP sent successfully!');
          resetCountdown();
          setCanResend(false);
          form.reset();
        },
        onError: (error) => {
          toast.error(
            error.response?.data.message ||
              'Failed to send OTP. Please try again.',
          );
        },
      },
    );
  }

  return (
    <FormCard title={t('form.title')} description={t('form.description')}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-center block">
                    {t('form.label')}
                  </FormLabel>
                  <FormControl>
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isVerifying}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="text-center text-sm text-muted-foreground">
              {t('action.otp_sent_to')}{' '}
              <span className="font-medium">{email}</span>
            </div>

            <Button
              type="submit"
              disabled={isVerifying || form.watch('otp').length !== 6}
              className="w-full"
            >
              {isVerifying ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  {t('form.submiting')}
                </>
              ) : (
                t('form.submit')
              )}
            </Button>

            <div className="text-center">
              {canResend ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleResendOtp}
                  disabled={isResending}
                  className="text-sm"
                >
                  {isResending ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      {t('form.resending_otp')}
                    </>
                  ) : (
                    t('form.resend_otp')
                  )}
                </Button>
              ) : (
                <span className="text-sm text-muted-foreground">
                  {t('form.resend_otp_with_time')}{' '}
                  {t('datetime:seconds_left', {
                    count: countdown,
                  })}
                </span>
              )}
            </div>
          </div>
        </form>
      </Form>

      <div className="mt-4 text-center text-sm">
        <Link
          to="/login"
          search={{ redirect: '' }}
          className="text-secondary underline"
        >
          {t('action.back_to_sign_in')}
        </Link>
      </div>
    </FormCard>
  );
};

export default VerifyOtpForm;

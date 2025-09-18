import { zodResolver } from '@hookform/resolvers/zod';
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
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { STRING_EMPTY } from '@/constants';
import { useSendOtpMutation } from '@/features/otp/services/mutations';
import { OtpPurpose } from '@/features/otp/services/mutations/types';
import { AuthLayout } from '@/layouts/auth-layout';
import { Route } from '@/routes/forgot-password.index';

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' }),
});

const ForgotPasswordPage = () => {
  const { t } = useTranslation('pages.forgot_password');
  const { redirect } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { mutate: sendOtp, isPending } = useSendOtpMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: STRING_EMPTY,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    sendOtp(
      {
        email: values.email,
        purpose: OtpPurpose.PASSWORD_RESET,
      },
      {
        onSuccess: () => {
          toast.success('Reset password email sent successfully!');
          navigate({
            to: '/forgot-password/verify-otp',
            search: { redirect: redirect || '/', email: values.email },
          });
        },
        onError: (error) => {
          toast.error(
            error.response?.data.message ||
              'Failed to send reset password email. Please try again.',
          );
        },
      },
    );
  }

  return (
    <AuthLayout
      meta={{
        title: t('page_meta_title'),
      }}
    >
      <FormCard title={t('form.title')} description={t('form.description')}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.email')}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="example@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    {t('form.submitting')}
                  </>
                ) : (
                  t('form.submit')
                )}
              </Button>
            </div>
          </form>
        </Form>
      </FormCard>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;

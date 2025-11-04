import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
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
import { STRING_EMPTY } from '@/constants';
import { PASSWORD_REGEX } from '@/constants/regex';
import { useResetForgotPasswordMutation } from '@/features/auth/services/mutations';
import { AuthLayout } from '@/layouts/auth-layout';
import { Route } from '@/routes/forgot-password.new-password';

const formSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(new RegExp(PASSWORD_REGEX), {
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      }),
    confirmNewPassword: z
      .string()
      .min(1, { message: 'Confirm password is required' }),
  })
  .refine((values) => values.newPassword === values.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  });

const NewPasswordPage = () => {
  const { t } = useTranslation('pages.forgot_password.new_password');
  const navigate = useNavigate();
  const { auth } = Route.useRouteContext();
  const { mutate: resetPasswordMutate } = useResetForgotPasswordMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: STRING_EMPTY,
      confirmNewPassword: STRING_EMPTY,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    resetPasswordMutate(
      {
        newPassword: values.newPassword,
        confirmNewPassword: values.confirmNewPassword,
      },
      {
        onSuccess: () => {
          auth.resetPassword();

          toast.success('Password reset successfully!');
          navigate({ to: '/login', search: { redirect: '' } });
        },
        onError: (error) => {
          toast.error(
            error?.response?.data?.message || 'Failed to reset password',
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
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                {t('form.submit')}
              </Button>
            </div>
          </form>
        </Form>
      </FormCard>
    </AuthLayout>
  );
};

export default NewPasswordPage;

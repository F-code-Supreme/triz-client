import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { FormCard } from '@/components/card/form-card';
import { SubmitButton } from '@/components/forms/buttons/submit-button';
import { TextInput } from '@/components/forms/form-fields/text-input';
import GoogleSignInButton from '@/components/google/google-sign-in-button';
import { Form } from '@/components/ui/form';
import { PASSWORD_REGEX, STRING_EMPTY } from '@/constants';
import { Route } from '@/routes/register';

const formSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(new RegExp(PASSWORD_REGEX), {
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Confirm password is required' }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const RegisterForm = () => {
  const { auth } = Route.useRouteContext();
  const { redirect } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { t } = useTranslation('pages.sign_up');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: STRING_EMPTY,
      password: STRING_EMPTY,
      confirmPassword: STRING_EMPTY,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    auth.register(
      {
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      },
      () => navigate({ search: { redirect: '/login' } }),
    );
  }

  return (
    <FormCard title={t('form.title')} description={t('form.description')}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-4">
            <TextInput<typeof formSchema>
              form={form}
              name="email"
              label="Email"
              type="email"
            />
            <TextInput<typeof formSchema>
              form={form}
              name="password"
              label="Password"
              type="password"
            />
            <TextInput<typeof formSchema>
              form={form}
              name="confirmPassword"
              label="Confirm Password"
              type="password"
            />

            <SubmitButton>{t('form.submit')}</SubmitButton>
            <GoogleSignInButton title={t('form.register_with_google')} />
          </div>
        </form>
      </Form>
      <div className="mt-4 text-center text-sm">
        {t('form.have_account')}{' '}
        <Link
          search={{
            redirect,
          }}
          to="/login"
          className="text-secondary underline"
        >
          {t('form.sign_in')}
        </Link>
      </div>
    </FormCard>
  );
};

export default RegisterForm;

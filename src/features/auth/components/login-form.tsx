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
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { STRING_EMPTY } from '@/constants';
import { Route } from '@/routes/login';

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
});

const LoginForm = () => {
  const { auth } = Route.useRouteContext();
  const { redirect } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { t } = useTranslation('pages.sign_in');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: STRING_EMPTY,
      password: STRING_EMPTY,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    auth.login(
      {
        email: values.email,
        password: values.password,
      },
      () => navigate({ search: { redirect } }),
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

            <SubmitButton disabled={auth.isLoggingIn}>
              {auth.isLoggingIn ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Signing in...
                </>
              ) : (
                t('form.submit')
              )}
            </SubmitButton>
            <GoogleSignInButton title={t('form.login_with_google')} />
          </div>
        </form>
      </Form>
      <div className="mt-4 text-center text-sm">
        {t('form.no_account')}{' '}
        <Link
          search={{
            redirect,
          }}
          to="/register"
          className="text-secondary underline"
        >
          {t('form.sign_up')}
        </Link>
      </div>
    </FormCard>
  );
};

export default LoginForm;

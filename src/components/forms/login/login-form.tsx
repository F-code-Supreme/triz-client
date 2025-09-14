import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import { FormCard } from '@/components/card/form-card';
import { SubmitButton } from '@/components/forms/buttons/submit-button';
import { TextInput } from '@/components/forms/form-fields/text-input';
import GoogleSignInButton from '@/components/google/google-sign-in-button';
import { Form } from '@/components/ui/form';

// Improved schema with additional validation rules
const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
});

export const LoginForm = () => {
  const { t } = useTranslation('pages.sign_in');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Assuming an async login function
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>,
      );
    } catch (error) {
      console.error('Form submission error', error);
      toast.error('Failed to submit the form. Please try again.');
    }
  }

  return (
    <div className="flex flex-col min-h-[50vh] h-full w-full items-center justify-center px-4">
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

              <SubmitButton>{t('form.submit')}</SubmitButton>
              <GoogleSignInButton title={t('form.login_with_google')} />
            </div>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          {t('form.no_account')}{' '}
          <a href="#" className="underline">
            {t('form.sign_up')}
          </a>
        </div>
      </FormCard>
    </div>
  );
};

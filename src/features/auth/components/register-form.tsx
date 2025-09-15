import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import { FormCard } from '@/components/card/form-card';
import { SubmitButton } from '@/components/forms/buttons/submit-button';
import { TextInput } from '@/components/forms/form-fields/text-input';
import GoogleSignInButton from '@/components/google/google-sign-in-button';
import { Form } from '@/components/ui/form';
import { PASSWORD_REGEX } from '@/constants';

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
  const { t } = useTranslation('header');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Remove confirmPassword from the submission data
      const { confirmPassword: _, ...submitData } = values;

      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">
            {JSON.stringify(submitData, null, 2)}
          </code>
        </pre>,
      );
    } catch (error) {
      console.error('Form submission error', error);
      toast.error('Failed to submit the form. Please try again.');
    }
  }

  return (
    <FormCard
      title={t('sign_up')}
      description="Create your account to get started"
    >
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

            <SubmitButton>{t('sign_up')}</SubmitButton>
            <GoogleSignInButton title="Sign up with Google" />
          </div>
        </form>
      </Form>
      <div className="mt-4 text-center text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-secondary underline">
          {t('sign_in')}
        </Link>
      </div>
    </FormCard>
  );
};

export default RegisterForm;

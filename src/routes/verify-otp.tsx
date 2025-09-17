import { createFileRoute, redirect } from '@tanstack/react-router';

import { STRING_EMPTY } from '@/constants';
import VerifyOtpPage from '@/pages/main/otp/verify-otp';

export const Route = createFileRoute('/verify-otp')({
  validateSearch: (search) => ({
    redirect: (search.redirect as string) || '/',
    email: search.email as string,
  }),
  beforeLoad: ({ context, search }) => {
    if (
      context.auth.isAuthenticated ||
      !search.email ||
      search.email === STRING_EMPTY
    ) {
      throw redirect({ to: search.redirect });
    }
  },
  component: VerifyOtpPage,
});

import { createFileRoute, redirect } from '@tanstack/react-router';

import ForgotPasswordPage from '@/pages/main/forgot-password';

export const Route = createFileRoute('/forgot-password/')({
  validateSearch: (search) => ({
    redirect: (search.redirect as string) || '/',
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect });
    }
  },
  component: ForgotPasswordPage,
});

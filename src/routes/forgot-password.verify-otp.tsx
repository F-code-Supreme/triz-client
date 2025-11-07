import { createFileRoute, redirect } from '@tanstack/react-router';
import z from 'zod';

import { STRING_EMPTY } from '@/constants';
import VerifyOtpPage from '@/pages/main/public/forgot-password/verify-otp';

export const Route = createFileRoute('/forgot-password/verify-otp')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(STRING_EMPTY),
    email: z.string().nonempty().email(),
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect });
    }
  },
  component: VerifyOtpPage,
});

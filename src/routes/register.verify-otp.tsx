import { createFileRoute, redirect } from '@tanstack/react-router';
import z from 'zod';

import { STRING_EMPTY } from '@/constants';
import VerifyOtpPage from '@/pages/main/public/register/verify-otp';

export const Route = createFileRoute('/register/verify-otp')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(STRING_EMPTY),
    email: z.string().nonempty().email(),
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || '/' });
    }
  },
  component: VerifyOtpPage,
});

import { createFileRoute, redirect } from '@tanstack/react-router';
import z from 'zod';

import AdminDashboardPage from '@/pages/main/admin/dashboard';

export const Route = createFileRoute('/admin')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: AdminDashboardPage,
});

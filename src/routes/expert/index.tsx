import { createFileRoute, redirect } from '@tanstack/react-router';
import z from 'zod';

import ExpertDashboardPage from '@/pages/main/expert/dashboard';

export const Route = createFileRoute('/expert/')({
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
  component: ExpertDashboardPage,
});

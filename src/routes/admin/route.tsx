import { createFileRoute, Outlet } from '@tanstack/react-router';
import z from 'zod';

export const Route = createFileRoute('/admin')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),

  component: () => <Outlet />,
});

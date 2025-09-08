import { createFileRoute } from '@tanstack/react-router';
import { lazy } from 'react';

import { Loadable } from '@/components/loadable';

const LoginPage = Loadable(lazy(() => import('@/pages/main/login')));

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

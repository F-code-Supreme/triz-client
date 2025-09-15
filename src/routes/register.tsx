import { createFileRoute } from '@tanstack/react-router';
import { lazy } from 'react';

import { Loadable } from '@/components/loadable';

const RegisterPage = Loadable(lazy(() => import('@/pages/main/register')));

export const Route = createFileRoute('/register')({
  component: RegisterPage,
});

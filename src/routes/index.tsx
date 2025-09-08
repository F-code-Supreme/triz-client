import { createFileRoute } from '@tanstack/react-router';
import { lazy } from 'react';

import { Loadable } from '@/components/loadable';

const HomePage = Loadable(lazy(() => import('@/pages/main/home')));

export const Route = createFileRoute('/')({
  component: HomePage,
});

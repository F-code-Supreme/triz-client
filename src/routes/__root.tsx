import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';

import NotFoundPage from '@/pages/global/not-found';

import type { AuthState } from '@/features/auth/contexts/auth.context';

interface AppRouterContext {
  auth: AuthState;
}

export const Route = createRootRouteWithContext<AppRouterContext>()({
  component: () => (
    <>
      <Outlet />
    </>
  ),
  notFoundComponent: NotFoundPage,
});

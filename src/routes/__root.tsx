import {
  createRootRouteWithContext,
  Outlet,
  redirect,
} from '@tanstack/react-router';

import { AchievementNotifier } from '@/features/achievement/components';
import { Role } from '@/features/auth/types';
import NotFoundPage from '@/pages/global/not-found';

import type { AuthState } from '@/features/auth/contexts/auth.context';

interface AppRouterContext {
  auth: AuthState;
}

const RootComponent = () => {
  return (
    <>
      <Outlet />
      <AchievementNotifier pollingInterval={30000} />
    </>
  );
};

export const Route = createRootRouteWithContext<AppRouterContext>()({
  component: RootComponent,
  beforeLoad: ({ context, location }) => {
    if (context.auth.isAuthenticated) {
      if (
        context.auth.hasRole(Role.ADMIN) &&
        !location.pathname.startsWith('/admin')
      ) {
        throw redirect({
          to: '/admin',
          search: {
            redirect: location.href,
          },
        });
      }

      if (
        context.auth.hasRole(Role.EXPERT) &&
        !location.pathname.startsWith('/expert')
      ) {
        throw redirect({
          to: '/expert',
          search: {
            redirect: location.href,
          },
        });
      }

      if (
        context.auth.hasRole(Role.MODERATOR) &&
        !location.pathname.startsWith('/moderator')
      ) {
        throw redirect({
          to: '/moderator',
          search: {
            redirect: location.href,
          },
        });
      }
    }
  },
  notFoundComponent: NotFoundPage,
});

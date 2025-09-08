import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import LocaleSwitcher from '@/components/locale-switcher';
import NotFound from '@/pages/global/not-found';

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="container mx-auto py-2 px-8 flex justify-between">
        <div className="flex gap-4 items-center">
          <Link to="/" className="[&.active]:font-bold">
            Home
          </Link>
          <Link to="/login" className="[&.active]:font-bold">
            Login
          </Link>
        </div>
        <LocaleSwitcher />
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
  notFoundComponent: () => {
    return <NotFound />;
  },
});

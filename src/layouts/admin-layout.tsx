import { Navigate } from '@tanstack/react-router';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { LayoutProvider } from '@/context/layout-provider';
import useAuth from '@/features/auth/hooks/use-auth';
import { Role } from '@/features/auth/types';
import { Route } from '@/routes/admin/route';

import type { Meta } from '@/types';

interface AdminLayoutProps {
  children?: React.ReactNode;
  meta: Meta;
}

export const AdminLayout = ({ children, meta }: AdminLayoutProps) => {
  const { redirect } = Route.useSearch();
  const { hasRole } = useAuth();

  if (!hasRole(Role.ADMIN)) {
    return (
      <Navigate
        to="/unauthorized"
        search={{
          redirect,
        }}
      />
    );
  }

  return (
    <HelmetProvider>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{meta.title}</title>
      </Helmet>
      <LayoutProvider>
        <SidebarProvider>
          <AdminSidebar />
          <SidebarInset className="flex flex-col">
            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </LayoutProvider>
    </HelmetProvider>
  );
};

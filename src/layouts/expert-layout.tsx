import { Navigate } from '@tanstack/react-router';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import { ExpertHeader } from '@/components/layout/expert-header';
import { ExpertSidebar } from '@/components/layout/expert-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { LayoutProvider } from '@/context/layout-provider';
import useAuth from '@/features/auth/hooks/use-auth';
import { Role } from '@/features/auth/types';

import type { Meta } from '@/types';

interface ExpertLayoutProps {
  children?: React.ReactNode;
  meta: Meta;
}

export const ExpertLayout = ({ children, meta }: ExpertLayoutProps) => {
  const { hasRole, isAuthenticated } = useAuth();

  if (!isAuthenticated || !hasRole(Role.EXPERT)) {
    return (
      <Navigate
        to="/unauthorized"
        search={{
          redirect: '/expert',
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
          <ExpertSidebar />
          <SidebarInset className="flex flex-col">
            <ExpertHeader />
            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </LayoutProvider>
    </HelmetProvider>
  );
};

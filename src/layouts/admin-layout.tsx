import { Analytics } from '@vercel/analytics/next';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import { AdminHeader } from '@/components/layout/admin-header';
import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { LayoutProvider } from '@/context/layout-provider';

import type { Meta } from '@/types';

interface AdminLayoutProps {
  children?: React.ReactNode;
  meta: Meta;
}

export const AdminLayout = ({ children, meta }: AdminLayoutProps) => {
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
            <AdminHeader />
            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">{children}</main>
            <Analytics />
          </SidebarInset>
        </SidebarProvider>
      </LayoutProvider>
    </HelmetProvider>
  );
};

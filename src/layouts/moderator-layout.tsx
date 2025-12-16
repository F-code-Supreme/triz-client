import { Analytics } from '@vercel/analytics/next';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import { ModeratorHeader } from '@/components/layout/moderator-header';
import { ModeratorSidebar } from '@/components/layout/moderator-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { LayoutProvider } from '@/context/layout-provider';

import type { Meta } from '@/types';

interface ModeratorLayoutProps {
  children?: React.ReactNode;
  meta: Meta;
}

export const ModeratorLayout = ({ children, meta }: ModeratorLayoutProps) => {
  return (
    <HelmetProvider>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{meta.title}</title>
      </Helmet>
      <LayoutProvider>
        <SidebarProvider>
          <ModeratorSidebar />
          <SidebarInset className="flex flex-col">
            <ModeratorHeader />
            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">{children}</main>
            <Analytics />
          </SidebarInset>
        </SidebarProvider>
      </LayoutProvider>
    </HelmetProvider>
  );
};

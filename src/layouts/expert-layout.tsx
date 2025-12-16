import { Analytics } from '@vercel/analytics/next';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import { ExpertHeader } from '@/components/layout/expert-header';
import { ExpertSidebar } from '@/components/layout/expert-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { LayoutProvider } from '@/context/layout-provider';

import type { Meta } from '@/types';

interface ExpertLayoutProps {
  children?: React.ReactNode;
  meta: Meta;
}

export const ExpertLayout = ({ children, meta }: ExpertLayoutProps) => {
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
            <Analytics />
          </SidebarInset>
        </SidebarProvider>
      </LayoutProvider>
    </HelmetProvider>
  );
};

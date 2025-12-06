import { Helmet, HelmetProvider } from 'react-helmet-async';

import { Navbar03 } from '@/components/ui/navbar';

import type { Meta } from '@/types';

interface ChatLayoutProps {
  children: React.ReactNode;
  meta: Meta;
}

export const ChatLayout = ({ children, meta }: ChatLayoutProps) => {
  return (
    <HelmetProvider>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{meta.title}</title>
      </Helmet>
      <div className="min-h-svh flex flex-col w-full">
        <Navbar03 />
        <main className="container h-[calc(100svh-4rem-1px)] mx-auto p-8">
          {children}
        </main>
      </div>
    </HelmetProvider>
  );
};

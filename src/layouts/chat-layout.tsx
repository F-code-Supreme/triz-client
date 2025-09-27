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
      <div className="h-screen flex flex-col">
        <Navbar03 />
        <main className="container mx-auto p-8">{children}</main>
      </div>
    </HelmetProvider>
  );
};

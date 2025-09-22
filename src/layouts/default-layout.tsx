import { Helmet, HelmetProvider } from 'react-helmet-async';

import { Navbar03 } from '@/components/ui/navbar';

import type { Meta } from '@/types';

interface DefaultLayoutProps {
  children: React.ReactNode;
  meta: Meta;
}

export const DefaultLayout = ({ children, meta }: DefaultLayoutProps) => {
  return (
    <HelmetProvider>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{meta.title}</title>
      </Helmet>
      <div>
        <Navbar03 />
        <main className="container mx-auto p-8">{children}</main>
      </div>
    </HelmetProvider>
  );
};

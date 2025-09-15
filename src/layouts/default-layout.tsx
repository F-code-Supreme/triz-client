import { Helmet, HelmetProvider } from 'react-helmet-async';

import { Navbar03 } from '@/components/ui/navbar';

interface Meta {
  title: string;
}

interface DefaultLayoutProps {
  children: React.ReactNode;
  meta: Meta;
  headerVisible?: boolean;
}

export const DefaultLayout = ({
  children,
  meta,
  headerVisible = true,
}: DefaultLayoutProps) => {
  return (
    <HelmetProvider>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{meta.title}</title>
      </Helmet>
      <div>
        {headerVisible && <Navbar03 />}
        <main className="container mx-auto p-8">{children}</main>
      </div>
    </HelmetProvider>
  );
};

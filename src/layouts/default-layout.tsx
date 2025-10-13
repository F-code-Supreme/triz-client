import { Helmet, HelmetProvider } from 'react-helmet-async';

import Footer from '@/components/ui/footer';
import { Navbar03 } from '@/components/ui/navbar';

import type { Meta } from '@/types';

interface DefaultLayoutProps {
  children?: React.ReactNode;
  meta: Meta;
  showFooterCTA?: boolean;
  showFooter?: boolean;
  className?: string;
}

export const DefaultLayout = ({
  children,
  meta,
  showFooterCTA = false,
  showFooter = false,
  className = 'container mx-auto md:p-8 sm:p-4',
}: DefaultLayoutProps) => {
  return (
    <HelmetProvider>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{meta.title}</title>
      </Helmet>
      <div>
        <Navbar03 />
        <main className={className}>{children}</main>
        {showFooter && <Footer showCTA={showFooterCTA} />}
      </div>
    </HelmetProvider>
  );
};

import { Helmet, HelmetProvider } from 'react-helmet-async';

import Footer from '@/components/ui/footer';
import HeroSection from '@/components/ui/hero-section';
import { Navbar03 } from '@/components/ui/navbar';

import type { Meta } from '@/types';

interface DefaultLayoutProps {
  children?: React.ReactNode;
  meta: Meta;
  isPrinciplePage?: boolean;
  showHeroAndFooter?: boolean;
  showWithTRIZFooter?: boolean;
}

export const DefaultLayout = ({
  children,
  meta,
  isPrinciplePage = false,
  showHeroAndFooter = false,
  showWithTRIZFooter = false,
}: DefaultLayoutProps) => {
  return (
    <HelmetProvider>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{meta.title}</title>
      </Helmet>
      <div>
        <Navbar03 />
        {showHeroAndFooter && <HeroSection />}
        <main
          className={`${isPrinciplePage ? '' : 'container mx-auto md:p-8 sm:p-4'}`}
        >
          {children}
        </main>

        {showHeroAndFooter && <Footer show={showWithTRIZFooter} />}
      </div>
    </HelmetProvider>
  );
};

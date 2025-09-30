import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Navbar03 } from '@/components/ui/navbar';
import type { Meta } from '@/types';
import { useLocation } from '@tanstack/react-router';
import HeroSection from '@/components/ui/hero-section';
import Footer from '@/components/ui/footer';

interface DefaultLayoutProps {
  children: React.ReactNode;
  meta: Meta;
  showHeroAndFooter?: boolean;
  showWithTRIZFooter?: boolean;
}

export const DefaultLayout = ({
  children,
  meta,
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

        <main className="container mx-auto md:p-8 sm:p-4">{children}</main>
        {showHeroAndFooter && <Footer show={showWithTRIZFooter} />}
      </div>
    </HelmetProvider>
  );
};

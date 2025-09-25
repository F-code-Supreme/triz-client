import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Navbar03 } from '@/components/ui/navbar';
import type { Meta } from '@/types';
import { useLocation } from '@tanstack/react-router';
import HeroSection from '@/components/ui/hero-section';
import Footer from '@/components/ui/footer';

interface DefaultLayoutProps {
  children: React.ReactNode;
  meta: Meta;
}

export const DefaultLayout = ({ children, meta }: DefaultLayoutProps) => {
  const location = useLocation();

  console.log('Current location:', location);
  return (
    <HelmetProvider>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{meta.title}</title>
      </Helmet>
      <div>
        <Navbar03 />
        {location.pathname === '/' && <HeroSection />}

        <main className="container mx-auto p-8">{children}</main>
        {location.pathname === '/' && <Footer />}
      </div>
    </HelmetProvider>
  );
};

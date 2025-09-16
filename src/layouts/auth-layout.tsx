import { Helmet, HelmetProvider } from 'react-helmet-async';

import { AuroraBackground } from '@/components/ui/shadcn-io/aurora-background';

import type { Meta } from '@/types';

interface AuthLayoutProps {
  children: React.ReactNode;
  meta: Meta;
}

export const AuthLayout = ({ children, meta }: AuthLayoutProps) => {
  return (
    <HelmetProvider>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{meta.title}</title>
      </Helmet>
      <div>
        <AuroraBackground>
          <div className="relative z-10">
            <main className="container mx-auto p-8 h-screen">{children}</main>
          </div>
        </AuroraBackground>
      </div>
    </HelmetProvider>
  );
};

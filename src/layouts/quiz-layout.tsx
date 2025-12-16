import { Helmet, HelmetProvider } from 'react-helmet-async';

import { Navbar03 } from '@/components/ui/navbar';

import type { Meta } from '@/types';

interface ChatLayoutProps {
  children: React.ReactNode;
  meta: Meta;
  showheader?: boolean;
}

export const QuizLayout = ({
  children,
  meta,
  showheader = false,
}: ChatLayoutProps) => {
  return (
    <HelmetProvider>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{meta.title}</title>
      </Helmet>
      <div>
        {showheader && <Navbar03 />}
        <main className="container mx-auto md:p-8 sm:p-4">{children}</main>
      </div>
    </HelmetProvider>
  );
};

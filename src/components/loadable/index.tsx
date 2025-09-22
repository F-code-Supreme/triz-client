import { Suspense } from 'react';

import FallbackLoading from '@/components/fallback-loading';

export const Loadable =
  <P extends object>(Component: React.ComponentType<P>, isFullscreen = false) =>
  // eslint-disable-next-line react/display-name
  (properties: P) => {
    return (
      <Suspense
        fallback={<FallbackLoading isFullscreen={isFullscreen} isCenter />}
      >
        <Component {...properties} />
      </Suspense>
    );
  };

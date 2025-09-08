import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { cn } from '@/lib/utils';

import type { IFallbackLoadingProperties } from './types';

const FallbackLoading = (properties: IFallbackLoadingProperties) => {
  const { isFullscreen = false, isCenter = false } = properties;

  return (
    <div
      className={cn(
        isFullscreen && 'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm',
        isCenter && 'flex h-full w-full items-center justify-center',
      )}
    >
      <Spinner size={32} variant="circle" />
    </div>
  );
};

export default FallbackLoading;

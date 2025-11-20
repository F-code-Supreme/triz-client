import { RotateCcw } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { formatNumber } from '@/utils';

import type { Package } from '@/features/packages/types';

interface DeletedPackagesSectionProps {
  packages: Package[];
  isLoading: boolean;
  onRestore: (pkg: Package) => Promise<void>;
}

export const DeletedPackagesSection = ({
  packages,
  isLoading,
  onRestore,
}: DeletedPackagesSectionProps) => {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleRestore = (pkg: Package) => {
    setSelectedPackage(pkg);
    setIsDialogOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedPackage) return;

    await onRestore(selectedPackage);

    setIsDialogOpen(false);
    setSelectedPackage(null);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-3">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-20 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (packages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg border-dashed">
        <p className="text-lg font-medium text-muted-foreground">
          No deleted packages found
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          All packages are currently active
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="relative border rounded-lg p-4 hover:bg-muted/50 transition-colors flex flex-col"
          >
            {/* Section 1: Name, Tokens, Duration */}
            <div className="space-y-1 mb-4">
              <h3 className="font-semibold text-lg">{pkg.name}</h3>
              <p className="text-sm font-medium">
                {formatNumber(pkg.priceInTokens)} tokens
              </p>
              <Badge variant="outline" className="mt-1">
                {pkg.durationInDays} days
              </Badge>
            </div>

            {/* Section 2: Features */}
            {pkg.features && pkg.features.length > 0 && (
              <div className="text-xs text-muted-foreground mb-4 flex-1">
                <p className="font-medium mb-1">Features:</p>
                <ul className="list-disc list-inside space-y-1">
                  {pkg.features.slice(0, 3).map((feature, idx) => (
                    <li key={idx}>{feature.description}</li>
                  ))}
                  {pkg.features.length > 3 && (
                    <li>+{pkg.features.length - 3} more features</li>
                  )}
                </ul>
              </div>
            )}

            {/* Section 3: Deleted At */}
            {pkg.deletedAt && (
              <p className="text-xs text-muted-foreground">
                Deleted on:{' '}
                {new Date(pkg.deletedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            )}

            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleRestore(pkg)}
              className="absolute top-4 right-4 h-8 w-8"
              title="Restore"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restore Package</DialogTitle>
            <DialogDescription>
              Are you sure you want to restore &quot;{selectedPackage?.name}
              &quot;? This will make the package visible again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Restore</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

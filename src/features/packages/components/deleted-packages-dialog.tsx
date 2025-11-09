import { RotateCcw, Trash2 } from 'lucide-react';
import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatNumber } from '@/utils';

import type { Package } from '@/features/packages/types';

interface DeletedPackagesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packages: Package[];
  onRestore: (pkg: Package) => void;
  onPermanentDelete?: (pkg: Package) => void;
  isLoading?: boolean;
}

const DeletedPackagesDialog: React.FC<DeletedPackagesDialogProps> = ({
  open,
  onOpenChange,
  packages,
  onRestore,
  onPermanentDelete,
  isLoading = false,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Deleted Packages</DialogTitle>
          <DialogDescription>
            View and restore deleted packages. These packages are currently
            inactive and hidden from users.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : packages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Trash2 className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground">
                No deleted packages
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Deleted packages will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="flex items-start gap-4 p-4 border rounded-lg bg-muted/50"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{pkg.name}</h3>
                      <Badge variant="destructive" className="text-xs">
                        Deleted
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span>{formatNumber(pkg.priceInTokens)} tokens</span>
                      <span>{pkg.durationInDays} days</span>
                      <span>
                        {formatNumber(pkg.chatTokenPerDay)} tokens/day
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">
                        Features:
                      </p>
                      <ul className="text-sm space-y-1">
                        {pkg.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-muted-foreground">•</span>
                            <span>{feature.description}</span>
                          </li>
                        ))}
                        {pkg.features.length > 3 && (
                          <li className="text-xs text-muted-foreground">
                            +{pkg.features.length - 3} more features
                          </li>
                        )}
                      </ul>
                    </div>
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
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onRestore(pkg)}
                      className="gap-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Restore
                    </Button>
                    {onPermanentDelete && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onPermanentDelete(pkg)}
                        className="gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Forever
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default DeletedPackagesDialog;

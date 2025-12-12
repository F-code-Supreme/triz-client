import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatNumber } from '@/utils';

import type { Package } from '@/features/packages/types';

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  package: Package | null;
  onConfirm: () => void;
  isDeleting?: boolean;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  open,
  onOpenChange,
  package: pkg,
  onConfirm,
  isDeleting = false,
}) => {
  const { t } = useTranslation('pages.admin');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('packages.delete_dialog.title')}</DialogTitle>
          <DialogDescription>
            {t('packages.delete_dialog.message')}
          </DialogDescription>
        </DialogHeader>

        {pkg && (
          <div className="rounded-md bg-muted p-4">
            <p className="text-sm font-medium">{pkg.name}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatNumber(pkg.priceInTokens)} tokens • {pkg.durationInDays}{' '}
              {t('packages.card.days')}
            </p>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            {t('packages.delete_dialog.cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting
              ? t('packages.delete_dialog.deleting')
              : t('packages.delete_dialog.delete_package')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmDialog;

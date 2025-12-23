import { RotateCcw } from 'lucide-react';
import { useState } from 'react';
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
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/utils';

import type { Achievement } from '@/features/achievement/types';

interface DeletedAchievementsSectionProps {
  achievements: Achievement[];
  isLoading: boolean;
  onRestore: (achievement: Achievement) => Promise<void>;
}

export const DeletedAchievementsSection = ({
  achievements,
  isLoading,
  onRestore,
}: DeletedAchievementsSectionProps) => {
  const { t } = useTranslation('pages.admin');
  const [selectedAchievement, setSelectedAchievement] =
    useState<Achievement | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleRestore = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setIsDialogOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedAchievement) return;

    await onRestore(selectedAchievement);

    setIsDialogOpen(false);
    setSelectedAchievement(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-3">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (achievements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg border-dashed">
        <p className="text-lg font-medium text-muted-foreground">
          {t('archive.achievements.no_deleted')}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {t('archive.achievements.all_active')}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className="border rounded-lg p-4 hover:bg-muted/50 transition-colors relative flex flex-col gap-2"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                {achievement.imageUrl && (
                  <img
                    src={achievement.imageUrl}
                    alt={achievement.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                )}
                <div>
                  <h3 className="font-semibold">{achievement.name}</h3>
                  <p className="text-xs text-muted-foreground capitalize">
                    {achievement.type.replace(/_/g, ' ').toLowerCase()}
                  </p>
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleRestore(achievement)}
                className="h-8 w-8"
                title={t('common.restore')}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2">
              {achievement.description}
            </p>

            {achievement.deletedAt && (
              <div className="mt-auto pt-2 text-xs text-muted-foreground border-t">
                {t('archive.achievements.deleted_at')}:{' '}
                {formatDate(
                  new Date(achievement.deletedAt),
                  'DD/MM/YYYY HH:mm',
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('archive.achievements.restore_title')}</DialogTitle>
            <DialogDescription>
              {t('archive.achievements.restore_message')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleConfirm}>{t('common.restore')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

import { Award, X } from 'lucide-react';
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

import { useMarkAsReadAchievementsMutation } from '../services/mutations';

import type { UserAchievement } from '../types';

interface AchievementNotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  achievements: UserAchievement[];
  userId?: string;
  onClose?: () => void;
}

export const AchievementNotificationDialog = ({
  open,
  onOpenChange,
  achievements,
  userId,
  onClose,
}: AchievementNotificationDialogProps) => {
  const { t } = useTranslation('components');
  const [currentIndex, setCurrentIndex] = useState(0);
  const { mutate: markAsRead } = useMarkAsReadAchievementsMutation();

  const currentAchievement = achievements[currentIndex];
  const hasMore = currentIndex < achievements.length - 1;

  const handleMarkAsRead = (closeDialog: boolean = false) => {
    if (!userId || !currentAchievement) return;

    markAsRead(
      {
        userId,
        achievementIds: [currentAchievement.achievementId],
      },
      {
        onSuccess: () => {
          if (hasMore && !closeDialog) {
            // Move to next achievement
            setCurrentIndex((prev) => prev + 1);
          } else {
            // All done, close dialog
            setCurrentIndex(0);
            onOpenChange(false);
            onClose?.();
          }
        },
      },
    );
  };

  const handleClose = () => {
    if (!userId) return;

    // Mark all remaining achievements as read
    const remainingIds = achievements
      .slice(currentIndex)
      .map((a) => a.achievementId);

    if (remainingIds.length > 0) {
      markAsRead(
        {
          userId,
          achievementIds: remainingIds,
        },
        {
          onSuccess: () => {
            setCurrentIndex(0);
            onOpenChange(false);
            onClose?.();
          },
        },
      );
    } else {
      setCurrentIndex(0);
      onOpenChange(false);
      onClose?.();
    }
  };

  if (!currentAchievement) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">
            {t('achievement_notification.close_aria_label')}
          </span>
        </button>

        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500">
            <Award className="h-10 w-10 text-white" />
          </div>
          <DialogTitle className="text-2xl">
            🎉 {t('achievement_notification.title')}
          </DialogTitle>
          <DialogDescription className="text-base">
            {t('achievement_notification.congratulations')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Achievement Image */}
          {currentAchievement.achievementImageUrl && (
            <div className="flex justify-center">
              <img
                src={currentAchievement.achievementImageUrl}
                alt={currentAchievement.achievementName}
                className="h-32 w-32 rounded-lg object-cover shadow-md"
              />
            </div>
          )}

          {/* Achievement Details */}
          <div className="space-y-2 text-center">
            <h3 className="text-xl font-bold">
              {currentAchievement.achievementName}
            </h3>
            <p className="text-sm text-muted-foreground">
              {currentAchievement.achievementDescription}
            </p>
          </div>

          {/* Book Context (if available) */}
          {currentAchievement.bookTitle && (
            <div className="rounded-lg bg-muted p-3">
              <p className="text-center text-sm">
                <span className="font-medium">
                  {t('achievement_notification.book_label')}
                </span>{' '}
                {currentAchievement.bookTitle}
              </p>
            </div>
          )}

          {/* Progress Indicator */}
          {achievements.length > 1 && (
            <div className="text-center text-sm text-muted-foreground">
              {t('achievement_notification.progress', {
                current: currentIndex + 1,
                total: achievements.length,
              })}
            </div>
          )}
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          {hasMore ? (
            <>
              <Button
                onClick={() => handleMarkAsRead(false)}
                className="w-full"
              >
                {t('achievement_notification.next_button')}
              </Button>
              <Button
                variant="outline"
                onClick={handleClose}
                className="w-full"
              >
                {t('achievement_notification.view_later_button')}
              </Button>
            </>
          ) : (
            <Button onClick={() => handleMarkAsRead(true)} className="w-full">
              {t('achievement_notification.awesome_button')}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

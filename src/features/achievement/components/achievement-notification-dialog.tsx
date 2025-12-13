import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import achievementSound from '@/assets/sfx/steam-achievement-popup.mp3';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import {
  useMarkAsReadAchievementsMutation,
  useMarkAllAsReadAchievementsMutation,
} from '../services/mutations';

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
  const [snapshotAchievements, setSnapshotAchievements] = useState<
    UserAchievement[]
  >([]);
  const { mutateAsync: markAsRead } = useMarkAsReadAchievementsMutation();
  const { mutateAsync: markAllAsRead } = useMarkAllAsReadAchievementsMutation();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasPlayedSoundRef = useRef(false);

  // Snapshot achievements when dialog opens to prevent array changes mid-dialog
  useEffect(() => {
    if (open && achievements.length > 0) {
      setSnapshotAchievements(achievements);
      setCurrentIndex(0);
    }
  }, [open, achievements]);

  const currentAchievement = snapshotAchievements[currentIndex];
  const hasMore = currentIndex < snapshotAchievements.length - 1;

  useEffect(() => {
    if (open && currentAchievement && !hasPlayedSoundRef.current) {
      const playSound = () => {
        const audio = audioRef.current;
        if (!audio) return;

        // Reset and play
        audio.currentTime = 0;

        // Ensure audio is loaded before playing
        if (audio.readyState >= 2) {
          // HAVE_CURRENT_DATA or better
          audio.play().catch((error) => {
            console.error('Failed to play achievement sound:', error);
          });
        } else {
          // Wait for audio to be ready
          audio.addEventListener(
            'canplay',
            () => {
              audio.play().catch((error) => {
                console.error('Failed to play achievement sound:', error);
              });
            },
            { once: true },
          );
        }

        // Mark that sound has been played
        hasPlayedSoundRef.current = true;
      };

      // Small delay to ensure DOM is ready
      const soundTimer = setTimeout(playSound, 100);

      return () => {
        clearTimeout(soundTimer);
      };
    }

    // Reset the sound flag when dialog closes
    if (!open) {
      hasPlayedSoundRef.current = false;
    }
  }, [open, currentAchievement]);

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
    const remainingCount = snapshotAchievements.length - currentIndex;

    if (remainingCount > 0) {
      markAllAsRead(
        { userId },
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
    <>
      {/* Hidden audio element */}
      <audio ref={audioRef} src={achievementSound} preload="auto" />

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none z-10"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">
              {t('achievement_notification.close_aria_label')}
            </span>
          </button>

          <DialogHeader className="text-center sm:text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <DialogTitle className="text-3xl font-bold">
                🎉 {t('achievement_notification.title')}
              </DialogTitle>
            </motion.div>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Achievement Image */}
            {currentAchievement.achievementImageUrl && (
              <div className="flex justify-center">
                <motion.div
                  key={currentAchievement.achievementId}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{
                    scale: [0, 1, 1.1, 1],
                    rotate: [-180, 0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 1.2,
                    times: [0, 0.5, 0.7, 0.9, 1],
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                >
                  <img
                    src={currentAchievement.achievementImageUrl}
                    alt={currentAchievement.achievementName}
                    className="h-48 w-48 rounded-xl object-cover shadow-2xl ring-4 ring-primary/20"
                  />
                </motion.div>
              </div>
            )}

            {/* Achievement Details */}
            <motion.div
              className="space-y-3 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <motion.h3
                className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {currentAchievement.achievementName}
              </motion.h3>
              <motion.p
                className="text-base text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {currentAchievement.achievementDescription}
              </motion.p>
            </motion.div>

            {/* Book Context (if available) */}
            <AnimatePresence>
              {currentAchievement.bookTitle && (
                <motion.div
                  className="rounded-lg bg-muted p-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <p className="text-center text-sm">
                    <span className="font-medium">
                      {t('achievement_notification.book_label')}
                    </span>{' '}
                    {currentAchievement.bookTitle}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Progress Indicator */}
            <AnimatePresence>
              {snapshotAchievements.length > 1 && (
                <motion.div
                  className="text-center text-sm text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {t('achievement_notification.progress', {
                    current: currentIndex + 1,
                    total: snapshotAchievements.length,
                  })}
                </motion.div>
              )}
            </AnimatePresence>
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
    </>
  );
};

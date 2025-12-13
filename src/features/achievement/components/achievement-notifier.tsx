import { useState } from 'react';

import useAuth from '@/features/auth/hooks/use-auth';

import { AchievementNotificationDialog } from './achievement-notification-dialog';
import { useAchievementPolling } from '../hooks/use-achievement-polling';

interface AchievementNotifierProps {
  pollingInterval?: number; // in milliseconds
}

export const AchievementNotifier = ({
  pollingInterval = 30000, // Default: 30 seconds
}: AchievementNotifierProps) => {
  const { user, isAuthenticated } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { unreadAchievements, hasNewAchievements, clearNewAchievements } =
    useAchievementPolling({
      userId: user?.id,
      enabled: isAuthenticated && !!user?.id,
      pollingInterval,
    });

  // Auto-open dialog when new achievements arrive
  if (hasNewAchievements && !dialogOpen && unreadAchievements.length > 0) {
    setDialogOpen(true);
  }

  const handleDialogClose = () => {
    setDialogOpen(false);
    clearNewAchievements();
  };

  return (
    <AchievementNotificationDialog
      open={dialogOpen}
      onOpenChange={setDialogOpen}
      achievements={unreadAchievements}
      userId={user?.id}
      onClose={handleDialogClose}
    />
  );
};

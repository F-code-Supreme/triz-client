import { useEffect, useState } from 'react';

import { useGetUserUnreadAchievementsQuery } from '../services/queries';

import type { UserAchievement } from '../types';

interface UseAchievementPollingOptions {
  userId?: string;
  enabled?: boolean;
  pollingInterval?: number; // in milliseconds
}

export const useAchievementPolling = ({
  userId,
  enabled = true,
  pollingInterval = 30000, // Default: 30 seconds
}: UseAchievementPollingOptions) => {
  const [unreadAchievements, setUnreadAchievements] = useState<
    UserAchievement[]
  >([]);
  const [hasNewAchievements, setHasNewAchievements] = useState(false);

  const { data } = useGetUserUnreadAchievementsQuery(userId, {
    refetchInterval: enabled ? pollingInterval : false,
  });

  // Update local state when data changes
  useEffect(() => {
    if (data && data.length > 0) {
      setUnreadAchievements(data);
      setHasNewAchievements(true);
    }
  }, [data]);

  const clearNewAchievements = () => {
    setHasNewAchievements(false);
    setUnreadAchievements([]);
  };

  return {
    unreadAchievements,
    hasNewAchievements,
    clearNewAchievements,
  };
};

import type { AchievementType, AchievementStatus } from '../../types';

export interface CreateAchievementPayload {
  name: string;
  description: string;
  imageUrl: string;
  type: AchievementType;
  milestoneCount: number | null;
}

export interface UpdateAchievementPayload extends Partial<CreateAchievementPayload> {
  id: string;
  status?: AchievementStatus;
}

export interface MarkAsReadAchievementsPayload {
  userId: string;
  achievementIds: string[];
}

export interface MarkAllAsReadAchievementsPayload {
  userId: string;
}

import type { DataTimestamp, PaginatedResponse } from '@/types';

export enum AchievementType {
  FIRST_BOOK = 'FIRST_BOOK',
  BOOK_MILESTONE = 'BOOK_MILESTONE',
}

export enum AchievementStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  type: AchievementType;
  status: AchievementStatus;
  milestoneCount: number | null;

  deletedAt: string | null;
}

export type AchievementResponse = PaginatedResponse<
  Achievement & DataTimestamp
>;

export interface UserAchievement {
  achievementId: string;
  achievementName: string;
  achievementDescription: string;
  achievementImageUrl: string;
  achievementType: AchievementType;
  bookId: string;
  bookTitle: string;
  earnedAt: string;

  readAt: string | null;
}

export type UserAchievementResponse = PaginatedResponse<UserAchievement>;

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';

import { AchievementKeys } from '../queries/keys';

import type {
  CreateAchievementPayload,
  UpdateAchievementPayload,
  MarkAsReadAchievementsPayload,
  MarkAllAsReadAchievementsPayload,
} from './types';
import type { Achievement } from '../../types';

// ADMIN
export const useCreateAchievementMutation = () => {
  const queryClient = useQueryClient();
  const _request = useAxios();

  return useMutation({
    mutationFn: async (payload: CreateAchievementPayload) => {
      const response = await _request.post<Achievement>(
        '/achievements',
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [AchievementKeys.GetAchievementsQuery],
      });
      queryClient.invalidateQueries({
        queryKey: [AchievementKeys.GetActiveAchievementsQuery],
      });
    },
  });
};

export const useUpdateAchievementMutation = () => {
  const queryClient = useQueryClient();
  const _request = useAxios();

  return useMutation({
    mutationFn: async (payload: UpdateAchievementPayload) => {
      const { id, ...data } = payload;
      const response = await _request.patch<Achievement>(
        `/achievements/${id}`,
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [AchievementKeys.GetAchievementsQuery],
      });
      queryClient.invalidateQueries({
        queryKey: [AchievementKeys.GetActiveAchievementsQuery],
      });
      queryClient.invalidateQueries({
        queryKey: [AchievementKeys.GetAchievementByIdQuery],
      });
    },
  });
};

export const useDeleteAchievementMutation = () => {
  const queryClient = useQueryClient();
  const _request = useAxios();

  return useMutation({
    mutationFn: async (achievementId: string) => {
      const response = await _request.delete(`/achievements/${achievementId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [AchievementKeys.GetAchievementsQuery],
      });
      queryClient.invalidateQueries({
        queryKey: [AchievementKeys.GetDeletedAchievementsQuery],
      });
      queryClient.invalidateQueries({
        queryKey: [AchievementKeys.GetActiveAchievementsQuery],
      });
    },
  });
};

export const useRestoreAchievementMutation = () => {
  const queryClient = useQueryClient();
  const _request = useAxios();

  return useMutation({
    mutationFn: async (achievementId: string) => {
      const response = await _request.patch<Achievement>(
        `/achievements/${achievementId}/restore`,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [AchievementKeys.GetAchievementsQuery],
      });
      queryClient.invalidateQueries({
        queryKey: [AchievementKeys.GetDeletedAchievementsQuery],
      });
      queryClient.invalidateQueries({
        queryKey: [AchievementKeys.GetActiveAchievementsQuery],
      });
    },
  });
};

// USER ACHIEVEMENTS
export const useMarkAsReadAchievementsMutation = () => {
  const queryClient = useQueryClient();
  const _request = useAxios();

  return useMutation({
    mutationFn: async (payload: MarkAsReadAchievementsPayload) => {
      const { userId, achievementIds } = payload;
      const response = await _request.patch(
        `/users/${userId}/achievements/read`,
        { achievementIds },
      );
      return response.data;
    },
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({
        queryKey: [AchievementKeys.GetUserAchievementsQuery, payload.userId],
      });
      queryClient.invalidateQueries({
        queryKey: [
          AchievementKeys.GetUserUnreadAchievementsQuery,
          payload.userId,
        ],
      });
    },
  });
};

export const useMarkAllAsReadAchievementsMutation = () => {
  const queryClient = useQueryClient();
  const _request = useAxios();

  return useMutation({
    mutationFn: async (payload: MarkAllAsReadAchievementsPayload) => {
      const { userId } = payload;
      const response = await _request.patch(
        `/users/${userId}/achievements/read-all`,
      );
      return response.data;
    },
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({
        queryKey: [AchievementKeys.GetUserAchievementsQuery, payload.userId],
      });
      queryClient.invalidateQueries({
        queryKey: [
          AchievementKeys.GetUserUnreadAchievementsQuery,
          payload.userId,
        ],
      });
    },
  });
};

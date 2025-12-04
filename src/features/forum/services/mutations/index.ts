import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';
import { ForumKeys } from '@/features/forum/services/queries/keys';

import type {
  CreateCommentPayload,
  CreateCommentResponse,
  CreateForumPostPayload,
  CreateVotePayload,
} from '@/features/forum/services/mutations/types';
import type { ForumPost } from '@/features/forum/types';

export const useCreateVoteMutation = () => {
  const queryClient = useQueryClient();
  const _request = useAxios();
  return useMutation({
    mutationFn: async (data: CreateVotePayload & { postId: string }) => {
      const { postId, ...payload } = data;
      const response = await _request.post(
        `/forumPosts/${postId}/votes`,
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ForumKeys.GetForumQuery],
      });
    },
  });
};
export const useCreateForumPostMutation = () => {
  const queryClient = useQueryClient();
  const _request = useAxios();
  return useMutation({
    mutationFn: async (data: CreateForumPostPayload) => {
      const response = await _request.post<ForumPost>(`/forumPosts`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ForumKeys.GetForumQuery],
      });
    },
  });
};
export const useCreateCommentMutation = () => {
  const queryClient = useQueryClient();
  const _request = useAxios();
  return useMutation({
    mutationFn: async (data: CreateCommentPayload & { postId: string }) => {
      const { postId, ...payload } = data;
      const response = await _request.post<CreateCommentResponse>(
        `/forumPosts/${postId}/replies`,
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ForumKeys.GetForumQuery],
      });
    },
  });
};

export const useCreateReplyCommentMutation = () => {
  const queryClient = useQueryClient();
  const _request = useAxios();
  return useMutation({
    mutationFn: async (
      data: CreateCommentPayload & { parentReplyId: string },
    ) => {
      const { parentReplyId, ...payload } = data;
      const response = await _request.post<CreateCommentResponse>(
        `/replies/${parentReplyId}/replies`,
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ForumKeys.GetForumQuery],
      });
    },
  });
};

// Replies to a reply
export const useCreateVoteForReplyMutation = () => {
  const queryClient = useQueryClient();
  const _request = useAxios();
  return useMutation({
    mutationFn: async (data: CreateVotePayload & { replyId: string }) => {
      const { replyId, ...payload } = data;
      const response = await _request.post(
        `/replies/${replyId}/votes`,
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ForumKeys.GetForumPostReplies],
      });
    },
  });
};

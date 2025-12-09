import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';
import { ForumKeys } from '@/features/forum/services/queries/keys';

import type {
  CommentResponse,
  ForumPostResponse,
} from '@/features/forum/services/queries/types';
import type { Comment } from '@/features/forum/types';
import type { PaginationState } from '@tanstack/react-table';

export const useGetForumPostsQuery = (pagination?: PaginationState) => {
  const _request = useAxios();
  const initialSize = pagination?.pageSize ?? 20;

  return useInfiniteQuery({
    queryKey: [ForumKeys.GetForumQuery, initialSize],
    queryFn: async ({ pageParam = 0, signal }) => {
      const response = await _request.get<ForumPostResponse>(`/forumPosts`, {
        params: {
          page: pageParam,
          size: initialSize,
          sort: 'createdAt,desc',
        },
        signal,
      });
      return response.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.page.number + 1 < lastPage.page.totalPages
        ? lastPage.page.number + 1
        : undefined;
    },
  });
};

export const useGetForumPostAll = () => {
  const _request = useAxios();
  return useQuery({
    queryKey: [ForumKeys.GetForumAll],
    queryFn: async () => {
      const response = await _request.get<ForumPostResponse>(`/forumPosts/me`, {
        params: {
          page: 0,
          size: 1000,
          sort: 'createdAt,desc',
        },
      });
      return response.data;
    },
  });
};

export const useGetForumPostByIdQuery = (postId: string) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [ForumKeys.GetForumByIdQuery, postId],
    queryFn: async () => {
      const response = await _request.get<ForumPostResponse>(
        `/forumPosts/${postId}`,
      );
      return response.data;
    },
  });
};

export const useGetForumPostReplyByIdQuery = (postId: string) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [ForumKeys.GetForumPostReplies, postId],
    queryFn: async () => {
      const response = await _request.get<CommentResponse>(
        `/forumPosts/${postId}/replies`,
      );
      return response.data;
    },
  });
};
// Replies to a reply
export const useGetForumPostChildrenReplyByIdQuery = (
  parentReplyId: string,
) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [ForumKeys.GetForumPostChildrenReplies, parentReplyId],
    queryFn: async () => {
      const response = await _request.get<Comment[]>(
        `/replies/${parentReplyId}/children`,
      );
      return response.data;
    },
  });
};

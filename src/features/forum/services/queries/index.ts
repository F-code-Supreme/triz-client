import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';
import { ForumKeys } from '@/features/forum/services/queries/keys';

import type {
  CommentResponse,
  ForumPostResponse,
} from '@/features/forum/services/queries/types';
import type { Comment, ForumPost } from '@/features/forum/types';
import type { UseQueryOptions } from '@tanstack/react-query';
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';

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

export const useGetMyForumPostAll = (pagination?: PaginationState) => {
  const _request = useAxios();
  const initialSize = pagination?.pageSize ?? 20;

  return useInfiniteQuery({
    queryKey: [ForumKeys.GetMyForumPostQuery, initialSize],
    queryFn: async ({ pageParam = 0, signal }) => {
      const response = await _request.get<ForumPostResponse>(`/forumPosts/me`, {
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

export const useGetForumPostByIdQuery = (
  postId: string,
  options?: Omit<UseQueryOptions<ForumPost, any>, 'queryKey' | 'queryFn'>,
) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [ForumKeys.GetForumByIdQuery, postId],
    queryFn: async () => {
      const response = await _request.get<ForumPost>(`/forumPosts/${postId}`);
      return response.data;
    },
    ...options,
  });
};
export const useGetForumPostsByAdminQuery = (
  pagination: PaginationState,
  sorting: SortingState,
  filters?: ColumnFiltersState,
) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [
      ForumKeys.GetForumPostsByAdminQuery,
      pagination,
      sorting,
      filters,
    ],
    queryFn: async ({ signal }) => {
      const data = {
        statuses: filters?.find((filter) => filter.id === 'status')?.value,
        keyword: filters?.find((filter) => filter.id === 'title')?.value,
      };
      const response = await _request.post<ForumPostResponse>(
        `/forumPosts/search`,
        data,
        {
          page: pagination.pageIndex,
          size: pagination.pageSize,
          sort:
            sorting.length > 0
              ? sorting
                  .map(({ id, desc }) => `${id},${desc ? 'desc' : 'asc'}`)
                  .join('&')
              : undefined,
        },
        signal,
      );
      return response.data;
    },
  });
};
export const useGetForumPostReplyByIdQuery = (
  postId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: Omit<UseQueryOptions<CommentResponse, any>, 'queryKey' | 'queryFn'>,
) => {
  const _request = useAxios();

  return useQuery({
    queryKey: [ForumKeys.GetForumPostReplies, postId],
    queryFn: async () => {
      const response = await _request.get<CommentResponse>(
        `/forumPosts/${postId}/replies`,
      );
      return response.data;
    },
    ...options,
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
    enabled: !!parentReplyId,
  });
};

export const useGetForumPostsByUserIdQuery = (
  userId?: string,
  pagination?: PaginationState,
) => {
  const _request = useAxios();
  const initialSize = pagination?.pageSize ?? 20;

  return useInfiniteQuery({
    queryKey: [ForumKeys.GetForumQuery, 'user', userId, initialSize],
    queryFn: async ({ pageParam = 0, signal }) => {
      const response = await _request.get<ForumPostResponse>(
        `/forumPosts/users/${userId}`,
        {
          params: {
            page: pageParam,
            size: initialSize,
            sort: 'createdAt,desc',
          },
          signal,
        },
      );
      return response.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.page.number + 1 < lastPage.page.totalPages
        ? lastPage.page.number + 1
        : undefined;
    },
    enabled: !!userId,
  });
};

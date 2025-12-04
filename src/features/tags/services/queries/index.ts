import { useQuery } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';
import { TagKeys } from '@/features/tags/services/queries/keys';

import type { TagPostResponse } from '@/features/tags/services/queries/types';
import type { PaginationState } from '@tanstack/react-table';

export const useGetTagsQuery = (pagination?: PaginationState) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [TagKeys.GetTagsQuery, pagination],
    queryFn: async () => {
      const response = await _request.get<TagPostResponse>(`/TagPosts`, {
        params: {
          page: pagination?.pageIndex,
          size: pagination?.pageSize,
        },
      });
      return response.data;
    },
  });
};

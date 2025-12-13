import { skipToken, useQuery } from '@tanstack/react-query';

import { request, useAxios } from '@/configs/axios';

import { UserKeys } from './keys';

import type { IUser } from '../../types';
import type { DataTimestamp, PaginatedResponse } from '@/types';
import type { PaginationState, SortingState } from '@tanstack/react-table';

// PUBLIC
export const useGetUserByIdQuery = (userId?: string) => {
  return useQuery({
    queryKey: [UserKeys.GetUserByIdQuery, userId],
    queryFn: userId
      ? async ({ signal }) => {
          const response = await request.get<IUser & DataTimestamp>(
            `/users/${userId}`,
            {
              signal,
            },
          );

          return response.data;
        }
      : skipToken,
    enabled: !!userId,
  });
};

// ADMIN
export const useGetAllUsersQuery = (
  pagination: PaginationState,
  sorting: SortingState,
) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [UserKeys.GetAllUsersQuery, pagination, sorting],
    queryFn: async ({ signal }) => {
      const response = await _request.get<
        PaginatedResponse<IUser & DataTimestamp>
      >('/users', {
        params: {
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
      });
      return response.data;
    },
  });
};

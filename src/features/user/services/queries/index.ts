import { skipToken, useQuery } from '@tanstack/react-query';

import { request, useAxios } from '@/configs/axios';

import { UserKeys } from './keys';

import type { IUser } from '../../types';
import type { DataTimestamp, PaginatedResponse } from '@/types';
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';

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

// EXPERT & MODERATOR & ADMIN
export const useSearchAllUsersQuery = (
  pagination: PaginationState,
  sorting: SortingState,
  filters: ColumnFiltersState = [],
) => {
  const _request = useAxios();

  // Build request body from filters
  const requestBody = filters.reduce(
    (acc, filter) => {
      if (filter.value !== undefined && filter.value !== null) {
        // Convert 'true'/'false' strings to boolean for enabled field
        if (filter.id === 'enabled') {
          acc[filter.id] = Array.isArray(filter.value)
            ? filter.value[0] === 'true'
            : filter.value === 'true';
        } else if (filter.id === 'roles') {
          // Ensure roles is always a string, not an array
          acc[filter.id] = Array.isArray(filter.value)
            ? filter.value[0]
            : filter.value;
        } else {
          acc[filter.id] = filter.value;
        }
      }
      return acc;
    },
    {} as Record<string, unknown>,
  );

  return useQuery({
    queryKey: [UserKeys.GetAllUsersQuery, pagination, sorting, filters],
    queryFn: async ({ signal }) => {
      const response = await _request.post<
        PaginatedResponse<IUser & DataTimestamp>
      >(
        '/users/search',
        requestBody,
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

import { skipToken, useQuery } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';

import { TransactionKeys } from './keys';

import type { Transaction } from '../../types';
import type { DataTimestamp, PaginatedResponse } from '@/types';
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';

// AUTHENTICATED USER
export const useGetTransactionByIdQuery = (transactionId?: string) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [TransactionKeys.GetTransactionByIdQuery, transactionId],
    queryFn: transactionId
      ? async ({ signal }) => {
          const response = await _request.get<Transaction & DataTimestamp>(
            `/transactions/${transactionId}`,
            {
              signal,
            },
          );

          return response.data;
        }
      : skipToken,
    enabled: !!transactionId,
  });
};

// AUTHENTICATED USER & ADMIN
export const useGetAllTransactionsByUserQuery = (
  pagination: PaginationState,
  sorting: SortingState,
  userId?: string,
) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [
      TransactionKeys.GetAllTransactionsByUserQuery,
      userId,
      pagination,
      sorting,
    ],
    queryFn: userId
      ? async ({ signal }) => {
          const response = await _request.get<
            PaginatedResponse<Transaction & DataTimestamp>
          >(`/users/${userId}/transactions`, {
            signal,
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
          });

          return response.data;
        }
      : skipToken,
    enabled: !!userId,
  });
};

export const useSearchAllTransactionsByUserQuery = (
  pagination: PaginationState,
  sorting: SortingState,
  userId?: string,
  filters?: ColumnFiltersState,
) => {
  const _request = useAxios();

  return useQuery({
    queryKey: [
      TransactionKeys.GetAllTransactionsByUserQuery,
      pagination,
      sorting,
      filters,
    ],
    queryFn: userId
      ? async ({ signal }) => {
          const response = await _request.post<
            PaginatedResponse<Transaction & DataTimestamp>
          >(
            `/users/${userId}/transactions/search`,
            {
              fromDate: filters
                ?.find((filter) => filter.id === 'fromDate')
                ?.value?.toString(),
              toDate: filters
                ?.find((filter) => filter.id === 'toDate')
                ?.value?.toString(),
              statuses: filters?.find((filter) => filter.id === 'status')
                ?.value,
              types: filters?.find((filter) => filter.id === 'type')?.value,
              providers: filters?.find((filter) => filter.id === 'provider')
                ?.value,
            },
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
        }
      : skipToken,
  });
};

// ADMIN
export const useGetAllTransactionsQuery = (
  pagination: PaginationState,
  sorting: SortingState,
) => {
  const _request = useAxios();

  return useQuery({
    queryKey: [TransactionKeys.GetAllTransactionsQuery, pagination, sorting],
    queryFn: async ({ signal }) => {
      const response = await _request.get<
        PaginatedResponse<Transaction & DataTimestamp>
      >('/transactions', {
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

export const useSearchAllTransactionsQuery = (
  pagination: PaginationState,
  sorting: SortingState,
  filters?: ColumnFiltersState,
) => {
  const _request = useAxios();

  return useQuery({
    queryKey: [
      TransactionKeys.GetAllTransactionsQuery,
      pagination,
      sorting,
      filters,
    ],
    queryFn: async ({ signal }) => {
      const response = await _request.post<
        PaginatedResponse<Transaction & DataTimestamp>
      >(
        '/transactions/search',
        {
          fromDate: filters
            ?.find((filter) => filter.id === 'fromDate')
            ?.value?.toString(),
          toDate: filters
            ?.find((filter) => filter.id === 'toDate')
            ?.value?.toString(),
          statuses: filters?.find((filter) => filter.id === 'status')?.value,
          types: filters?.find((filter) => filter.id === 'type')?.value,
          providers: filters?.find((filter) => filter.id === 'provider')?.value,
        },
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

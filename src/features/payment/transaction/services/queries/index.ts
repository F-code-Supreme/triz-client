import { skipToken, useQuery } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';
import { formatDateUTC } from '@/utils/date/date';

import { TransactionKeys } from './keys';

import type { Transaction } from '../../types';
import type { DataTimestamp, PaginatedResponse } from '@/types';
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';

// Helper function to format date to ISO 8601 UTC format
const formatDateForAPI = (dateValue: unknown): string | undefined => {
  if (!dateValue) return undefined;
  try {
    return formatDateUTC(new Date(dateValue as Date));
  } catch {
    return undefined;
  }
};

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
      userId,
      pagination,
      sorting,
      filters,
    ],
    queryFn: userId
      ? async ({ signal }) => {
          const fromDateValue = filters?.find(
            (filter) => filter.id === 'fromDate',
          )?.value as Date | undefined;
          const toDateValue = filters?.find((filter) => filter.id === 'toDate')
            ?.value as Date | undefined;

          const data = {
            statuses: filters?.find((filter) => filter.id === 'status')?.value,
            types: filters?.find((filter) => filter.id === 'type')?.value,
            providers: filters?.find((filter) => filter.id === 'provider')
              ?.value,
          };

          if (fromDateValue && toDateValue) {
            Object.assign(data, {
              fromDate: formatDateForAPI(fromDateValue),
              toDate: formatDateForAPI(toDateValue),
            });
          }

          const response = await _request.post<
            PaginatedResponse<Transaction & DataTimestamp>
          >(
            `/users/${userId}/transactions/search`,
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
        }
      : skipToken,
  });
};

export const useGetPreviewRefundTransactionQuery = (
  subscriptionId?: string,
  userId?: string,
) => {
  const _request = useAxios();

  return useQuery({
    queryKey: [
      TransactionKeys.GetPreviewRefundTransactionQuery,
      userId,
      subscriptionId,
    ],
    queryFn:
      userId && subscriptionId
        ? async ({ signal }) => {
            const response = await _request.get<Transaction & DataTimestamp>(
              `/users/${userId}/subscriptions/${subscriptionId}/refund`,
              {
                signal,
              },
            );

            return response.data;
          }
        : skipToken,
    enabled: !!userId && !!subscriptionId,
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
      const fromDateValue = filters?.find((filter) => filter.id === 'fromDate')
        ?.value as Date | undefined;
      const toDateValue = filters?.find((filter) => filter.id === 'toDate')
        ?.value as Date | undefined;

      const data = {
        statuses: filters?.find((filter) => filter.id === 'status')?.value,
        types: filters?.find((filter) => filter.id === 'type')?.value,
        providers: filters?.find((filter) => filter.id === 'provider')?.value,
      };

      if (fromDateValue && toDateValue) {
        Object.assign(data, {
          fromDate: formatDateForAPI(fromDateValue),
          toDate: formatDateForAPI(toDateValue),
        });
      }

      const response = await _request.post<
        PaginatedResponse<Transaction & DataTimestamp>
      >(
        '/transactions/search',
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

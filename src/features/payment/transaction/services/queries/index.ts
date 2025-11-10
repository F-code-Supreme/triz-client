import { skipToken, useQuery } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';

import { TransactionKeys } from './keys';

import type { Transaction } from '../../types';
import type { DataTimestamp, PaginatedResponse } from '@/types';
import type { PaginationState } from '@tanstack/react-table';

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
  userId?: string,
) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [
      TransactionKeys.GetAllTransactionsByUserQuery,
      userId,
      pagination,
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
            },
          });

          return response.data;
        }
      : skipToken,
    enabled: !!userId,
  });
};

// ADMIN
export const useGetAllTransactionsQuery = (pagination: PaginationState) => {
  const _request = useAxios();

  return useQuery({
    queryKey: [TransactionKeys.GetAllTransactionsQuery, pagination],
    queryFn: async ({ signal }) => {
      const response = await _request.get<
        PaginatedResponse<Transaction & DataTimestamp>
      >('/transactions', {
        params: {
          page: pagination.pageIndex,
          size: pagination.pageSize,
        },
        signal,
      });

      return response.data;
    },
  });
};

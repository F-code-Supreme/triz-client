import { skipToken, useQuery } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';

import { TransactionKeys } from './keys';

import type { Transaction } from '../../types';
import type { DataTimestamp, PaginatedResponse } from '@/types';

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
export const useGetAllTransactionsByUserQuery = (userId?: string) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [TransactionKeys.GetAllTransactionsByUserQuery, userId],
    queryFn: userId
      ? async ({ signal }) => {
          const response = await _request.get<
            PaginatedResponse<Transaction & DataTimestamp>
          >(`/users/${userId}/transactions`, {
            signal,
          });

          return response.data;
        }
      : skipToken,
  });
};

// ADMIN
export const useGetAllTransactionsQuery = () => {
  const _request = useAxios();

  return useQuery({
    queryKey: [TransactionKeys.GetAllTransactionsQuery],
    queryFn: async ({ signal }) => {
      const response = await _request.get<
        PaginatedResponse<Transaction & DataTimestamp>
      >('/transactions', {
        signal,
      });

      return response.data;
    },
  });
};

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';

import { TransactionKeys } from '../queries/keys';

import type {
  ICancelTransactionByUserPayload,
  ICancelTransactionPayload,
} from './types';
import type { Transaction } from '../../types';
import type { DataTimestamp } from '@/types';

// AUTHENTICATED USER & ADMIN
export const useCancelTransactionByUserMutation = () => {
  const _request = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ICancelTransactionByUserPayload) => {
      const { userId, transactionId } = payload;
      const response = await _request.delete<Transaction & DataTimestamp>(
        `/users/${userId}/transactions/${transactionId}/cancel`,
      );

      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          TransactionKeys.GetTransactionByIdQuery,
          variables.transactionId,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          TransactionKeys.GetAllTransactionsByUserQuery,
          variables.userId,
        ],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: [TransactionKeys.GetAllTransactionsQuery],
        exact: false,
      });
    },
  });
};

// ADMIN
export const useCancelTransactionMutation = () => {
  const _request = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ICancelTransactionPayload) => {
      const { transactionId } = payload;
      const response = await _request.delete<Transaction & DataTimestamp>(
        `/transactions/${transactionId}/cancel`,
      );

      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          TransactionKeys.GetTransactionByIdQuery,
          variables.transactionId,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [TransactionKeys.GetAllTransactionsQuery],
        exact: false,
      });
    },
  });
};

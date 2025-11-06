import { skipToken, useQuery } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';

import { WalletKeys } from './keys';

import type { Wallet } from '../../types';
import type { DataTimestamp } from '@/types';

// AUTHENTICATED USER & ADMIN
export const useGetWalletByUserQuery = (userId?: string) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [WalletKeys.GetWalletByUserQuery, userId],
    queryFn: userId
      ? async ({ signal }) => {
          const response = await _request.get<Wallet & DataTimestamp>(
            `/users/${userId}/wallets`,
            {
              signal,
            },
          );

          return response.data;
        }
      : skipToken,
  });
};

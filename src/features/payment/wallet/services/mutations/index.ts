import { useMutation } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';

import type { ITopupWalletPayload, ITopupWalletResponse } from './types';

// AUTHENTICATED USER
export const useTopupWalletMutation = () => {
  const _request = useAxios();
  return useMutation({
    mutationFn: async (payload: ITopupWalletPayload) => {
      const { amount, provider, returnUrl } = payload;
      const response = await _request.post<ITopupWalletResponse>(
        `/wallets/topup`,
        {
          amount,
          provider,
          returnUrl,
        },
      );

      return response;
    },
  });
};

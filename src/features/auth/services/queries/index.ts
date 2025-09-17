import { skipToken, useQuery } from '@tanstack/react-query';

import { request } from '@/configs/axios';

import { AuthKeys } from './keys';

import type { IGetMeDataResponse } from './types';

export const useGetMeQuery = (token: string | null) => {
  return useQuery({
    queryKey: [AuthKeys.GetMeQuery],
    queryFn: token
      ? async () => {
          const response = await request.get<IGetMeDataResponse>('/auth/me');

          return response.data;
        }
      : skipToken,
  });
};

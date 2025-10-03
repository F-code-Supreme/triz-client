import { useQuery } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';

import { AuthKeys } from './keys';

import type { IGetMeDataResponse } from './types';

export const useGetMeQuery = () => {
  const _request = useAxios();
  return useQuery({
    queryKey: [AuthKeys.GetMeQuery],
    queryFn: async ({ signal }) => {
      const response = await _request.get<IGetMeDataResponse>('/auth/me', {
        signal,
      });

      return response.data;
    },
  });
};

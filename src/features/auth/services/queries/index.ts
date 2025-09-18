import { skipToken, useQuery } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';

import { AuthKeys } from './keys';

import type { IGetMeDataResponse } from './types';

export const useGetMeQuery = (shouldQuery: boolean) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [AuthKeys.GetMeQuery],
    queryFn: shouldQuery
      ? async () => {
          const response = await _request.get<IGetMeDataResponse>('/auth/me');

          return response.data;
        }
      : skipToken,
  });
};

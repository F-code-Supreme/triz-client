import { useQuery } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';

import { AuthKeys } from './keys';

import type { User } from '../../types';
import type { DataTimestamp } from '@/types';

export const useGetMeQuery = () => {
  const _request = useAxios();
  return useQuery({
    queryKey: [AuthKeys.GetMeQuery],
    queryFn: async ({ signal }) => {
      const response = await _request.get<User & DataTimestamp>('/auth/me', {
        signal,
      });

      return response.data;
    },
  });
};

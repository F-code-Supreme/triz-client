import { useQuery } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';
import { ModuleKeys } from '@/features/modules/services/queries/keys';

import type { ModuleResponse } from '@/features/modules/services/queries/types';

export const useGetModulesQuery = (page?: number, size?: number) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [ModuleKeys.GetModuleQuery, page, size],
    queryFn: async () => {
      const response = await _request.get<ModuleResponse>('/modules', {
        params: {
          page,
          size,
        },
      });

      return response.data;
    },
  });
};

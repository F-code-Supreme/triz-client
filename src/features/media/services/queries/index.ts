import { useQuery } from '@tanstack/react-query';

import { request } from '@/configs/axios';

import { MediaKeys } from './keys';

import type { IGetSupportedFileTypesResponse } from './types';

export const useGetSupportedFileTypesQuery = () => {
  return useQuery({
    queryKey: [MediaKeys.GetSupportedFileTypesQuery],
    queryFn: async ({ signal }) => {
      const response = await request.get<IGetSupportedFileTypesResponse>(
        '/files/supported-types',
        { signal },
      );

      return response.data;
    },
  });
};

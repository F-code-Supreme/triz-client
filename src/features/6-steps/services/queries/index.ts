import { skipToken, useQuery } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';

import { SixStepKeys } from './keys';

import type { IGetAllBookProgressDataResponse } from '@/features/book/services/queries/types';

export const useGetPrinciplesLookup = (
  improvingParam?: number,
  worseningParam?: number,
) => {
  const _request = useAxios();

  return useQuery({
    queryKey: [SixStepKeys.GetPrinciplesLookupQuery],

    queryFn:
      improvingParam && worseningParam
        ? async ({ signal }) => {
            const response =
              await _request.get<IGetAllBookProgressDataResponse>(
                '/triz40/solutions',
                {
                  params: {
                    improving: improvingParam,
                    worsening: worseningParam,
                  },
                  signal,
                },
              );

            return response.data;
          }
        : skipToken,
  });
};

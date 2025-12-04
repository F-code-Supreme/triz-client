import { skipToken, useQuery } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';

import { SixStepKeys } from './keys';

import type { IGetPrinciplesLookupDataResponse } from './types';

export const useGetPrinciplesLookupQuery = (
  improvingParam?: number,
  worseningParam?: number,
) => {
  const _request = useAxios();

  return useQuery({
    queryKey: [
      SixStepKeys.GetPrinciplesLookupQuery,
      improvingParam,
      worseningParam,
    ],

    queryFn:
      improvingParam && worseningParam
        ? async ({ signal }) => {
            const response =
              await _request.get<IGetPrinciplesLookupDataResponse>(
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

import { skipToken, useQuery } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';

import { SixStepKeys } from './keys';

import type {
  IGetJournalByIdDataResponse,
  IGetJournalsByUserDataResponse,
  IGetPrinciplesLookupDataResponse,
} from './types';

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

export const useGetJournalsByUserQuery = (userId?: string) => {
  const _request = useAxios();

  return useQuery({
    queryKey: [SixStepKeys.GetJournalsByUserQuery, userId],
    queryFn: userId
      ? async ({ signal }) => {
          const response = await _request.get<IGetJournalsByUserDataResponse>(
            `/users/${userId}/problems`,
            {
              signal,
            },
          );

          return response.data;
        }
      : skipToken,
  });
};

export const useGetJournalByIdQuery = (userId?: string, journalId?: string) => {
  const _request = useAxios();

  return useQuery({
    queryKey: [SixStepKeys.GetJournalsByUserQuery, userId, journalId],
    queryFn:
      userId && journalId
        ? async ({ signal }) => {
            const response = await _request.get<IGetJournalByIdDataResponse>(
              `/users/${userId}/problems/${journalId}`,
              {
                signal,
              },
            );

            return response.data;
          }
        : skipToken,
  });
};

import { useQuery } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';
import { PackageKeys } from '@/features/packages/services/queries/keys';

import type { ReportResponse } from '@/features/report/types';

export const useGetAllReportsQuery = () => {
  const _request = useAxios();
  return useQuery({
    queryKey: [PackageKeys.GetPackagesQuery],
    queryFn: async ({ signal }) => {
      const response = await _request.get<ReportResponse>('/reports', {
        signal,
      });

      return response.data;
    },
  });
};

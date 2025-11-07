import { useQuery } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';
import { PackageKeys } from '@/features/packages/services/queries/keys';

import type { PackageResponse } from '@/features/packages/types';

export const useGetPackagesQuery = () => {
  const _request = useAxios();
  return useQuery({
    queryKey: [PackageKeys.GetPackagesQuery],
    queryFn: async () => {
      const response = await _request.get<PackageResponse>('/packages');
      return response.data;
    },
  });
};

export const useGetDeletedPackagesQuery = () => {
  const _request = useAxios();
  return useQuery({
    queryKey: [PackageKeys.GetDeletedPackagesQuery],
    queryFn: async () => {
      const response = await _request.get<PackageResponse>('/packages/deleted');
      return response.data;
    },
  });
};

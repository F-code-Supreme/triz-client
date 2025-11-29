import { skipToken, useQuery } from '@tanstack/react-query';

import { request, useAxios } from '@/configs/axios';
import { PackageKeys } from '@/features/packages/services/queries/keys';

import type { Package, PackageResponse } from '@/features/packages/types';

// PUBLIC
export const useGetActivePackagesQuery = () => {
  return useQuery({
    queryKey: [PackageKeys.GetActivePackagesQuery],
    queryFn: async ({ signal }) => {
      const response = await request.get<Package[]>('/packages/public', {
        signal,
      });

      return response.data;
    },
  });
};

export const useGetPackageByIdQuery = (packageId?: string) => {
  return useQuery({
    queryKey: [PackageKeys.GetPackageByIdQuery, packageId],
    queryFn: packageId
      ? async ({ signal }) => {
          const response = await request.get<Package>(
            `/packages/${packageId}`,
            {
              signal,
            },
          );

          return response.data;
        }
      : skipToken,
    enabled: !!packageId,
  });
};

// ADMIN
export const useGetPackagesQuery = () => {
  const _request = useAxios();
  return useQuery({
    queryKey: [PackageKeys.GetPackagesQuery],
    queryFn: async ({ signal }) => {
      const response = await _request.get<PackageResponse>('/packages', {
        signal,
      });

      return response.data;
    },
  });
};

export const useGetDeletedPackagesQuery = () => {
  const _request = useAxios();
  return useQuery({
    queryKey: [PackageKeys.GetDeletedPackagesQuery],
    queryFn: async ({ signal }) => {
      const response = await _request.get<PackageResponse>(
        '/packages/deleted',
        {
          signal,
        },
      );

      return response.data;
    },
  });
};

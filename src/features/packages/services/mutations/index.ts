import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';

import { PackageKeys } from '../queries/keys';

import type { CreatePackagePayload, UpdatePackagePayload } from './types';
import type { Package } from '../../types';
import type { Response } from '@/types';

// ADMIN
export const useCreatePackageMutation = () => {
  const queryClient = useQueryClient();
  const _request = useAxios();
  return useMutation({
    mutationFn: async (payload: CreatePackagePayload) => {
      const response = await _request.post<Response<Package>>(
        '/packages',
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PackageKeys.GetPackagesQuery],
      });
    },
  });
};

export const useUpdatePackageMutation = () => {
  const queryClient = useQueryClient();
  const _request = useAxios();
  return useMutation({
    mutationFn: async (payload: UpdatePackagePayload) => {
      const { id, ...data } = payload;
      const response = await _request.patch<Response<Package>>(
        `/packages/${id}`,
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PackageKeys.GetPackagesQuery],
      });
    },
  });
};

export const useDeletePackageMutation = () => {
  const queryClient = useQueryClient();
  const _request = useAxios();
  return useMutation({
    mutationFn: async (packageId: string) => {
      const response = await _request.delete(`/packages/${packageId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PackageKeys.GetPackagesQuery],
      });
      queryClient.invalidateQueries({
        queryKey: [PackageKeys.GetDeletedPackagesQuery],
      });
    },
  });
};

export const useRestorePackageMutation = () => {
  const queryClient = useQueryClient();
  const _request = useAxios();
  return useMutation({
    mutationFn: async (packageId: string) => {
      const response = await _request.patch<Response<Package>>(
        `/packages/${packageId}/restore`,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PackageKeys.GetPackagesQuery],
      });
      queryClient.invalidateQueries({
        queryKey: [PackageKeys.GetDeletedPackagesQuery],
      });
    },
  });
};

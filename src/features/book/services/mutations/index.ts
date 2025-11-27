import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { useAxios } from '@/configs/axios';
import useAuth from '@/features/auth/hooks/use-auth';

import { BookKeys } from '../queries/keys';

import type {
  IUpdateBookPayload,
  ITrackProgressPayload,
  ITrackProgressDataResponse,
  IDeleteBookPayload,
  IRestoreBookPayload,
} from './types';
import type { AdminBook } from '../../types';
import type { IUploadFilePayload } from '@/features/media/services/mutations/types';
import type { DataTimestamp } from '@/types';

// AUTHENTICATED USER
export const useTrackBookProgressMutation = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const _request = useAxios();
  return useMutation({
    mutationFn: async (payload: ITrackProgressPayload) => {
      const { bookId, location, percentage } = payload;
      const response = await _request.put<ITrackProgressDataResponse>(
        `/books/${bookId}/users/${user?.id}/track`,
        {
          location,
          percentage,
        },
      );

      return response;
    },
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({
        queryKey: [BookKeys.GetBookProgressQuery, payload.bookId, user?.id],
      });
    },
  });
};

// ADMIN
export const useUploadFileMutation = () => {
  const _request = useAxios();
  const [progress, setProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: async (payload: IUploadFilePayload) => {
      const formData = new FormData();
      formData.append('file', payload.file);

      const response = await _request.upload<string>({
        url: '/books/files',
        formData,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setProgress(percentCompleted);
          }
        },
      });

      return response;
    },
  });

  return { ...mutation, progress };
};

export const useCreateBookMutation = () => {
  const queryClient = useQueryClient();
  const _request = useAxios();
  return useMutation({
    mutationFn: async (payload: Omit<AdminBook, 'id'>) => {
      const response = await _request.post<AdminBook & DataTimestamp>(
        '/books',
        payload,
      );

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [BookKeys.GetAllBooksAdminQuery],
      });
    },
  });
};

export const useUpdateBookMutation = () => {
  const queryClient = useQueryClient();
  const _request = useAxios();
  return useMutation({
    mutationFn: async (payload: IUpdateBookPayload) => {
      const { bookId, ...data } = payload;
      const response = await _request.put<AdminBook & DataTimestamp>(
        `/books/${bookId}`,
        data,
      );

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [BookKeys.GetAllBooksAdminQuery],
      });
    },
  });
};

export const useDeleteBookMutation = () => {
  const queryClient = useQueryClient();
  const _request = useAxios();
  return useMutation({
    mutationFn: async (payload: IDeleteBookPayload) => {
      const { bookId, force } = payload;
      const response = await _request.delete(`/books/${bookId}`, {
        force,
      });

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [BookKeys.GetAllBooksAdminQuery],
      });
    },
  });
};

export const useRestoreBookMutation = () => {
  const queryClient = useQueryClient();
  const _request = useAxios();
  return useMutation({
    mutationFn: async (payload: IRestoreBookPayload) => {
      const { bookId } = payload;
      const response = await _request.patch<AdminBook & DataTimestamp>(
        `/books/${bookId}/restore`,
      );

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [BookKeys.GetAllBooksAdminQuery],
      });
    },
  });
};

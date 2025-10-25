import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { useAxios } from '@/configs/axios';

import { BookKeys } from '../queries/keys';

import type {
  IUploadBookPayload,
  IUpdateBookPayload,
  ITrackProgressPayload,
  ITrackProgressDataResponse,
} from './types';
import type { Book } from '../../types';
import type { DataTimestamp } from '@/types';

export const useUploadBookMutation = () => {
  const _request = useAxios();
  const [progress, setProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: async (payload: IUploadBookPayload) => {
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
    mutationFn: async (payload: Omit<Book, 'id'>) => {
      const response = await _request.post<Book & DataTimestamp>(
        '/books',
        payload,
      );

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [BookKeys.GetAllBooksQuery],
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
      const response = await _request.put<Book & DataTimestamp>(
        `/books/${bookId}`,
        data,
      );

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [BookKeys.GetAllBooksQuery],
      });
    },
  });
};

export const useDeleteBookMutation = () => {
  const queryClient = useQueryClient();
  const _request = useAxios();
  return useMutation({
    mutationFn: async (bookId: string) => {
      const response = await _request.delete(`/books/${bookId}`);

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [BookKeys.GetAllBooksQuery],
      });
    },
  });
};

export const useTrackBookProgressMutation = () => {
  const queryClient = useQueryClient();
  const _request = useAxios();
  return useMutation({
    mutationFn: async (payload: ITrackProgressPayload) => {
      const { bookId, userId, location } = payload;
      const response = await _request.put<ITrackProgressDataResponse>(
        `/books/${bookId}/users/${userId}/track`,
        {
          location,
        },
      );

      return response;
    },
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({
        queryKey: [
          BookKeys.GetBookProgressQuery,
          payload.bookId,
          payload.userId,
        ],
      });
    },
  });
};

import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import { request } from '@/configs/axios';

import type { IUploadFilePayload } from './types';

export const useUploadFileMutation = () => {
  const [progress, setProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: async (payload: IUploadFilePayload) => {
      const formData = new FormData();
      formData.append('file', payload.file);

      const response = await request.upload<string>({
        url: '/files/upload',
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

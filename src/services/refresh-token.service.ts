import axios from 'axios';

import { axiosBaseOptions } from '@/configs/axios/axios-setup';
import { TokenManager } from '@/utils/token/token-manager';

import type { ILoginDataResponse } from '@/features/auth/services/mutations/types';
import type { Response } from '@/types';

/**
 * Refresh token service
 * Handles token refresh calls without auth interceptor to avoid infinite loops
 */

// Create a separate axios instance for refresh token requests to avoid interceptor conflicts
const refreshTokenAxiosInstance = axios.create(axiosBaseOptions);

export const refreshTokenService =
  async (): Promise<ILoginDataResponse | null> => {
    try {
      const refreshToken = TokenManager.getRefreshToken();

      if (!refreshToken) {
        return null;
      }

      const response = await refreshTokenAxiosInstance.post<
        Response<ILoginDataResponse>
      >('/auth/refreshToken', { refreshToken });

      // Extract data from response if it has a data property
      const responseData = response.data.data || response.data;

      return responseData as ILoginDataResponse;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  };

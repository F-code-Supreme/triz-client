import { refreshTokenService } from '@/services/refresh-token.service';
import { TokenManager } from '@/utils/token/token-manager';

import type { AxiosError, AxiosInstance } from 'axios';

/**
 * Adds token refresh interceptor to axios instance
 * Automatically refreshes token on 401 error
 */

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: AxiosError) => void;
}> = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null,
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

export const setupTokenRefreshInterceptor = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const originalRequest = error.config as Record<string, any>;

      // If error is 401 and we haven't already tried to refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // If already refreshing, queue this request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const newTokenData = await refreshTokenService();

          if (!newTokenData) {
            // Refresh failed, logout user
            TokenManager.clearTokens();
            processQueue(error, null);
            return Promise.reject(error);
          }

          // Update tokens
          TokenManager.setAccessToken(newTokenData.accessToken);
          TokenManager.setRefreshToken(newTokenData.refreshToken);

          // Retry original request with new token
          const newToken = newTokenData.accessToken;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          processQueue(null, newToken);
          isRefreshing = false;

          return axiosInstance(originalRequest);
        } catch (err) {
          // Refresh failed, logout user
          TokenManager.clearTokens();
          processQueue(err as AxiosError, null);
          isRefreshing = false;
          return Promise.reject(err);
        }
      }

      return Promise.reject(error);
    },
  );
};

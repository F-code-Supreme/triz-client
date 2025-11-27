import { useCallback } from 'react';

import useAuth from '@/features/auth/hooks/use-auth';
import { refreshTokenService } from '@/services/refresh-token.service';
import { TokenManager } from '@/utils/token/token-manager';

/**
 * Hook for manual token refresh
 * Useful when you need to explicitly refresh the token
 */

export const useRefreshToken = () => {
  const { refreshTokenAuth } = useAuth();

  const refresh = useCallback(async () => {
    try {
      const newTokenData = await refreshTokenService();

      if (!newTokenData) {
        console.error('Failed to refresh token');
        return false;
      }

      // Update tokens in storage
      TokenManager.setAccessToken(newTokenData.accessToken);
      TokenManager.setRefreshToken(newTokenData.refreshToken);

      // Update auth context
      refreshTokenAuth(newTokenData.accessToken, newTokenData.refreshToken);

      return true;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  }, [refreshTokenAuth]);

  return { refresh };
};

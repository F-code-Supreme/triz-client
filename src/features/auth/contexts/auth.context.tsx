import { createContext, useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { STRING_EMPTY } from '@/constants';
import { useBoolean } from '@/hooks';
import { useLocalStorage } from '@/hooks/use-local-storage/use-local-storage';
import { sleep } from '@/utils';
import { decodeToken, isTokenExpired } from '@/utils/jwt/jwt';

import { useLoginMutation, useRegisterMutation } from '../services/mutations';
import { TokenType } from '../types';

import type {
  ILoginPayload,
  IRegisterPayload,
} from '../services/mutations/types';
import type { User, AppJwtPayload } from '../types';
import type { PropsWithChildren } from 'react';

export type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  persist: boolean;
  refreshToken: string | null;
  setPersist: (value: boolean) => void;
  login: (data: ILoginPayload, cb?: () => void) => void;
  isLoggingIn: boolean;
  register: (data: IRegisterPayload, cb?: () => void) => void;
  isRegistering: boolean;
  logout: () => void;
  refreshTokenAuth: (accessToken: string, refreshToken: string) => void;
  verifyOtpPasswordReset: (accessToken: string) => void;
  resetPassword: () => void;
};

const AuthContext = createContext<AuthState>({
  isAuthenticated: false,
  user: null,
  persist: false,
  refreshToken: null,
  setPersist: () => false,
  login: () => {},
  isLoggingIn: false,
  register: () => {},
  isRegistering: false,
  logout: () => {},
  refreshTokenAuth: () => {},
  verifyOtpPasswordReset: () => {},
  resetPassword: () => {},
});

const AuthProvider = ({ children }: PropsWithChildren) => {
  const { value: isAuthenticated, setValue: setIsAuthenticated } =
    useBoolean(false);
  const { value: isAuthenticating, setValue: setIsAuthenticating } =
    useBoolean(true);
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useLocalStorage<string | null>(
    TokenType.ACCESS,
    null,
  );
  const [refreshToken, setRefreshToken] = useLocalStorage<string | null>(
    TokenType.REFRESH,
    null,
  );
  const [persist, setPersist] = useLocalStorage('persist', false);
  const { mutate: loginMutate, isPending: isLoggingIn } = useLoginMutation();
  const { mutate: registerMutate, isPending: isRegistering } =
    useRegisterMutation();

  useEffect(() => {
    setIsAuthenticating(true);

    if (!accessToken || isTokenExpired(accessToken)) {
      setIsAuthenticated(false);
      setUser(null);
      setIsAuthenticating(false);
      return;
    }

    const payload = decodeToken<AppJwtPayload>(accessToken);
    if (payload) {
      setIsAuthenticated(true);
      setUser({
        id: payload.userId,
        email: payload.sub || STRING_EMPTY,
        roles: payload.authorities,
      });
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }

    setIsAuthenticating(false);
  }, [accessToken, setIsAuthenticated, setIsAuthenticating]);

  const login = useCallback(
    (data: ILoginPayload, cb?: () => void) => {
      loginMutate(data, {
        onSuccess: async ({ data }) => {
          setAccessToken(data.accessToken);
          setRefreshToken(data.refreshToken);
          // Add a tiny delay to ensure state updates propagate before executing the callback
          await sleep(1);
          if (cb) cb();
        },
        onError: (error) => {
          toast.error(
            error.response?.data.message ||
              'Failed to login. Please try again.',
          );
        },
      });
    },
    [loginMutate, setAccessToken, setRefreshToken],
  );

  const register = useCallback(
    (data: IRegisterPayload, cb?: () => void) => {
      registerMutate(data, {
        onSuccess: () => {
          if (cb) cb();
        },
        onError: (error) => {
          toast.error(
            error.response?.data.message ||
              'Failed to register. Please try again.',
          );
        },
      });
    },
    [registerMutate],
  );

  const logout = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
  }, [setAccessToken, setRefreshToken]);

  const refreshTokenAuth = useCallback(
    (accessToken: string, refreshToken: string) => {
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
    },
    [setAccessToken, setRefreshToken],
  );

  const verifyOtpPasswordReset = useCallback(
    (accessToken: string) => {
      setAccessToken(accessToken);
    },
    [setAccessToken],
  );

  const resetPassword = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
  }, [setAccessToken, setRefreshToken]);

  if (isAuthenticating) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        persist,
        refreshToken,
        setPersist,
        login,
        isLoggingIn,
        register,
        isRegistering,
        logout,
        refreshTokenAuth,
        verifyOtpPasswordReset,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

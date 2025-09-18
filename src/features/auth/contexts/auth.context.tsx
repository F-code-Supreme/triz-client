import { createContext, useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { useLocalStorage } from '@/hooks/use-local-storage/use-local-storage';

import { useLoginMutation, useRegisterMutation } from '../services/mutations';
import { useGetMeQuery } from '../services/queries';
import { TokenType, type User } from '../types';

import type {
  ILoginPayload,
  IRegisterPayload,
} from '../services/mutations/types';
import type { PropsWithChildren } from 'react';

export type AuthState = {
  isAuthenticated: boolean;
  isAuthenticating: boolean;
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
  isAuthenticating: false,
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
  const { data: userData, isLoading: isAuthenticating } = useGetMeQuery(
    !!accessToken && isAuthenticated,
  );

  useEffect(() => {
    if (userData) {
      setUser({
        id: userData.id,
        email: userData.email,
        roles: userData.roles,
      });
    } else {
      setUser(null);
    }
  }, [userData]);

  const login = useCallback(
    (data: ILoginPayload, cb?: () => void) => {
      loginMutate(data, {
        onSuccess: ({ data }) => {
          setAccessToken(data.accessToken);
          setRefreshToken(data.refreshToken);
          setIsAuthenticated(true);
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
    setIsAuthenticated(false);
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
    setIsAuthenticated(false);
  }, [setAccessToken, setRefreshToken]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAuthenticating,
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

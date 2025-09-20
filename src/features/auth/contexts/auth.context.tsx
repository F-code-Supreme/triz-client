import { createContext, useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { STRING_EMPTY } from '@/constants';
import { useBoolean, useLocalStorage, useSessionStorage } from '@/hooks';
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
  refreshToken: string | null;
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
  refreshToken: null,
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

  const [persist] = useLocalStorage('persist', false);

  // Use conditional storage based on persist preference
  const [localAccessToken, setLocalAccessToken] = useLocalStorage<
    string | null
  >(TokenType.ACCESS, null);
  const [sessionAccessToken, setSessionAccessToken] = useSessionStorage<
    string | null
  >(TokenType.ACCESS, null);
  const [localRefreshToken, setLocalRefreshToken] = useLocalStorage<
    string | null
  >(TokenType.REFRESH, null);
  const [sessionRefreshToken, setSessionRefreshToken] = useSessionStorage<
    string | null
  >(TokenType.REFRESH, null);

  // Use the appropriate storage based on persist setting
  const accessToken = persist ? localAccessToken : sessionAccessToken;
  const refreshToken = persist ? localRefreshToken : sessionRefreshToken;
  const setAccessToken = persist ? setLocalAccessToken : setSessionAccessToken;
  const setRefreshToken = persist
    ? setLocalRefreshToken
    : setSessionRefreshToken;

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

  // Handle persist state changes - transfer tokens between storage types
  useEffect(() => {
    if (persist) {
      // Moving to localStorage - transfer from sessionStorage if exists
      if (sessionAccessToken) {
        setLocalAccessToken(sessionAccessToken);
        setSessionAccessToken(null);
      }
      if (sessionRefreshToken) {
        setLocalRefreshToken(sessionRefreshToken);
        setSessionRefreshToken(null);
      }
    } else {
      // Moving to sessionStorage - transfer from localStorage if exists
      if (localAccessToken) {
        setSessionAccessToken(localAccessToken);
        setLocalAccessToken(null);
      }
      if (localRefreshToken) {
        setSessionRefreshToken(localRefreshToken);
        setLocalRefreshToken(null);
      }
    }
  }, [
    persist,
    localAccessToken,
    sessionAccessToken,
    localRefreshToken,
    sessionRefreshToken,
    setLocalAccessToken,
    setSessionAccessToken,
    setLocalRefreshToken,
    setSessionRefreshToken,
  ]);

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
    setLocalAccessToken(null);
    setLocalRefreshToken(null);
    setSessionAccessToken(null);
    setSessionRefreshToken(null);
    setIsAuthenticated(false);
    setUser(null);
  }, [
    setLocalAccessToken,
    setLocalRefreshToken,
    setSessionAccessToken,
    setSessionRefreshToken,
    setIsAuthenticated,
  ]);

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
        refreshToken,
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

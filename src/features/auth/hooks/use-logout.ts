import { useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';

import useAuth from './use-auth';
import { useLogoutMutation } from '../services/mutations';

const useLogout = () => {
  const navigate = useNavigate();
  const { logout: clientLogout } = useAuth();
  const { mutate: logoutMutate } = useLogoutMutation();

  const logout = useCallback(() => {
    logoutMutate(undefined, {
      onSettled: async () => {
        clientLogout();
        await new Promise((resolve) => setTimeout(resolve, 0));
        navigate({ to: '/' });
      },
    });
  }, [logoutMutate, clientLogout, navigate]);

  return logout;
};

export default useLogout;

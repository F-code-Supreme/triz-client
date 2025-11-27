import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';

import useAuth from './use-auth';
import { useLogoutMutation } from '../services/mutations';

const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { logout: clientLogout } = useAuth();
  const { mutate: logoutMutate } = useLogoutMutation();

  const logout = useCallback(() => {
    logoutMutate(undefined, {
      onSettled: async () => {
        clientLogout();
        await queryClient.invalidateQueries();
        navigate({ to: '/' });
      },
    });
  }, [logoutMutate, clientLogout, queryClient, navigate]);

  return logout;
};

export default useLogout;

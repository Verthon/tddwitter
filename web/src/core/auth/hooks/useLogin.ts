import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { authMutations, authQueries } from '../queries/authQueries';
import { INVALID_CREDENTIALS } from '../services/authService';

export type LoginErrorKind = 'invalidCredentials' | 'generic';

const toLoginErrorKind = (error: Error): LoginErrorKind =>
  error.message === INVALID_CREDENTIALS ? 'invalidCredentials' : 'generic';

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    ...authMutations.login(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: authQueries.me().queryKey,
      });
      navigate('/');
    },
  });

  return {
    login: mutate,
    isPending,
    errorKind: error ? toLoginErrorKind(error) : undefined,
  };
};

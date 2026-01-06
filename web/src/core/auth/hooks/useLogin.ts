import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { authMutations } from '../queries/authQueries';

export const useLogin = () => {
  const navigate = useNavigate();

  const { mutate, isPending, isError } = useMutation({
    ...authMutations.login(),
    onSuccess: () => {
      navigate('/');
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });

  return {
    login: mutate,
    isPending,
    isError,
  };
};

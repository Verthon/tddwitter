import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { authMutations } from '../queries/authQueries';

export const useRegister = () => {
  const navigate = useNavigate();

  const { mutate, isPending, isError } = useMutation({
    ...authMutations.register(),
    onSuccess: () => {
      navigate('/');
    },
    onError: (error) => {
      console.error('Registration error:', error);
    },
  });

  return {
    register: mutate,
    isPending,
    isError,
  };
};

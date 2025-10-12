import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { login } from '../services/authService';

export const useLogin = () => {
  const navigate = useNavigate();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: login,
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

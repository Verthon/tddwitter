import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { register } from '../services/authService';

export const useRegister = () => {
  const navigate = useNavigate();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: register,
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

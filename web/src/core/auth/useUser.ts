import { useQuery } from '@tanstack/react-query';
import { userQueries } from './queries/authQueries';
import { type User } from './types';

interface UseUserReturn {
  isError: boolean;
  isPending: boolean;
  data?: User;
}

export const useUser = (): UseUserReturn => {
  const { data, isPending, isError } = useQuery(userQueries.current());

  return {
    isError,
    isPending,
    data: data ? {
      userName: data.userName,
      profileDescription: data.profileDescription,
      avatarUrl: data.avatarUrl,
    } : undefined,
  };
};
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { authQueries } from './queries/authQueries';
import { type AuthorizationStatus } from './types';

interface UseAuthReturn {
  authorizationStatus: AuthorizationStatus;
  userId?: string;
}

const deriveAuthorizationStatus = (
  isPending: boolean,
  isError: boolean,
  error: Error | null,
  userId?: string
): AuthorizationStatus => {
  if (isPending) return 'pending';
  if (isError && error?.message === 'Unauthorized') return 'unauthenticated';
  if (isError) return 'error';
  if (userId) return 'authenticated';
  return 'unauthenticated';
};

export const useAuth = (): UseAuthReturn => {
  const { data, isPending, isError, error } = useQuery(authQueries.me());

  const authorizationStatus = useMemo(
    () => deriveAuthorizationStatus(isPending, isError, error, data?.userId),
    [isPending, isError, error, data?.userId]
  );

  return {
    authorizationStatus,
    userId: data?.userId,
  };
};
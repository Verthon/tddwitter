import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { authQueries } from './queries/authQueries';
import type { AuthorizationStatus } from './types';

interface UseAuthReturn {
  authorizationStatus: AuthorizationStatus;
  id?: number;
}

const deriveAuthorizationStatus = (
  isPending: boolean,
  isError: boolean,
  error: Error | null,
  id?: number,
): AuthorizationStatus => {
  if (isPending) return 'pending';
  if (isError && error?.message === 'Unauthorized') return 'unauthenticated';
  if (isError) return 'error';
  if (id !== undefined) return 'authenticated';
  return 'unauthenticated';
};

export const useAuth = (): UseAuthReturn => {
  const { data, isPending, isError, error } = useQuery(authQueries.me());

  const authorizationStatus = useMemo(
    () => deriveAuthorizationStatus(isPending, isError, error, data?.id),
    [isPending, isError, error, data?.id],
  );

  return {
    authorizationStatus,
    id: data?.id,
  };
};

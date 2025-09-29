import { queryOptions } from '@tanstack/react-query';
import { fetchMe, fetchUser } from '../services/authService';

const AUTH_QUERY_KEY = 'auth' as const;
const USER_QUERY_KEY = 'user' as const;

export const authQueries = {
  all: () => [AUTH_QUERY_KEY] as const,
  
  me: () =>
    queryOptions({
      queryKey: [...authQueries.all(), 'me'] as const,
      queryFn: fetchMe,
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: false, // Don't retry auth failures
    }),
} as const;

export const userQueries = {
  all: () => [USER_QUERY_KEY] as const,
  
  current: () =>
    queryOptions({
      queryKey: [...userQueries.all(), 'current'] as const,
      queryFn: fetchUser,
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    }),
} as const;

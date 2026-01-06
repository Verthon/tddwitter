import { queryOptions, mutationOptions } from '@tanstack/react-query';
import { fetchMe, fetchUser, login, register } from '../services/authService';
import type { LoginPayload, RegisterPayload } from '../types';

export const authQueries = {
  all: () => ['auth'] as const,
  me: () =>
    queryOptions({
      queryKey: [...authQueries.all(), 'me'] as const,
      queryFn: fetchMe,
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: false,
    }),
} as const;

export const userQueries = {
  all: () => ['user'] as const,
  current: () =>
    queryOptions({
      queryKey: [...userQueries.all(), 'current'] as const,
      queryFn: fetchUser,
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
    }),
} as const;

export const authMutations = {
  login: () =>
    mutationOptions({
      mutationFn: (data: LoginPayload) => login(data),
    }),
  register: () =>
    mutationOptions({
      mutationFn: (data: RegisterPayload) => register(data),
    }),
} as const;

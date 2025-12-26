import { mutationOptions } from '@tanstack/react-query';
import { createPost } from '../services/composerService';
import type { CreatePostRequest } from '../types';

export const composerMutations = {
  createPost: () =>
    mutationOptions({
      mutationFn: (data: CreatePostRequest) => createPost(data),
    }),
} as const;

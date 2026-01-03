import { queryOptions, mutationOptions } from '@tanstack/react-query';
import { fetchLikeMetadata, likePost, unlikePost } from '../services/engagementService';

export const engagementKeys = {
  all: ['engagement'] as const,
  likes: () => [...engagementKeys.all, 'likes'] as const,
  like: (postId: string) => [...engagementKeys.likes(), postId] as const,
};

export const engagementQueries = {
  likeMetadata: (postId: string) =>
    queryOptions({
      queryKey: engagementKeys.like(postId),
      queryFn: () => fetchLikeMetadata(postId),
    }),
};

export const engagementMutations = {
  likePost: () =>
    mutationOptions({
      mutationFn: (postId: string) => likePost(postId),
    }),
  unlikePost: () =>
    mutationOptions({
      mutationFn: (postId: string) => unlikePost(postId),
    }),
};

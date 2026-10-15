import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  engagementKeys,
  engagementMutations,
} from '../queries/engagementQueries';

export const useLikePost = (postId: string) => {
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    ...engagementMutations.likePost(),
    onSuccess: (metadata) =>
      queryClient.setQueryData(engagementKeys.like(postId), metadata),
  });

  const unlikeMutation = useMutation({
    ...engagementMutations.unlikePost(),
    onSuccess: (metadata) =>
      queryClient.setQueryData(engagementKeys.like(postId), metadata),
  });

  return {
    like: () => likeMutation.mutate(postId),
    unlike: () => unlikeMutation.mutate(postId),
  };
};

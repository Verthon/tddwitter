import { useMutation, useQueryClient } from '@tanstack/react-query';
import { engagementMutations, engagementKeys } from '../queries/engagementQueries';

export const useLikePost = (postId: string) => {
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    ...engagementMutations.likePost(),
    onSettled: () => queryClient.invalidateQueries({ queryKey: engagementKeys.like(postId) }),
  });

  const unlikeMutation = useMutation({
    ...engagementMutations.unlikePost(),
    onSettled: () => queryClient.invalidateQueries({ queryKey: engagementKeys.like(postId) }),
  });

  return {
    like: () => likeMutation.mutate(postId),
    unlike: () => unlikeMutation.mutate(postId),
  };
};

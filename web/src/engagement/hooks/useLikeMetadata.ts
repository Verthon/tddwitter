import { useQuery } from '@tanstack/react-query';
import { engagementQueries } from '../queries/engagementQueries';

export const useLikeMetadata = (postId: string) => {
  const { data } = useQuery({
    ...engagementQueries.likeMetadata(postId),
    select: (data) => ({
      isLiked: data.isLiked,
      likeCount: data.likeCount,
    }),
  });

  return {
    isLiked: data?.isLiked ?? false,
    likeCount: data?.likeCount ?? 0,
  };
};

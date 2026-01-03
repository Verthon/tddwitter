import type { LikeMetadata } from '../types';

const likeDatabase = new Map<string, LikeMetadata>();

export const getLikeMetadata = (postId: string): LikeMetadata => {
  if (!likeDatabase.has(postId)) {
    likeDatabase.set(postId, {
      isLiked: false,
      likeCount: Math.floor(Math.random() * 20),
    });
  }
  return likeDatabase.get(postId)!;
};

export const toggleLike = (postId: string): LikeMetadata => {
  const current = getLikeMetadata(postId);
  const updated: LikeMetadata = {
    isLiked: !current.isLiked,
    likeCount: current.isLiked ? current.likeCount - 1 : current.likeCount + 1,
  };
  likeDatabase.set(postId, updated);
  return updated;
};

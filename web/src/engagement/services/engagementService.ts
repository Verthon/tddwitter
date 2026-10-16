import { apiBase } from 'src/api/apiBase';
import type { LikeMetadata } from '../types';

export const fetchLikeMetadata = async (
  postId: string,
): Promise<LikeMetadata> => {
  const url = new URL(
    `${apiBase}/posts/${postId}/like`,
    window.location.origin,
  );

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch like metadata: ${response.statusText}`);
  }

  return response.json();
};

export const likePost = async (postId: string): Promise<LikeMetadata> => {
  const url = new URL(
    `${apiBase}/posts/${postId}/like`,
    window.location.origin,
  );

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to like post: ${response.statusText}`);
  }

  return response.json();
};

export const unlikePost = async (postId: string): Promise<LikeMetadata> => {
  const url = new URL(
    `${apiBase}/posts/${postId}/like`,
    window.location.origin,
  );

  const response = await fetch(url.toString(), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to unlike post: ${response.statusText}`);
  }

  return response.json();
};

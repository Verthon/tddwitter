import type { LikeMetadata } from '../types';

const apiUrl = import.meta.env.PUBLIC_ENGAGEMENT_API;

if (!apiUrl) {
  throw new Error('PUBLIC_ENGAGEMENT_API environment variable is not configured');
}

export const fetchLikeMetadata = async (postId: string): Promise<LikeMetadata> => {
  const url = new URL(`${apiUrl}/posts/${postId}/like`);

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
  const url = new URL(`${apiUrl}/posts/${postId}/like`);

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
  const url = new URL(`${apiUrl}/posts/${postId}/like`);

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

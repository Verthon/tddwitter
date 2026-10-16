import { apiBase } from 'src/api/apiBase';
import type { CreatePostRequest, CreatePostResponse } from '../types';

export const createPost = async (
  data: CreatePostRequest,
): Promise<CreatePostResponse> => {
  const url = new URL(`${apiBase}/posts`, window.location.origin);

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create post: ${response.statusText}`);
  }

  return response.json();
};

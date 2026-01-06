import { type CreatePostRequest, type CreatePostResponse } from '../types';

const apiUrl = import.meta.env.PUBLIC_COMPOSER_API;

if (!apiUrl) {
  throw new Error('PUBLIC_COMPOSER_API environment variable is not configured');
}

export const createPost = async (data: CreatePostRequest): Promise<CreatePostResponse> => {
  const url = new URL(`${apiUrl}/posts`);

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

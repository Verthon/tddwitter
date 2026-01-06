import { type TimelineResponse, type TimelineParams, type PostDetailResponse } from '../types';

const apiUrl = import.meta.env.PUBLIC_TIMELINE_API;

if (!apiUrl) {
  throw new Error('PUBLIC_TIMELINE_API environment variable is not configured');
}

export const fetchTimeline = async (params: TimelineParams = {}): Promise<TimelineResponse> => {
  const url = new URL(`${apiUrl}/timeline`);

  if (params.cursor) {
    url.searchParams.append('cursor', params.cursor);
  }

  if (params.limit) {
    url.searchParams.append('limit', params.limit.toString());
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch timeline: ${response.statusText}`);
  }

  return response.json();
};

export const fetchPostById = async (id: string): Promise<PostDetailResponse> => {
  const url = new URL(`${apiUrl}/timeline/${id}`);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Post not found: ${id}`);
    }
    throw new Error(`Failed to fetch post: ${response.statusText}`);
  }

  return response.json();
};
import { apiBase } from 'src/api/apiBase';
import type {
  PostDetailResponse,
  TimelineParams,
  TimelineResponse,
} from '../types';

export const fetchTimeline = async (
  params: TimelineParams = {},
): Promise<TimelineResponse> => {
  const url = new URL(`${apiBase}/timeline`, window.location.origin);

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

export const fetchPostById = async (
  id: string,
): Promise<PostDetailResponse> => {
  const url = new URL(`${apiBase}/timeline/${id}`, window.location.origin);

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

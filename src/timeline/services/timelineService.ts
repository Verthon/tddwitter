import { type TimelineResponse, type TimelineParams } from '../types';

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
import { http, HttpResponse } from 'msw';
import { type TimelineResponse } from '../types';
import { decodeCursor } from 'src/api/utils/cursor';
import { timelineMockItems } from './fixtures';

export const createTimelineHandler = (baseUrl: string) => {
  return http.get(`${baseUrl}/timeline`, ({ request }) => {
    const url = new URL(request.url);
    const cursor = url.searchParams.get('cursor');
    const limit = Number(url.searchParams.get('limit')) || 10;
    
    // Find starting index based on cursor
    let startIndex = 0;
    if (cursor) {
      const cursorTimestamp = decodeCursor(cursor);
      // Find the index of the first item after the cursor timestamp
      startIndex = timelineMockItems.findIndex(
        item => item.timestamp < cursorTimestamp
      );
      // If not found, return empty
      if (startIndex === -1) {
        const response: TimelineResponse = {
          items: [],
          nextCursor: null,
          hasMore: false,
        };
        return HttpResponse.json(response);
      }
    }
    
    // Get items for this page
    const items = timelineMockItems.slice(startIndex, startIndex + limit);
    const hasMore = startIndex + limit < timelineMockItems.length;
    
    // Create next cursor from last item's timestamp
    const nextCursor = hasMore && items.length > 0
      ? btoa(items[items.length - 1].timestamp)
      : null;
    
    const response: TimelineResponse = {
      items,
      nextCursor,
      hasMore,
    };
    
    // Simulate network delay
    return HttpResponse.json(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });
};
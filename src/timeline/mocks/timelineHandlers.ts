import { http, HttpResponse } from 'msw';
import { type TimelineResponse, type PostDetailResponse } from '../types';
import { decodeCursor } from 'src/api/utils/cursor';
import { timelineMockItems } from './fixtures';

export const createTimelineHandler = (baseUrl: string) => {
  return http.get(`${baseUrl}/timeline`, ({ request }) => {
    const url = new URL(request.url);
    const cursor = url.searchParams.get('cursor');
    const limit = Number(url.searchParams.get('limit')) || 10;

    let startIndex = 0;
    if (cursor) {
      const cursorTimestamp = decodeCursor(cursor);
      startIndex = timelineMockItems.findIndex(
        item => item.timestamp < cursorTimestamp
      );
      if (startIndex === -1) {
        const response: TimelineResponse = {
          items: [],
          nextCursor: null,
          hasMore: false,
        };
        return HttpResponse.json(response);
      }
    }

    const items = timelineMockItems.slice(startIndex, startIndex + limit);
    const hasMore = startIndex + limit < timelineMockItems.length;

    const nextCursor = hasMore && items.length > 0
      ? btoa(items.at(-1)!.timestamp)
      : null;

    const response: TimelineResponse = {
      items,
      nextCursor,
      hasMore,
    };

    return HttpResponse.json(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });
};

export const createPostDetailHandler = (baseUrl: string) => {
  return http.get(`${baseUrl}/timeline/:id`, ({ params }) => {
    const { id } = params;

    const post = timelineMockItems.find(item => item.id === id);

    if (!post) {
      return HttpResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const response: PostDetailResponse = {
      id: post.id,
      avatar: post.avatar,
      username: post.username,
      content: post.content,
      timestamp: post.timestamp,
    };

    return HttpResponse.json(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });
};
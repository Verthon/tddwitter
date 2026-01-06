import { http, HttpResponse } from 'msw';
import { getLikeMetadata, toggleLike } from './fixtures';

export const createEngagementHandlers = (baseUrl: string) => {
  return [
    http.get(`${baseUrl}/posts/:postId/like`, ({ params }) => {
      const { postId } = params;
      const metadata = getLikeMetadata(postId as string);

      return HttpResponse.json(metadata, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }),

    http.post(`${baseUrl}/posts/:postId/like`, ({ params }) => {
      const { postId } = params;
      const metadata = toggleLike(postId as string);

      if (!metadata.isLiked) {
        return HttpResponse.json(
          { error: 'Post was already liked' },
          { status: 400 }
        );
      }

      return HttpResponse.json(metadata, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }),

    http.delete(`${baseUrl}/posts/:postId/like`, ({ params }) => {
      const { postId } = params;
      const metadata = toggleLike(postId as string);

      if (metadata.isLiked) {
        return HttpResponse.json(
          { error: 'Post was not liked' },
          { status: 400 }
        );
      }

      return HttpResponse.json(metadata, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }),
  ];
};

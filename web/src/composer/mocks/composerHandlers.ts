import { http, HttpResponse } from 'msw';
import { type CreatePostRequest, type CreatePostResponse } from '../types';
import { dateService } from 'src/core/services/dateService';

export const createComposerHandler = (baseUrl: string) => {
  return http.post(`${baseUrl}/posts`, async ({ request }) => {
    const body = await request.json() as CreatePostRequest;

    const response: CreatePostResponse = {
      id: crypto.randomUUID(),
      content: body.content,
      timestamp: dateService.toISOString(),
      username: 'currentUser',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=currentUser',
    };

    return HttpResponse.json(response, {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });
};

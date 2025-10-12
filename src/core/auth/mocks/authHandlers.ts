import { http, HttpResponse } from 'msw';
import { mockMeResponse, mockUserResponse } from './fixtures';

export const createAuthHandlers = (baseUrl: string) => {
  return [
    http.get(`${baseUrl}/me`, () => {
      return HttpResponse.json(mockMeResponse);
    }),

    http.get(`${baseUrl}/user`, () => {
      return HttpResponse.json(mockUserResponse);
    }),

    http.post(`${baseUrl}/login`, async ({ request }) => {
      const body = (await request.json()) as { email: string; password: string };
      return HttpResponse.json({
        ...mockUserResponse,
        email: body.email,
      });
    }),

    http.post(`${baseUrl}/register`, async ({ request }) => {
      const body = (await request.json()) as { username: string; email: string; password: string };
      return HttpResponse.json({
        ...mockUserResponse,
        username: body.username,
        email: body.email,
      });
    }),
  ];
};
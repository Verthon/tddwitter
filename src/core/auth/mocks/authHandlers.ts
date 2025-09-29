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
  ];
};
import { http, type HttpResponse as MSWHttpResponse } from 'msw';
import { worker } from './mockServer';

export const createMockResponse = (baseUrl: string) => {
  return (
    method: 'get' | 'post' | 'delete' | 'put' | 'patch',
    endpoint: string,
    response: MSWHttpResponse
  ) => {
    const fullUrl = `${baseUrl}${endpoint}`;
    worker.use(http[method](fullUrl, () => response));
  };
};

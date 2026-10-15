import { http } from 'msw';
import { worker } from './mockServer';

export const createMockResponse = (baseUrl: string) => {
  return (
    method: 'get' | 'post' | 'delete' | 'put' | 'patch',
    endpoint: string,
    response: Response,
  ) => {
    const fullUrl = `${baseUrl}${endpoint}`;
    worker.use(http[method](fullUrl, () => response.clone()));
  };
};

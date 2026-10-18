import { HttpResponse, http, isCommonAssetRequest } from 'msw';
import { afterAll, afterEach, beforeAll } from 'vitest';

import 'src/App.css';
import {
  resetHandlers,
  stopMocking,
  worker,
} from 'src/integrations/mockServer';

const avatarHandler = http.get(
  'https://api.dicebear.com/*',
  () =>
    new HttpResponse(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"/>',
      { headers: { 'Content-Type': 'image/svg+xml' } },
    ),
);

beforeAll(async () => {
  await worker.start({
    quiet: true,
    onUnhandledRequest: (request, print) => {
      if (isCommonAssetRequest(request)) {
        return;
      }

      print.error();
    },
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  });
  worker.use(avatarHandler);
});
afterEach(() => {
  resetHandlers();
  worker.use(avatarHandler);
});
afterAll(() => stopMocking());

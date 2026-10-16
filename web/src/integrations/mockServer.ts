import { isCommonAssetRequest } from 'msw';
import { setupWorker } from 'msw/browser';
import { apiBase } from 'src/api/apiBase';
import { createComposerHandler } from 'src/composer/mocks/composerHandlers';
import { createAuthHandlers } from 'src/core/auth/mocks/authHandlers';
import { createEngagementHandlers } from 'src/engagement/mocks/engagementHandlers';
import {
  createPostDetailHandler,
  createTimelineHandler,
} from 'src/timeline/mocks/timelineHandlers';

const handlers = [
  createTimelineHandler(apiBase),
  createPostDetailHandler(apiBase),
  ...createAuthHandlers(`${apiBase}/auth`),
  createComposerHandler(apiBase),
  ...createEngagementHandlers(apiBase),
];

export const worker = setupWorker(...handlers);

export const startMocking = async (): Promise<void> => {
  if (import.meta.env.PUBLIC_MOCK === 'true') {
    await worker.start({
      onUnhandledRequest: (request, print) => {
        if (isCommonAssetRequest(request)) {
          return;
        }

        print.warning();
      },
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    });
  }
};

export const stopMocking = (): void => {
  worker.stop();
};

export const resetHandlers = (): void => {
  worker.resetHandlers();
};

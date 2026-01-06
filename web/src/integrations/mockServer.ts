import { isCommonAssetRequest } from "msw";
import { setupWorker } from "msw/browser";
import { createComposerHandler } from "src/composer/mocks/composerHandlers";
import { createAuthHandlers } from "src/core/auth/mocks/authHandlers";
import { createTimelineHandler, createPostDetailHandler } from "src/timeline/mocks/timelineHandlers";
import { createEngagementHandlers } from "src/engagement/mocks/engagementHandlers";

const timelineApiBase = import.meta.env.PUBLIC_TIMELINE_API;
const authApiBase = import.meta.env.PUBLIC_AUTH_API;
const composerApiBase = import.meta.env.PUBLIC_COMPOSER_API;
const engagementApiBase = import.meta.env.PUBLIC_ENGAGEMENT_API;

const handlers = [
  createTimelineHandler(timelineApiBase),
  createPostDetailHandler(timelineApiBase),
  ...createAuthHandlers(authApiBase),
  createComposerHandler(composerApiBase),
  ...createEngagementHandlers(engagementApiBase),
];

export const worker = setupWorker(...handlers);

export const startMocking = async (): Promise<void> => {
  if (import.meta.env.PUBLIC_MOCK === "true") {
    await worker.start({
      onUnhandledRequest: (request, print) => {
        if (isCommonAssetRequest(request)) {
          return;
        }

        print.warning();
      },
      serviceWorker: {
        url: "/mockServiceWorker.js",
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

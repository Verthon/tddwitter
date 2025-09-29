import { isCommonAssetRequest } from "msw";
import { setupWorker } from "msw/browser";
import { createTimelineHandler } from "src/timeline/mocks/timelineHandlers";

const timelineApiBase = import.meta.env.PUBLIC_TIMELINE_API ?? '';

const handlers = [createTimelineHandler(timelineApiBase)]

export const worker = setupWorker(...handlers);

export const startMocking = async (): Promise<void> => {
  if (import.meta.env.PUBLIC_MOCK === "true") {
    await worker.start({
      onUnhandledRequest: (request, print) => {
        if (isCommonAssetRequest(request)) {
          return;
        }

        print.warning()
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

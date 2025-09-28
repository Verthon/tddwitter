import { setupWorker } from 'msw/browser';

const handlers = [];

export const worker = setupWorker(...handlers);

export const startMocking = async (): Promise<void> => {
  if (import.meta.env.PUBLIC_MOCK === 'true') {
    await worker.start({
      onUnhandledRequest: 'warn',
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

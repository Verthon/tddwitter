import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type PropsWithChildren, useMemo } from 'react';

import { I18nProvider } from 'src/i18n/I18nProvider';

export const TestQueryProvider = ({ children }: PropsWithChildren) => {
  const client = useMemo(
    () =>
      new QueryClient({
        defaultOptions: { queries: { retry: false, staleTime: 0, gcTime: 0 } },
      }),
    [],
  );
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

export const TestI18nProvider = ({ children }: PropsWithChildren) => (
  <I18nProvider>{children}</I18nProvider>
);

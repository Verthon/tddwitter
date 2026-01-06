import { MemoryRouter } from "react-router";
import { useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { I18nProvider } from "src/i18n/I18nProvider";

export const TestRouterProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => (
  <MemoryRouter>
    {/* <AppRoutes /> */}
    {children}
  </MemoryRouter>
);

export const TestQueryProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const client = useMemo(
    () =>
      new QueryClient({
        defaultOptions: { queries: { retry: false, staleTime: 0, gcTime: 0 } },
      }),
    []
  );
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

export const TestI18nProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => <I18nProvider>{children}</I18nProvider>;
